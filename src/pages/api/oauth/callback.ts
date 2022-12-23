import { NextApiRequest, NextApiResponse } from "next";
import {
    profileFull,
    SpotifyCallbackResponse,
    SpotifyTokenResponse,
} from "../../../utils/types/oauth";
import { getQueriesType } from "../../../server/types/callback";
import {
    ClientIDSecretPair,
    LOGGING,
    RedirectUri,
    StateKey,
} from "../../../server/constants";
import { storeError } from "../../../server/utils/errorWrapper";
import { spotifyWrapRequest } from "../../../server/utils/spotifyApiWrapper";
import { createLoginCookie } from "../../../server/utils/cookies";
import { getRedisClient, quitRedis } from "../../../server/utils/redis";
import Redis from "ioredis";
import { getArtists } from "../../../server/utils/profileData/artists";
import { getSongs } from "../../../server/utils/profileData/songs";

// Stages of callback:
// 1. [Main] get code, state and error from query

// 2. [function A - parse query] Feed these into a function that does the following:
//      1. if error, return an error object
//      2. if state is not the same as the one in session, return an error object
//      3. if state is the same, return the code.

// 3. [Main] Using response from 2:
//      1. if error, log in redis and redirect to error page with error message
//      2. if code, proceed to next step

// 4. [function B - get auth code] Feed code into a function which does the following:
//      1. Post spotify api with code, auth type, client id, client secret, redirect uri
//      2. decode the response as json and validate it as a 'SpotifyTokenResponse' Type
//      3. if it's valid, return that validated object
//      4. if it's not valid, return an error object

// 5. [Main] Using response from 4:
//      1. if error, log in redis and redirect to error page with error message
//      2. if response, proceed to next step

// 6. [function C - get profile] Using response from 4:
//      1. Post spotify api to get user's profile
//      2. decode the response as json and validate it as a 'profileFull' Type
//      3. if it's valid, return that validated object
//      4. if it's not valid, return an error object

// 7. [Main] Using response from 6:
//      1. if error, log in redis and redirect to error page with error message
//      2. if response, proceed to next step

// 8. [function D - store profile] In a function, do the following:
//      1. Store the profile in redis
//      2. Store the token in redis with expiry
//      3. if anything fails, return an error object

// 9. [Main] Using response from 8:
//      1. if error, log in redis and redirect to error page with error message
//      2. if response, assemble a cookie and redirect to dashboard

