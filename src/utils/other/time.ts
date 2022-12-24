import { timeFrameType } from "../types/spotify";

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function wrapTimeString(time: timeFrameType) {
    return time === "short_term"
        ? "Last 4 Weeks"
        : time === "medium_term"
        ? "Last 6 Months"
        : "All Time";
}
