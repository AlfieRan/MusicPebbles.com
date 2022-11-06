import { NextApiRequest, NextApiResponse } from "next";
import formurlencoded from "form-urlencoded";
import {
    profileFull,
    SpotifyCallbackResponse,
    SpotifyTokenResponse,
} from "../../../utils/types/oauth";
import { getAccessToken } from "../../../server/utils/jwt";
import dayjs from "dayjs";
import { serialize } from "cookie";
import {
    ClientIDSecretPair,
    RedirectUri,
    redisClient,
} from "../../../server/constants";
import { ApiError } from "../../../utils/types/errors";

const intenseLogging = true;

export default async function callback(
    req: NextApiRequest,
    res: NextApiResponse
) {
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

    const accessTokenResponse = await fetch(
        "https://accounts.spotify.com/api/token",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: ClientIDSecretPair,
            },
            body: formurlencoded(data),
        }
    )
        .then((response) => response.json())
        .catch(async (error) => {
            if (intenseLogging)
                console.log("Error at fetch accessTokenResponse: " + error);
            console.log(
                "SPOTIFY CALLBACK ERROR - ",
                error,
                "raw response: ",
                error.response
            );

            if (intenseLogging)
                console.log(
                    "Assembling error object, pushing it to redis and redirecting to login..."
                );
            // create an error object and push it to redis
            const errorData: ApiError = {
                error: "spotify_callback_error",
                api: "spotify",
                statusCode: error.response.statusCode,
                apiResponse: error.response.data,
            };
            await redisClient.lpush("errors", JSON.stringify(errorData));

            res.redirect(
                `/error?error=${`spotify_callback_error: ${JSON.stringify(
                    error
                )}\nraw response: ${error.response}`}`
            );
            failed = true;
        });

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
        };
        await redisClient.lpush("errors", JSON.stringify(errorData));

        res.redirect(`/error?error=${JSON.stringify(profileResponse)}`);
        return;
    }

    const fullProfile: profileFull = {
        display_name: profileResponse.display_name,
        id: profileResponse.id,
        image_url: profileResponse.images[0].url,
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

async function createLoginCookie(id: string) {
    const Auth = await getAccessToken(id);
    await redisClient.set("jwt_" + Auth, id);
    return generateCookie(Auth, dayjs().add(1, "week").toDate(), "auth");
}

export function generateCookie(key: string, expires: Date, cookieName: string) {
    let security = true;

    if (process.env.LOCAL) {
        security = false;
    }

    return serialize(cookieName, key, {
        httpOnly: true,
        sameSite: sameSite(),
        secure: security,
        path: "/",
        expires,
    });
}

function sameSite(): "strict" | false {
    return process.env.LOCAL ? false : "strict";
}
