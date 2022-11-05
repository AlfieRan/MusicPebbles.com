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

export default async function callback(
    req: NextApiRequest,
    res: NextApiResponse
) {
    let failed = false;
    // check if an error was returned
    const response: SpotifyCallbackResponse = {
        code: req.query.code,
        state: req.query.state,
        error: req.query.error,
    } as SpotifyCallbackResponse;

    if (response.error) {
        res.redirect("/login?error=" + response.error);
        return;
    }

    // we're good, so post that code to spotify

    const data = {
        grant_type: "authorization_code",
        code: response.code,
        redirect_uri: RedirectUri,
    };

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
            console.log(
                "SPOTIFY CALLBACK ERROR - ",
                error,
                "raw response: ",
                error.response
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
                `/error?error=${`spotify_callback_error: ${error}\nraw response: ${error.response}`}`
            );
            failed = true;
        });

    if (failed) return;

    if (accessTokenResponse.statusCode >= 400) {
        console.log("SPOTIFY CALLBACK ERROR - ", accessTokenResponse);
        const errorData: ApiError = {
            error: "spotify_callback_error",
            api: "spotify",
            statusCode: accessTokenResponse.statusCode,
            apiResponse: accessTokenResponse,
        };
        await redisClient.lpush("errors", JSON.stringify(errorData));

        res.redirect(`/error?error=${accessTokenResponse}`);
        return;
    }

    const accessToken: SpotifyTokenResponse =
        accessTokenResponse as SpotifyTokenResponse;

    if (accessToken.access_token === "") {
        res.redirect(
            `/error?error=No access token returned, please try again.`
        );
    }

    // Now it's time to get the users profile so we can store it in redis
    const profileResponseRequest =
        (await fetch("https://api.spotify.com/v1/me", {
            method: "GET",
            headers: {
                Authorization: "Bearer " + accessToken.access_token,
                ContentType: "application/json",
            },
        }).catch(async (error) => {
            console.log("SPOTIFY CALLBACK ERROR - ", error, error.response);
            const errorData: ApiError = {
                error: "spotify_callback_error",
                api: "spotify",
                statusCode: error.response.statusCode,
                apiResponse: error.response.data,
            };
            await redisClient.lpush("errors", JSON.stringify(errorData));
            res.redirect(`/error?error=${error}`);
            return;
        })) ?? undefined;

    if (profileResponseRequest === undefined) return;

    const profileResponse = (await profileResponseRequest.json()).catch(
        async (error: any) => {
            console.log("SPOTIFY CALLBACK ERROR - ", error, error.response);
            const errorData: ApiError = {
                error: "spotify_callback_error",
                api: "spotify",
                statusCode: profileResponseRequest.status,
                apiResponse: JSON.stringify(profileResponseRequest.body),
            };
            await redisClient.lpush("errors", JSON.stringify(errorData));
            res.redirect(`/error?error=${error}`);
            return undefined;
        }
    );

    if (profileResponse === undefined) return;

    if (profileResponse.statusCode >= 400) {
        console.log("SPOTIFY CALLBACK ERROR - ", profileResponse);

        // create an error object and push it to redis
        const errorData: ApiError = {
            error: "spotify_callback_error",
            api: "spotify",
            statusCode: profileResponse.statusCode,
            apiResponse: profileResponse,
        };
        await redisClient.lpush("errors", JSON.stringify(errorData));

        res.redirect(`/error?error=${profileResponse}`);
        return;
    }

    const fullProfile: profileFull = {
        display_name: profileResponse.display_name,
        id: profileResponse.id,
        image_url: profileResponse.images[0].url,
        refresh_token: accessToken.refresh_token,
    };

    // it's time to set the redis profile
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
    const cookie = await createLoginCookie(fullProfile.id);

    // set the cookie and redirect user
    res.setHeader("Set-Cookie", cookie);
    res.redirect("/dashboard");
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
