import { NextApiRequest, NextApiResponse } from "next";
import { wrapRedis } from "../../../server/utils/redis";
import { getSession } from "../../../server/sessions/session";
import { ApiError } from "../../../utils/types/errors";
import { redisClient } from "../../../server/constants";
import { wrapSongsAllTimeFrames } from "./songs";
import { profileFull } from "../../../utils/types/oauth";
import { getAccessCode } from "../../../server/sessions/access";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const userProfile = await getSession(req);
    if (!userProfile) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    try {
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

async function getGenres(user: profileFull) {
    const allSongs = await wrapSongsAllTimeFrames(user);
    const songIds = {
        long_term: (allSongs.long_term !== false ? allSongs.long_term : []).map(
            (song) => song.id
        ),
        medium_term: (allSongs.medium_term !== false
            ? allSongs.medium_term
            : []
        ).map((song) => song.id),
        short_term: (allSongs.short_term !== false
            ? allSongs.short_term
            : []
        ).map((song) => song.id),
    };
}

async function getGenresFromIds(songIds: string[], user: profileFull) {
    try {
        const accessToken = await getAccessCode(user);

        if (accessToken === false) {
            return false;
        }

        const response = await fetch(
            "https://api.spotify.com/v1/tracks?ids=" + songIds.join(","),
            {
                headers: {
                    Authorization: "Bearer " + accessToken,
                },
            }
        );
    } catch (error) {
        console.log("Something went wrong while getting genres: ", error);
        return [];
    }
}
