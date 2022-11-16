import { NextApiRequest, NextApiResponse } from "next";
import { admins } from "../../../server/constants";
import { ApiError } from "../../../utils/types/errors";
import { getSession } from "../../../server/sessions/session";
import { getRedisClient } from "../../../server/utils/redis";

export default async function errors(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const redisClient = getRedisClient();
    try {
        const user = await getSession(req, redisClient);
        if (user === false || !userIsAdmin(user.id)) {
            console.log(
                `User: ${
                    user !== false ? user.id : "unknown"
                } just tried to login as an admin.`
            );
            res.status(403).json({
                error: "You are not logged in as an admin.",
            });
            redisClient.quit();
            return;
        }
        console.log(`Admin: ${user.id} logged in.`);

        const rawErrors = (await redisClient.lrange("errors", 0, 10)) || [];
        const errors: ApiError[] = rawErrors.map((rawError) =>
            JSON.parse(rawError)
        );
        res.status(200).json(errors);
    } catch (error) {
        console.log("Error at /api/admin/errors: " + error);
        res.status(500).json({ error });
    }
    redisClient.quit();
}

function userIsAdmin(userId: string): boolean {
    for (let i = 0; i < admins.length; i++) {
        if (admins[i] === userId) return true;
    }
    return false;
}
