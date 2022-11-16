import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "../../../server/sessions/session";
import { profileType } from "../../../utils/types/oauth";
import { getRedisClient } from "../../../server/utils/redis";

export default async function me(req: NextApiRequest, res: NextApiResponse) {
    const redisClient = getRedisClient();
    const userProfile = await getSession(req, redisClient);
    if (!userProfile) {
        res.status(401).json({ error: "Unauthorized" });
        redisClient.quit();
        return;
    }

    const simpleProfile: profileType = {
        display_name: userProfile.display_name,
        id: userProfile.id,
        image_url: userProfile.image_url,
    };

    res.status(200).json(simpleProfile);
    redisClient.quit();
}
