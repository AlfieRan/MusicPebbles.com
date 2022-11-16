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
import { storeError } from "../../../server/utils/errorWrapper";
import { spotifyWrapRequest } from "../../../server/utils/spotifyApiWrapper";

export default async function artists(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const userProfile = await getSession(req);
        if (!userProfile) {
            res.status(403).json({ error: "Unauthorized" });
            return;
        }

        const data = await wrapArtistsAllTimeFrames(userProfile);
        res.status(200).json(data);
        return;
    } catch (e) {
        await storeError({
            api: "spotify",
            apiResponse: JSON.stringify(e),
            error: "Unknown Spotify Api Error",
            statusCode: 500,
            time: Date.now(),
        });
        await res.status(500).json(e);
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

    const response = await spotifyWrapRequest<{ items: any[] }>(
        "https://api.spotify.com/v1/me/top/artists",
        {
            method: "GET",
            contentType: "application/json",
            parameters: `limit=50&time_range=${timeFrame}`,
            Authorization: `Bearer ${accessToken}`,
        }
    );

    if (!response.success) {
        return false;
    }

    return response.data.items;
}
