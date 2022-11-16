import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "../../../server/sessions/session";
import { profileFull } from "../../../utils/types/oauth";
import { getAccessCode } from "../../../server/sessions/access";
import { getRedisClient, wrapRedis } from "../../../server/utils/redis";
import {
    artistApiResponseType,
    artistsType,
    timeFrameType,
} from "../../../utils/types/spotify";
import { storeError } from "../../../server/utils/errorWrapper";
import { spotifyWrapRequest } from "../../../server/utils/spotifyApiWrapper";
import Redis from "ioredis";

export default async function artists(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const redisClient = getRedisClient();
    try {
        const userProfile = await getSession(req, redisClient);
        if (!userProfile) {
            res.status(403).json({ error: "Unauthorized" });
            redisClient.quit();
            return;
        }

        const data = await wrapArtistsAllTimeFrames(userProfile, redisClient);
        res.status(200).json(data);
        redisClient.quit();
    } catch (e) {
        await storeError(
            {
                api: "spotify",
                apiResponse: JSON.stringify(e),
                error: "Unknown Spotify Api Error",
                statusCode: 500,
                time: Date.now(),
            },
            redisClient
        );
        await res.status(500).json(e);
    }
    redisClient.quit();
    return;
}

async function wrapArtistsAllTimeFrames(
    user: profileFull,
    redisClient: Redis
): Promise<artistApiResponseType> {
    return {
        long_term: await wrapArtists(user, "long_term", redisClient),
        medium_term: await wrapArtists(user, "medium_term", redisClient),
        short_term: await wrapArtists(user, "short_term", redisClient),
    };
}

async function wrapArtists(
    user: profileFull,
    timeFrame: timeFrameType,
    redisClient: Redis
): Promise<false | artistsType> {
    try {
        return await wrapRedis<false | artistsType>(
            `spotify:${user.id}:artists:${timeFrame}`,
            async () => {
                const artists = await getArtistApiCall(
                    user,
                    timeFrame,
                    redisClient
                );
                if (artists === false) {
                    throw Error("Unauthorized");
                }
                return artists;
            },
            redisClient,
            86400
        );
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function getArtistApiCall(
    user: profileFull,
    timeFrame: timeFrameType,
    redisClient: Redis
): Promise<false | artistsType> {
    const accessToken = await getAccessCode(user, redisClient);

    if (accessToken === false) {
        return false;
    }

    const response = await spotifyWrapRequest<{ items: any[] }>(
        "https://api.spotify.com/v1/me/top/artists",
        {
            method: "GET",
            contentType: "application/json",
            parameters: `limit=50&time_range=${timeFrame}`,
            Authorization: `Bearer ${accessToken}`,
        },
        redisClient
    );

    if (!response.success) {
        return false;
    }

    return response.data.items;
}
