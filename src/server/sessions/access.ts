import { ClientIDSecretPair, RedirectUri, redisClient } from "../constants";
import { profileFull } from "../../utils/types/oauth";
import formurlencoded from "form-urlencoded";

export async function getAccessCode(
    userProfile: profileFull
): Promise<false | string> {
    const cached = await redisClient.get(userProfile.id + "_access");
    if (cached !== "" && cached !== null) return cached;

    const RequestData = {
        grant_type: "refresh_token",
        refresh_token: userProfile.refresh_token,
    };

    console.log("RequestData", RequestData);

    const reqResult = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: ClientIDSecretPair,
        },
        body: formurlencoded(RequestData),
    });

    const response = await reqResult.json();

    if (response.error) {
        console.log("REFRESH TOKEN ERROR - ", response);
        return false;
    }

    const accessToken = response.access_token;
    const expiresIn = response.expires_in;

    await redisClient.setex(userProfile.id + "_access", expiresIn, accessToken);
    return accessToken;
}