export default async function callback(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const redisClient = getRedisClient();
    try {
        let LoggingId;
        if (LOGGING) LoggingId = Math.random().toString(36).substring(2, 15);
        console.log("[Callback] Callback Request Received.");
        // Step 1 & 2.
        const code = getQueryData(req.query, redisClient);
        if (LOGGING)
            console.log(`[Callback] [${LoggingId}] Query Data Parsed.`);

        // Step 3.
        if (!code.success) {
            if (LOGGING)
                console.log(`[Callback] [${LoggingId}] Query Data Error.`);
            res.redirect(`/error?error=${encodeURIComponent(code.error)}`);
            quitRedis(redisClient);
            return;
        }

        // Step 4.
        if (LOGGING)
            console.log(
                `[Callback] [${LoggingId}] Requesting access token from spotify.`
            );
        const accessToken = await spotifyWrapRequest<SpotifyTokenResponse>(
            "https://accounts.spotify.com/api/token",
            {
                method: "POST",
                contentType: "application/x-www-form-urlencoded",
                Authorization: ClientIDSecretPair,
                body: {
                    grant_type: "authorization_code",
                    code: encodeURIComponent(code.code),
                    redirect_uri: RedirectUri,
                },
            },
            redisClient
        );

        // Step 5.
        if (LOGGING)
            console.log(
                `[Callback] [${LoggingId}] Received an access token response from spotify.`
            );
        if (!accessToken.success || accessToken.data.access_token === "") {
            if (LOGGING)
                console.log(`[Callback] [${LoggingId}] Access token invalid.`);
            res.redirect(
                `/error?error=spotify_callback_error: ${encodeURIComponent(
                    !accessToken.success
                        ? accessToken.error
                        : "Access token undefined"
                )}`
            );
            quitRedis(redisClient);
            return;
        }

        // Step 6.
        if (LOGGING)
            console.log(
                `[Callback] [${LoggingId}] Requesting profile using access token.`
            );
        const userProfile = await spotifyWrapRequest<any>(
            "https://api.spotify.com/v1/me",
            {
                method: "GET",
                contentType: "application/json",
                Authorization: `Bearer ${accessToken.data.access_token}`,
                parameters: undefined,
            },
            redisClient
        );

        // Step 7.
        if (LOGGING)
            console.log(`[Callback] [${LoggingId}] Checking user profile.`);
        if (!userProfile.success) {
            if (LOGGING)
                console.log(
                    `[Callback] [${LoggingId}] User profile received is invalid.`
                );
            if (userProfile.code === 403) {
                res.redirect(
                    `/error?error=spotify_callback_error: ${encodeURIComponent(`Spotify responded to your profile request with a 403 error which means you were not logged in properly,
                 if you are using a developer version of this site that likely means you have not be whitelisted properly.
                  If not please try logging in again and if it still fails please alert our head developer at hi@alfieranstead.com`)}`
                );
            } else {
                res.redirect(
                    `/error?error=spotify_profile_request_failure:${encodeURIComponent(
                        userProfile.error
                    )}`
                );
            }
            quitRedis(redisClient);
            return;
        }
        if (LOGGING)
            console.log(`[Callback] [${LoggingId}] User profile is valid.`);

        // Step 8.
        const artists = await getArtists(
            redisClient,
            accessToken.data.access_token
        );
        const songs = await getSongs(
            redisClient,
            accessToken.data.access_token
        );

        const fullProfile: profileFull = {
            display_name: userProfile.data.display_name,
            id: userProfile.data.id,
            image_url:
                userProfile.data.images.length > 0
                    ? userProfile.data.images[0].url
                    : undefined,
            refresh_token: accessToken.data.refresh_token,
            artists:
                artists !== undefined
                    ? artists
                    : {
                          short_term: false,
                          medium_term: false,
                          long_term: false,
                      },
            songs:
                songs !== undefined
                    ? songs
                    : {
                          short_term: false,
                          medium_term: false,
                          long_term: false,
                      },
        };

        if (LOGGING)
            console.log(`[Callback] [${LoggingId}] Storing data in redis.`);

        redisClient.setex(
            `spotify:${fullProfile.id}:access`,
            accessToken.data.expires_in,
            accessToken.data.access_token
        );
        redisClient.setex(
            `spotify:${fullProfile.id}:profile`,
            3600 * 24 * 2,
            JSON.stringify(fullProfile)
        );

        console.log(`[Callback] User: ${fullProfile.id} just logged in.`);

        // Step 9.
        if (LOGGING)
            console.log(
                `[Callback] [${LoggingId}] Setting cookies and redirecting.`
            );
        const cookie = await createLoginCookie(fullProfile.id, redisClient);
        res.setHeader("Set-Cookie", cookie);
        res.redirect("/dashboard");
    } catch (e) {
        res.redirect(
            `/error?error=unexpected_callback_error: ${encodeURIComponent(
                JSON.stringify(e)
            )}`
        );

        await storeError(
            {
                api: "spotify",
                error: "Callback error",
                apiResponse: JSON.stringify(e),
                statusCode: 500,
                time: Date.now(),
            },
            redisClient
        );
    }
    quitRedis(redisClient);
    return;
}

function getQueryData(
    query: Partial<{ [p: string]: string | string[] }>,
    redisClient: Redis
): getQueriesType {
    const raw: SpotifyCallbackResponse = {
        code: query.code,
        state: query.state,
        error: query.error,
    } as SpotifyCallbackResponse;

    if (raw.error) {
        storeError(
            {
                api: "spotify",
                error: "[Callback] Error: Queries in callback redirect contained an error.",
                apiResponse: raw.error,
                statusCode: 500,
                time: Date.now(),
            },
            redisClient
        )
            .then(() => {
                console.log("[Callback] Query Error Stored Successfully.");
            })
            .catch(console.error);

        return { success: false, error: raw.error };
    } else if (raw.state !== StateKey) {
        storeError(
            {
                api: "spotify",
                error: "[Callback] Error: State did not match that assigned locally.",
                apiResponse: `${raw.state} !== ${StateKey}`,
                statusCode: 500,
                time: Date.now(),
            },
            redisClient
        )
            .then(() => {
                console.log("[Callback] Query Error Stored Successfully.");
            })
            .catch(console.error);

        return {
            success: false,
            error: "State key did not match that assigned by the server.",
        };
    }

    return { success: true, code: raw.code };
}
