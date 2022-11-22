import { profileFull } from "../../../utils/types/oauth";
import { getAccessCode } from "../../sessions/access";
import { wrapRedis } from "../redis";
import {
    songApiResponseType,
    songType,
    timeFrameType,
} from "../../../utils/types/spotify";
import { ApiError } from "../../../utils/types/errors";
import { spotifyWrapRequest } from "../spotifyApiWrapper";
import Redis from "ioredis";

export async function getSongs(
    redisClient: Redis,
    accessToken: string
): Promise<undefined | songApiResponseType> {
    try {
        return await wrapSongsAllTimeFrames(accessToken, redisClient);
    } catch (error) {
        console.log(error);
        const errorObj: ApiError = {
            api: "internal",
            error: JSON.stringify(error),
            statusCode: 500,
            time: Date.now(),
        };
        await redisClient.lpush("errors", JSON.stringify(errorObj));

        return undefined;
    }
}

export async function wrapSongsAllTimeFrames(
    accessToken: string,
    redisClient: Redis
): Promise<songApiResponseType> {
    return {
        long_term: await getSongApiCall(accessToken, "long_term", redisClient),
        medium_term: await getSongApiCall(
            accessToken,
            "medium_term",
            redisClient
        ),
        short_term: await getSongApiCall(
            accessToken,
            "short_term",
            redisClient
        ),
    };
}
async function getSongApiCall(
    accessToken: string,
    timeFrame: timeFrameType,
    redisClient: Redis
): Promise<false | songType[]> {
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
