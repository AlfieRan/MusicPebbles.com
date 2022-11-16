import { getAccessToken } from "./jwt";
import { redisClient } from "../constants";
import dayjs from "dayjs";
import { serialize } from "cookie";

export async function createLoginCookie(id: string) {
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
