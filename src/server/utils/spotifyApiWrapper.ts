import {
    SpotifyApiRequest,
    spotifyRequestOptions,
} from "../types/spotifyApiWrapper";
import formurlencoded from "form-urlencoded";
import { sleep } from "../../utils/other/time";
import { storeError } from "./errorWrapper";
import Redis from "ioredis";

const stackOverflowLimit = 5;

export async function spotifyWrapRequestDirect<T>(
    route: string,
    options: spotifyRequestOptions,
    stackDepth: number = 0,
    redisClient: Redis
): Promise<SpotifyApiRequest<T>> {
    try {
        const params = {
            method: options.method,
            headers: {
                "content-type": options.contentType,
                Authorization: options.Authorization,
            },
            body:
                options.method === "POST"
                    ? formurlencoded(options.body)
                    : undefined,
        };
        let url = route;
        if (options.method === "GET" && options.parameters !== undefined) {
            url = `${url}?${options.parameters}`;
        }

        const response = await fetch(url, params);
        let decoded: T;
        try {
            decoded = await response.json();
        } catch (e) {
            console.error(
                `Failed to decode spotify request, raw: ${response.body}`
            );
            return {
                success: false,
                error: "Failed to decode spotify response",
                raw: JSON.stringify(response.body),
                code: response.status,
            };
        }

        // should be checked before
        // this should be implemented properly using the fetch response but for now will just be setup.
        const timeOut: [boolean, number] = [false, 0];
        if (timeOut[0]) {
            if (stackDepth >= stackOverflowLimit) {
                return {
                    success: false,
                    error: "Exceed stack depth, retried after being told to wait too many times.",
                    code: response.status ?? 403,
                    raw: JSON.stringify(response.body),
                };
            } else {
                await sleep(timeOut[1]);
                return await spotifyWrapRequest(
                    route,
                    options,
                    redisClient,
                    stackDepth + 1
                );
            }
        }

        if (response.status !== 200) {
            return {
                success: false,
                error: JSON.stringify(decoded),
                raw: JSON.stringify(response.body),
                code: response.status,
            };
        }

        // assuming nothing else has gone wrong:
        return {
            success: true,
            data: decoded,
            raw: JSON.stringify(response.body),
            code: response.status,
        };
    } catch (e) {
        return {
            success: false,
            error: "General error, caught by error wrapper.",
            code: 500,
            raw: JSON.stringify(e),
        };
    }
}

export async function spotifyWrapRequest<T>(
    route: string,
    options: spotifyRequestOptions,
    redisClient: Redis,
    stackDepth: number = 0,
    redisErrorHandling: boolean = true
): Promise<SpotifyApiRequest<T>> {
    const result = await spotifyWrapRequestDirect<T>(
        route,
        options,
        stackDepth,
        redisClient
    );

    if (!redisErrorHandling || result.success) {
        return result;
    }

    await storeError(
        {
            api: "spotify",
            error: result.error,
            apiResponse: result.raw,
            statusCode: result.code,
            time: Date.now(),
        },
        redisClient
    );

    return result;
}
