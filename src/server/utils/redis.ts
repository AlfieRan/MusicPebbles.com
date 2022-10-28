import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const RedisUrl = process.env.REDIS_URL ?? "";

if (RedisUrl === "") {
    console.log("WARNING - Missing environment variables");
    throw new Error("Missing environment variables");
}

export const redis = new Redis(RedisUrl).on("error", (error) => {
    console.log(
        {
            error: error,
        },
        "Redis error"
    );

    if (error.code === "ECONNREFUSED") {
        console.log("Redis connection refused");
    }
});
