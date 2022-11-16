import { NextApiRequest, NextApiResponse } from "next";
import {
    profileFull,
    SpotifyCallbackResponse,
    SpotifyTokenResponse,
} from "../../../utils/types/oauth";
import { getQueriesType } from "../../../server/types/callback";
import {
    ClientIDSecretPair,
    RedirectUri,
    redisClient,
    StateKey,
} from "../../../server/constants";
import { storeError } from "../../../server/utils/errorWrapper";
import { spotifyWrapRequest } from "../../../server/utils/spotifyApiWrapper";
import { createLoginCookie } from "../../../server/utils/cookies";

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
    // Step 1 & 2.
    const code = getQueryData(req.query);

    // Step 3.
    if (!code.success) {
        res.redirect(`/error/?error=${code.error}`);
        return;
    }

    // Step 4.
    const accessToken = await spotifyWrapRequest<SpotifyTokenResponse>(
        "https://accounts.spotify.com/api/token",
        {
            method: "POST",
            contentType: "application/x-www-form-urlencoded",
            Authorization: ClientIDSecretPair,
            body: {
                grant_type: "authorization_code",
                code: code.code,
                redirect_uri: RedirectUri,
            },
        }
    );

    // Step 5.
    if (!accessToken.success || accessToken.data.access_token === "") {
        res.redirect(
            `/error/?error=spotify_callback_error: ${
                !accessToken.success
                    ? accessToken.error
                    : "Access token undefined"
            }`
        );
        return;
    }

    // Step 6.
    const userProfile = await spotifyWrapRequest<any>(
        "https://api.spotify.com/v1/me",
        {
            method: "GET",
            contentType: "application/json",
            Authorization: `Bearer ${accessToken.data.access_token}`,
            parameters: undefined,
        }
    );

    // Step 7.
    if (!userProfile.success) {
        if (userProfile.code === 403) {
            res.redirect(
                `/error?error=Spotify responded to our profile request with a 403 error which means you were not logged in properly,
                 if you are using a developer version of this site that likely means you have not be whitelisted properly.
                  If not please try logging in again and if it still fails please alert our head developer at hi@alfieranstead.com`
            );
        } else {
            res.redirect(
                `/error?error=spotify_profile_request_failure:${userProfile.error}`
            );
        }
        return;
    }

    // Step 8.
    const fullProfile: profileFull = {
        display_name: userProfile.data.display_name,
        id: userProfile.data.id,
        image_url:
            userProfile.data.images.length > 0
                ? userProfile.data.images[0].url
                : undefined,
        refresh_token: accessToken.data.refresh_token,
    };

    redisClient.setex(
        fullProfile.id + "_access",
        accessToken.data.expires_in,
        accessToken.data.access_token
    );
    redisClient.setex(
        fullProfile.id + "_profile",
        3600 * 24 * 7,
        JSON.stringify(fullProfile)
    );

    console.log(`[Callback V2] User: ${fullProfile.id} just logged in.`);

    // Step 9.
    const cookie = await createLoginCookie(fullProfile.id);
    res.setHeader("Set-Cookie", cookie);
    res.redirect("/dashboard");
    return;
}

function getQueryData(
    query: Partial<{ [p: string]: string | string[] }>
): getQueriesType {
    const raw: SpotifyCallbackResponse = {
        code: query.code,
        state: query.state,
        error: query.error,
    } as SpotifyCallbackResponse;

    if (raw.error) {
        storeError({
            api: "spotify",
            error: "[Callback] Error: Queries in callback redirect contained an error.",
            apiResponse: raw.error,
            statusCode: 500,
            time: Date.now(),
        })
            .then(() => {
                console.log("[Callback] Query Error Stored Successfully.");
            })
            .catch(console.error);

        return { success: false, error: raw.error };
    } else if (raw.state !== StateKey) {
        storeError({
            api: "spotify",
            error: "[Callback] Error: State did not match that assigned locally.",
            apiResponse: `${raw.state} !== ${StateKey}`,
            statusCode: 500,
            time: Date.now(),
        })
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
