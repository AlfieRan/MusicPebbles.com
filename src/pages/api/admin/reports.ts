import { NextApiRequest, NextApiResponse } from "next";
import { getRedisClient, quitRedis } from "../../../server/utils/redis";
import { getSession } from "../../../server/sessions/session";
import { userIsAdmin } from "./errors";
import { errorReport, errorReports } from "../../../utils/types/errors";

export default async function reports(
    req: NextApiRequest,
    res: NextApiResponse
) {
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

            const rawReports =
                (await redisClient.lrange("reports", 0, 50)) || [];
            const reports: errorReports = rawReports.map((rawReport) =>
                JSON.parse(rawReport)
            );

            res.status(200).json(reports);
            quitRedis(redisClient);
            return;
        }

        case "POST": {
            const redisClient = getRedisClient();
            const user = await getSession(req, redisClient);
            console.log("Creating a new bug report...");

            if (user === false) {
                res.status(403).json({
                    error: "You are not logged in.",
                });
                quitRedis(redisClient);
                return;
            }

            const context = req.body as string;

            if (context.length > 1000) {
                res.status(400).json({
                    error: "The report is too long.",
                });
                quitRedis(redisClient);
                return;
            }

            const report: errorReport = {
                error: req.body,
                time: Date.now(),
                ip:
                    (req.headers["x-forwarded-for"] as string) ||
                    req.socket.remoteAddress ||
                    "unknown",
            };

            await redisClient.lpush("reports", JSON.stringify(report));
            res.status(200).json("ok");

            quitRedis(redisClient);
            return;
        }

        default: {
            res.status(405).json({ error: "Method not allowed." });
            return;
        }
    }
}
