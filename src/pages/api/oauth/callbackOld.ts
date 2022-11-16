import { NextApiRequest, NextApiResponse } from "next";
import formurlencoded from "form-urlencoded";
import {
    profileFull,
    SpotifyCallbackResponse,
    SpotifyTokenResponse,
} from "../../../utils/types/oauth";
import {
    ClientIDSecretPair,
    RedirectUri,
    redisClient,
} from "../../../server/constants";
import { ApiError } from "../../../utils/types/errors";
import { createLoginCookie } from "../../../server/utils/cookies";

const intenseLogging = false;

export default async function callbackOld(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // TODO: clean this up and make it more readable before production
    let failed = false;
    if (intenseLogging)
        console.log("Callback request received, checking state...");
    // check if an error was returned
    const response: SpotifyCallbackResponse = {
        code: req.query.code,
        state: req.query.state,
        error: req.query.error,
    } as SpotifyCallbackResponse;

    if (response.error) {
        res.redirect("/login?error=" + response.error);
        if (intenseLogging)
            console.log(
                "Error returned, redirecting to login...\nError: " +
                    response.error
            );
        return;
    }

    // we're good, so post that code to spotify

    const data = {
        grant_type: "authorization_code",
        code: response.code,
        redirect_uri: RedirectUri,
    };

    if (intenseLogging) console.log("Sending auth code to Spotify...");

    const accessTokenResponseRaw = await fetch(
        "https://accounts.spotify.com/api/token",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: ClientIDSecretPair,
            },
            body: formurlencoded(data),
        }
    );
    let accessTokenResponse;
    try {
        accessTokenResponse = await accessTokenResponseRaw.json();
    } catch (error) {
        if (intenseLogging)
            console.log("Error at fetch accessTokenResponse: " + error);
        console.log(
            "SPOTIFY CALLBACK ERROR - ",
            error,
            "raw response: ",
            accessTokenResponseRaw.body
        );

        if (intenseLogging)
            console.log(
                "Assembling error object, pushing it to redis and redirecting to login..."
            );
        // create an error object and push it to redis
        const errorData: ApiError = {
            error: "spotify_callback_error",
            api: "spotify",
            statusCode: accessTokenResponseRaw.status,
            apiResponse: JSON.stringify(accessTokenResponseRaw.body),
            time: Date.now(),
        };
        await redisClient.lpush("errors", JSON.stringify(errorData));

        res.redirect(
            `/error?error=${`spotify_callback_error: ${JSON.stringify(
                error
            )}\nraw response: ${accessTokenResponseRaw.body}`}`
        );
        failed = true;
    }

    if (failed) return;

    if (accessTokenResponse.statusCode >= 400) {
        if (intenseLogging)
            console.log(
                "AccessTokenResponse sent a code >= 400, status code: " +
                    accessTokenResponse.statusCode
            );

        console.log("SPOTIFY CALLBACK ERROR - ", accessTokenResponse);
        const errorData: ApiError = {
            error: "spotify_callback_error",
            api: "spotify",
            statusCode: accessTokenResponse.statusCode,
            apiResponse: accessTokenResponse.statusText,
            time: Date.now(),
        };
        await redisClient.lpush("errors", JSON.stringify(errorData));

        res.redirect(`/error?error=${JSON.stringify(accessTokenResponse)}`);
        return;
    }

    const accessToken: SpotifyTokenResponse =
        accessTokenResponse as SpotifyTokenResponse;

    if (accessToken.access_token === "") {
        if (intenseLogging)
            console.log(
                "Access token is empty, redirecting to error screen..."
            );
        res.redirect(
            `/error?error=No access token returned, please try again.`
        );
        return;
    }

    // Now it's time to get the users profile so we can store it in redis
    if (intenseLogging) console.log("Getting user profile...");
    const profileResponseRequest =
        (await fetch("https://api.spotify.com/v1/me", {
            method: "GET",
            headers: {
                Authorization: "Bearer " + accessToken.access_token,
                ContentType: "application/json",
            },
        }).catch(async (error) => {
            if (intenseLogging)
                console.log(
                    "Error at fetch profile: " +
                        error +
                        "\n Creating error object..."
                );
            console.log("SPOTIFY CALLBACK ERROR - ", error, error.response);
            const errorData: ApiError = {
                error: "spotify_callback_error",
                api: "spotify",
                statusCode: error.response.statusCode,
                apiResponse: error.response.data,
                time: Date.now(),
            };
            await redisClient.lpush("errors", JSON.stringify(errorData));
            res.redirect(`/error?error=${JSON.stringify(error)}`);
            return;
        })) ?? undefined;

    if (profileResponseRequest === undefined) return;

    if (
        profileResponseRequest.status >= 400 &&
        profileResponseRequest.status !== 403
    ) {
        if (intenseLogging)
            console.log(
                "Profile request failed...\nAssembling error object..."
            );
        console.log("SPOTIFY CALLBACK ERROR - ", profileResponseRequest);
        const errorData: ApiError = {
            error: "spotify_callback_error",
            api: "spotify",
            statusCode: profileResponseRequest.status,
            apiResponse: JSON.stringify(profileResponseRequest.body),
            time: Date.now(),
        };
        await redisClient.lpush("errors", JSON.stringify(errorData));
        res.redirect(`/error?error=${JSON.stringify(profileResponseRequest)}`);
        return;
    }

    if (profileResponseRequest.status === 403) {
        if (intenseLogging)
            console.log(
                "Profile request failed with 403, redirecting to error screen..."
            );
        res.redirect(
            `/error?error=Spotify returned a 403, which means you were not logged in properly. Please try again.`
        );
        return;
    }

    if (intenseLogging) console.log("Profile request successful, parsing...");
    let tmp;
    try {
        if (intenseLogging) console.log("Parsing...");
        tmp = await profileResponseRequest.json();
    } catch (e) {
        if (intenseLogging) console.log("Error at parsing: " + e);
        const errorData: ApiError = {
            error: "spotify_callback_error",
            api: "spotify",
            statusCode: profileResponseRequest.status,
            apiResponse: JSON.stringify(profileResponseRequest.body),
            time: Date.now(),
        };
        await redisClient.lpush("errors", JSON.stringify(errorData));
        if (intenseLogging)
            console.log(
                "Pushed error obj to redis, Redirecting to error screen..."
            );
        res.redirect(`/error?error=${JSON.stringify(e)}`);
        tmp = undefined;
    }

    if (tmp === undefined) {
        if (intenseLogging)
            console.log(
                "tmp is undefined, an error has probably occurred, returning..."
            );
        return;
    }

    const profileResponse = tmp;

    if (profileResponse.statusCode >= 400) {
        if (intenseLogging)
            console.log(
                "Profile response has an status >= 400 - ",
                profileResponse
            );

        // create an error object and push it to redis
        const errorData: ApiError = {
            error: "spotify_callback_error",
            api: "spotify",
            statusCode: profileResponse.statusCode,
            apiResponse: profileResponse,
            time: Date.now(),
        };
        await redisClient.lpush("errors", JSON.stringify(errorData));

        res.redirect(`/error?error=${JSON.stringify(profileResponse)}`);
        return;
    }

    const fullProfile: profileFull = {
        display_name: profileResponse.display_name,
        id: profileResponse.id,
        image_url:
            profileResponse.images.length > 0
                ? profileResponse.images[0].url
                : undefined,
        refresh_token: accessToken.refresh_token,
    };

    // it's time to set the redis profile
    if (intenseLogging) console.log("Setting redis profile...");
    redisClient.setex(
        fullProfile.id + "_access",
        accessToken.expires_in,
        accessToken.access_token
    );
    redisClient.setex(
        fullProfile.id + "_profile",
        3600 * 24 * 7,
        JSON.stringify(fullProfile)
    );
    console.log(`User: ${fullProfile.id} just logged in.`);

    // now we can set up the cookie
    if (intenseLogging) console.log("Setting cookie...");
    const cookie = await createLoginCookie(fullProfile.id);

    // set the cookie and redirect user
    if (intenseLogging) console.log("Setting cookie and redirecting...");
    res.setHeader("Set-Cookie", cookie);
    res.redirect("/dashboard");
    if (intenseLogging) console.log("Done!");
}
