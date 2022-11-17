import Redis from "ioredis";
import dotenv from "dotenv";
import { LOGGING } from "../constants";
dotenv.config();

const RedisUrl = process.env.REDIS_URL ?? "";

if (RedisUrl === "") {
    console.log("WARNING - Missing environment variables");
    throw new Error("Missing environment variables");
}

export function getRedisClient() {
    return new Redis(RedisUrl).on("error", (error) => {
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
}

export async function wrapRedis<T>(
    key: string,
    fn: () => Promise<T>,
    redis: Redis,
    seconds: number = 3600
): Promise<T> {
    const cached = await redis.get(key);
    if (cached) return JSON.parse(cached);
    const recent = await fn();
    await redis.setex(key, seconds, JSON.stringify(recent));
    return recent;
}

export function quitRedis(redisConnection: Redis) {
    try {
        redisConnection.quit();
    } catch (e) {
        console.error(
            "[Redis Connection] Error quiting redis connection, probably already closed."
        );
        if (LOGGING) console.error("[Redis Connection] Full Error: ", e);
    }
}
