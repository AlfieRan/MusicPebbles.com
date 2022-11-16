import { NextApiRequest, NextApiResponse } from "next";
import { generateCookie } from "../../../server/utils/cookies";

async function createLogoutCookie() {
    return generateCookie("", new Date(), "auth");
}

export default async function logout(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const cookie = await createLogoutCookie();
    res.setHeader("Set-Cookie", cookie);
    res.status(200).json({ message: "Logged out" });
}
