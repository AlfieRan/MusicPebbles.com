import { NextApiRequest, NextApiResponse } from "next";
import { getRedisClient, quitRedis } from "../../../server/utils/redis";
import { getSession } from "../../../server/sessions/session";
import { userIsAdmin } from "./errors";

export default async function count(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case "GET": {
            const redisClient = getRedisClient();
            const user = await getSession(req, redisClient);
            if (user === false || !userIsAdmin(user.id)) {
                res.status(403).json({
                    error: "You are not logged in as an admin.",
                });
                quitRedis(redisClient);
                return;
            }

            const rawCount = await redisClient.keys("jwt:*");

            res.status(200).json({ count: rawCount.length });
            quitRedis(redisClient);
            return;
        }
        default: {
            res.status(405).json({ error: "Method not allowed." });
            return;
        }
    }
}
