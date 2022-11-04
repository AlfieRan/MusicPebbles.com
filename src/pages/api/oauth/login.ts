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
        res.redirect(
            "/error?error=Missing server environment variables, please report to dev."
        );
        return;
    }

    const url = OauthLoginUrl(ClientID, RedirectUri, StateKey);
    res.redirect(url);
}
