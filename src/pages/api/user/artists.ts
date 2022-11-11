import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "../../../server/sessions/session";
import { profileFull } from "../../../utils/types/oauth";
import { getAccessCode } from "../../../server/sessions/access";
import { wrapRedis } from "../../../server/utils/redis";
import {
    artistApiResponseType,
    artistsType,
    timeFrameType,
} from "../../../utils/types/spotify";
import { ApiError } from "../../../utils/types/errors";
import { redisClient } from "../../../server/constants";

export default async function artists(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const userProfile = await getSession(req);
    if (!userProfile) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    try {
        const data = await wrapArtistsAllTimeFrames(userProfile);
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

async function wrapArtistsAllTimeFrames(
    user: profileFull
): Promise<artistApiResponseType> {
    return {
        long_term: await wrapArtists(user, "long_term"),
        medium_term: await wrapArtists(user, "medium_term"),
        short_term: await wrapArtists(user, "short_term"),
    };
}

async function wrapArtists(
    user: profileFull,
    timeFrame: timeFrameType
): Promise<false | artistsType> {
    try {
        return await wrapRedis<false | artistsType>(
            `${user.id}_artists_${timeFrame}`,
            async () => {
                const artists = await getArtistApiCall(user, timeFrame);
                if (artists === false) {
                    throw Error("Unauthorized");
                }
                return artists;
            },
            86400
        );
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function getArtistApiCall(
    user: profileFull,
    timeFrame: timeFrameType
): Promise<false | artistsType> {
    const accessToken = await getAccessCode(user);

    if (accessToken === false) {
        return false;
    }

    const response = await fetch(
        `https://api.spotify.com/v1/me/top/artists?limit=50&time_range=${timeFrame}`,
        {
            headers: {
                Authorization: "Bearer " + accessToken,
            },
        }
    );

    const data = await response.json();

    if (response.status !== 200) {
        console.log("API ERROR - GET TOP ARTISTS - ", data);
        return false;
    }

    return data.items;
}
