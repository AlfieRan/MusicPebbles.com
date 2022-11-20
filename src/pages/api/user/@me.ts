import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "../../../server/sessions/session";
import { profileDataType, profileType } from "../../../utils/types/oauth";
import { getRedisClient, quitRedis } from "../../../server/utils/redis";
import { getArtists } from "../../../server/utils/profileData/artists";
import { getSongs } from "../../../server/utils/profileData/songs";

export default async function me(req: NextApiRequest, res: NextApiResponse) {
    const redisClient = getRedisClient();
    try {
        const userProfile = await getSession(req, redisClient);
        if (!userProfile) {
            res.status(401).json({ error: "Unauthorized" });
            quitRedis(redisClient);
            return;
        }

        const simpleProfile: profileType = {
            display_name: userProfile.display_name,
            id: userProfile.id,
            image_url: userProfile.image_url,
        };

        const response: profileDataType = {
            profile: simpleProfile,
            artists: await getArtists(userProfile, redisClient),
            songs: await getSongs(userProfile, redisClient),
        };

        res.status(200).json(response);
        console.log("Quitting @me redis client");
        quitRedis(redisClient);
        return;
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
        quitRedis(redisClient);
        return;
    }
}
