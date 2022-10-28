import jwt from "jsonwebtoken";
import { JWTSecret } from "../constants";

export async function getAccessToken(userid: string): Promise<string> {
    return jwt.sign(userid, JWTSecret);
}
