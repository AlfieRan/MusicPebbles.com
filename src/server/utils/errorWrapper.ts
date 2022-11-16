import { ApiError } from "../../utils/types/errors";
import Redis from "ioredis";

export async function storeError(props: ApiError, redisClient: Redis) {
    console.error("Error Encountered: ", props);
    await redisClient.lpush("errors", JSON.stringify(props));
    return;
}
