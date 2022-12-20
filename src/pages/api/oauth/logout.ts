import { NextApiRequest, NextApiResponse } from "next";
import { generateCookie } from "../../../server/utils/cookies";
import { killSession } from "../../../server/sessions/session";
import { getRedisClient, quitRedis } from "../../../server/utils/redis";

async function createLogoutCookie() {
    return generateCookie("", new Date(), "auth");
}

export default async function logout(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const cookie = await createLogoutCookie();

    const redisClient = getRedisClient();
    await killSession(req, redisClient);

    quitRedis(redisClient);
    res.setHeader("Set-Cookie", cookie);
    res.status(200).json({ message: "Logged out" });
}
