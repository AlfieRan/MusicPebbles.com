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

export async function wrapRedis<T>(
    key: string,
    fn: () => Promise<T>,
    seconds: number = 3600
): Promise<T> {
    const cached = await redis.get(key);
    if (cached) return JSON.parse(cached);
    const recent = await fn();
    await redis.setex(key, seconds, JSON.stringify(recent));
    return recent;
}
