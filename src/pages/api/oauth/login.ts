import { NextApiRequest, NextApiResponse } from "next";
import { OauthLoginUrl } from "../../../utils/spotify/oauth";
import {
    ClientID,
    ClientSecret,
    RedirectUri,
    StateKey,
} from "../../../server/constants";

function createState(): string {
    return Math.random().toString(36).substring(2);
}

export default async function login(req: NextApiRequest, res: NextApiResponse) {
    if (ClientID === "" || ClientSecret === "" || RedirectUri === "") {
        console.log("WARNING - Missing environment variables");
        res.status(500).json({ error: "Internal server error" });
        return;
    }

    const url = OauthLoginUrl(ClientID, RedirectUri, StateKey);
    res.redirect(url);
}
