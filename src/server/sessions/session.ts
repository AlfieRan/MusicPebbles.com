import { profileFull } from "../../utils/types/oauth";
import { NextApiRequest } from "next";
import { redisClient } from "../constants";

export async function getSession(
    req: NextApiRequest
): Promise<profileFull | false> {
    const key = sessionKeyFromRequest(req, "auth");

    // check is user is logged in
    if (key === false) {
        return false;
    }

    // get user id
    const userId = await redisClient.get("jwt_" + key);

    if (!userId) {
        return false;
    }

    // get user profile
    const profile = await redisClient.get(userId + "_profile");

    // make sure user's profile exists
    if (!profile) {
        return false;
    }

    // return user's profile
    return JSON.parse(profile);
}

export function sessionKeyFromRequest(
    req: NextApiRequest,
    cookieName: string
): string | false {
    if (!req.cookies[cookieName] || req.cookies[cookieName] === "") {
        return false;
    }
    return req.cookies[cookieName] ?? "";
}
