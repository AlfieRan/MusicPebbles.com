import { wrapRedis } from "./redis";

const defaultTimeFrame = "medium_term";

export async function getTimeFrame(userId: string) {
    return await wrapRedis<string>(
        `${userId}_time_frame`,
        async () => defaultTimeFrame,
        86400
    );
}
