import { ApiError } from "../../utils/types/errors";
import { redisClient } from "../constants";

export async function storeError(props: ApiError) {
    console.error("Error Encountered: ", props);
    await redisClient.lpush("errors", JSON.stringify(props));
    return;
}
