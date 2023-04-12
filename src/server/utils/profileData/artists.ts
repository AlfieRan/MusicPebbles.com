import {
    artistApiResponseType,
    artistsType,
    timeFrameType,
} from "../../../utils/types/spotify";
import { storeError } from "../errorWrapper";
import { spotifyWrapRequest } from "../spotifyApiWrapper";
import Redis from "ioredis";

export async function getArtists(
    redisClient: Redis,
    accessCode: string
): Promise<artistApiResponseType | undefined> {
    try {
        return await getArtistsAllTimeFrames(redisClient, accessCode);
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

async function getArtistsAllTimeFrames(
    redisClient: Redis,
    accessCode: string
): Promise<artistApiResponseType> {
    return {
        long_term: await getArtistApiCall("long_term", accessCode, redisClient),
        medium_term: await getArtistApiCall(
            "medium_term",
            accessCode,
            redisClient
        ),
        short_term: await getArtistApiCall(
            "short_term",
            accessCode,
            redisClient
        ),
    };
}

async function getArtistApiCall(
    timeFrame: timeFrameType,
    accessCode: string,
    redisClient: Redis
): Promise<false | artistsType> {
    const response = await spotifyWrapRequest<{ items: any[] }>(
        "https://api.spotify.com/v1/me/top/artists",
        {
            method: "GET",
            contentType: "application/json",
            parameters: `limit=50&time_range=${timeFrame}`,
            Authorization: `Bearer ${accessCode}`,
        },
        redisClient
    );

    if (!response.success) {
        return false;
    }

    return response.data.items;
}
