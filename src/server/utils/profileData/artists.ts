import { profileFull } from "../../../utils/types/oauth";
import { getAccessCode } from "../../sessions/access";
import { wrapRedis } from "../redis";
import {
    artistApiResponseType,
    artistsType,
    timeFrameType,
} from "../../../utils/types/spotify";
import { storeError } from "../errorWrapper";
import { spotifyWrapRequest } from "../spotifyApiWrapper";
import Redis from "ioredis";

export async function getArtists(
    user: profileFull,
    redisClient: Redis
): Promise<artistApiResponseType | undefined> {
    try {
        return await wrapArtistsAllTimeFrames(user, redisClient);
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
        return undefined;
    }
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
