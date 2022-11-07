import { redis } from "./utils/redis";
import dotenv from "dotenv";
dotenv.config();

function env(key: string): string {
    const value = process.env[key];
    if (value === undefined || value === "") {
        throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
}

export const redisClient = redis;
export const ClientID = env("SPOTIFY_CLIENT_ID");
export const ClientSecret = env("SPOTIFY_CLIENT_SECRET");
export const RedirectUri = env("SPOTIFY_REDIRECT_URI");
export const StateKey = env("SPOTIFY_STATE_KEY");
export const JWTSecret = env("JWT_SECRET");
export const ClientIDSecretPair =
    "Basic " + Buffer.from(ClientID + ":" + ClientSecret).toString("base64");

export const admins = ["alfie.ranstead"]; // array of user ids
