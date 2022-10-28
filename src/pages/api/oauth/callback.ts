import { NextApiRequest, NextApiResponse } from "next";
import formurlencoded from "form-urlencoded";
import {
    profile,
    profileFull,
    SpotifyCallbackResponse,
    SpotifyTokenResponse,
} from "../../../utils/types/oauth";
import { getAccessToken } from "../../../server/utils/jwt";
import dayjs from "dayjs";
import { serialize } from "cookie";
import {
    ClientID,
    ClientSecret,
    RedirectUri,
    redisClient,
} from "../../../server/constants";

export default async function callback(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // check if an error was returned
    const response: SpotifyCallbackResponse = {
        code: req.query.code,
        state: req.query.state,
        error: req.query.error,
    } as SpotifyCallbackResponse;

    if (response.error) {
        res.status(400).json({ error: response.error });
        return;
    }

    // we're good, so post that code to spotify
    const ClientIDSecretPair =
        "Basic " +
        Buffer.from(ClientID + ":" + ClientSecret).toString("base64");

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
        .catch((error) => {
            console.log("SPOTIFY CALLBACK ERROR - ", error);
            res.status(500).json({ error: "Internal server error" });
        });

    if (accessTokenResponse.statusCode >= 400) {
        console.log("SPOTIFY CALLBACK ERROR - ", accessTokenResponse);
        res.status(500).json({ error: "Internal server error" });
        return;
    }

    const accessToken: SpotifyTokenResponse =
        accessTokenResponse as SpotifyTokenResponse;

    if (accessToken.access_token === "") {
        console.log("SPOTIFY CALLBACK ERROR - ", accessTokenResponse);
        res.status(500).json({ error: "Internal server error" });
    }

    // Now it's time to get the users profile so we can store it in redis
    const profileResponse = await fetch("https://api.spotify.com/v1/me", {
        method: "GET",
        headers: {
            Authorization: "Bearer " + accessToken.access_token,
            ContentType: "application/json",
        },
    })
        .then((response) => response.json())
        .catch((error) => {
            console.log("SPOTIFY CALLBACK ERROR - ", error);
            res.status(500).json({ error: "Internal server error" });
        });

    if (profileResponse.statusCode >= 400) {
        console.log("SPOTIFY CALLBACK ERROR - ", profileResponse);
        res.status(500).json({ error: "Internal server error" });
        return;
    }

    const fullProfile: profileFull = {
        display_name: profileResponse.display_name,
        id: profileResponse.id,
        image_url: profileResponse.images[0].url,
        refresh_token: accessToken.refresh_token,
    };

    const profile: profile = {
        display_name: fullProfile.display_name,
        id: fullProfile.id,
        image_url: fullProfile.image_url,
    };

    // it's time to set the redis profile
    redisClient.setex(
        profile.id + "_access",
        accessToken.expires_in,
        accessToken.access_token
    );
    redisClient.setex(
        profile.id + "_profile",
        3600 * 24 * 7,
        JSON.stringify(profile)
    );
    console.log(`User: ${profile.id} logged in`);

    // now we can set up the cookie
    const AuthJWT = await getAccessToken(profile.id);
    // await redisClient.set(profile.id + "_jwt", AuthJWT);
    const cookie = await createCookie(profile.id);

    // set the cookie and redirect user
    res.setHeader("Set-Cookie", cookie);
    res.redirect("/dashboard");
}

async function createCookie(id: string) {
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
