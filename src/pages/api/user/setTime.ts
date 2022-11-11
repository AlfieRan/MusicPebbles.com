import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "../../../server/sessions/session";
import { redisClient } from "../../../server/constants";

export default async function setTime(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const userProfile = await getSession(req);
        if (!userProfile) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const timeFrame = req.body.time;

        if (
            timeFrame !== "short_term" &&
            timeFrame !== "medium_term" &&
            timeFrame !== "long_term"
        ) {
            res.status(400).json({ error: "Bad Request" });
            console.log("Bad Request", timeFrame);
            return;
        }

        await redisClient.set(
            `${userProfile.id}_time_frame`,
            JSON.stringify(timeFrame)
        );
        console.log("Set timeFrame to", timeFrame);

        res.status(200).json({ success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
