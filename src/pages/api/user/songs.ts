import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "../../../server/sessions/session";
import { profileFull } from "../../../utils/types/oauth";
import { getAccessCode } from "../../../server/sessions/access";
import {
    getRedisClient,
    quitRedis,
    wrapRedis,
} from "../../../server/utils/redis";
import {
    songApiResponseType,
    songType,
    timeFrameType,
} from "../../../utils/types/spotify";
import { ApiError } from "../../../utils/types/errors";
import { spotifyWrapRequest } from "../../../server/utils/spotifyApiWrapper";
import Redis from "ioredis";

export default async function songs(req: NextApiRequest, res: NextApiResponse) {
    const redisClient = getRedisClient();
    const userProfile = await getSession(req, redisClient);
    if (!userProfile) {
        res.status(401).json({ error: "Unauthorized" });
        quitRedis(redisClient);
        return;
    }

    try {
        const data = await wrapSongsAllTimeFrames(userProfile, redisClient);
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

        quitRedis(redisClient);
        return;
    }
    quitRedis(redisClient);
}

export async function wrapSongsAllTimeFrames(
    user: profileFull,
    redisClient: Redis
): Promise<songApiResponseType> {
    return {
        long_term: await wrapSongs(user, "long_term", redisClient),
        medium_term: await wrapSongs(user, "medium_term", redisClient),
        short_term: await wrapSongs(user, "short_term", redisClient),
    };
}

async function wrapSongs(
    user: profileFull,
    timeFrame: timeFrameType,
    redisClient: Redis
): Promise<false | songType[]> {
    try {
        return await wrapRedis<false | songType[]>(
            `spotify:${user.id}:songs:${timeFrame}`,
            async () => {
                const songs = await getSongApiCall(
                    user,
                    timeFrame,
                    redisClient
                );
                if (songs === false) {
                    throw Error("Unauthorized");
                }
                return songs;
            },
            redisClient,
            86400
        );
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function getSongApiCall(
    user: profileFull,
    timeFrame: timeFrameType,
    redisClient: Redis
): Promise<false | songType[]> {
    const accessToken = await getAccessCode(user, redisClient);

    if (accessToken === false) {
        return false;
    }

    const raw = await spotifyWrapRequest<{ items: any[] }>(
        "https://api.spotify.com/v1/me/top/tracks",
        {
            method: "GET",
            contentType: "application/json",
            Authorization: `Bearer ${accessToken}`,
            parameters: `limit=50&time_range=${timeFrame}`,
        },
        redisClient
    );

    if (!raw.success) {
        console.log("[Song Api] Error: ", raw.error);
        return false;
    }

    return raw.data.items;
}
