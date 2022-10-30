import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "../../../server/sessions/session";
import { profileFull } from "../../../utils/types/oauth";
import { getAccessCode } from "../../../server/sessions/access";
import { wrapRedis } from "../../../server/utils/redis";
import { artistsType } from "../../../utils/types/spotify";

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
        const data = await wrapRedis<any[]>(
            `${userProfile.id}_artists`,
            async () => {
                const artists = await getArtistApiCall(userProfile);
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
        res.status(500).json({ error: "Internal server error" });
    }
}

async function getArtistApiCall(
    user: profileFull
): Promise<false | artistsType> {
    const accessToken = await getAccessCode(user);

    if (accessToken === false) {
        return false;
    }

    const response = await fetch(
        "https://api.spotify.com/v1/me/top/artists?limit=50",
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
