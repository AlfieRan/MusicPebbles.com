import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "../../../server/sessions/session";
import { profileFull } from "../../../utils/types/oauth";
import { getAccessCode } from "../../../server/sessions/access";
import { wrapRedis } from "../../../server/utils/redis";
import { artistsType } from "../../../utils/types/spotify";
import { ApiError } from "../../../utils/types/errors";
import { redisClient } from "../../../server/constants";
import { getTimeFrame } from "../../../server/utils/timeFrame";

export default async function songs(req: NextApiRequest, res: NextApiResponse) {
    const userProfile = await getSession(req);
    if (!userProfile) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    try {
        const timeFrame = await getTimeFrame(userProfile.id);
        const data = await wrapRedis<any[]>(
            `${userProfile.id}_songs_${timeFrame}`,
            async () => {
                const artists = await getSongApiCall(userProfile);
                if (artists === false) {
                    throw new Error("Unauthorized");
                }
                return artists;
            },
            86400
        );
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        const errorObj: ApiError = {
            api: "internal",
            error: JSON.stringify(error),
            statusCode: 500,
            time: Date.now(),
        };
        await redisClient.lpush("errors", JSON.stringify(errorObj));

        res.redirect("/api/error?error=" + JSON.stringify(errorObj));

        return;
    }
}

async function getSongApiCall(user: profileFull): Promise<false | artistsType> {
    const accessToken = await getAccessCode(user);

    if (accessToken === false) {
        return false;
    }

    const timeFrame = await getTimeFrame(user.id);

    const response = await fetch(
        `https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=${timeFrame}`,
        {
            headers: {
                Authorization: "Bearer " + accessToken,
            },
        }
    );

    const data = await response.json();

    if (response.status !== 200) {
        console.log("API ERROR - GET TOP SONGS - ", data);
        return false;
    }

    return data.items;
}
