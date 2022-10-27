import {ApiResponse, Method} from "./types/fetching";

const failOnError = false;

export async function fetcher<T>(
    method: Method,
    url: string,
    body?: unknown,
    bypassError?: boolean,
): Promise<ApiResponse<T>> {
    const request = await fetch(url, {
        method,
        credentials: 'include',
        headers: body ? {'Content-Type': 'application/json'} : undefined,
        body: body ? JSON.stringify(body) : undefined,
    });

    const json: any = await request.json();

    if (request.status >= 400) {
        if (failOnError && !bypassError) {
            throw new Error(`${json.data}`);
        }
        return { successful: false, error: json.data };
    }

    try {
        return { successful: true, data: json }
    } catch (e) {
        if (failOnError && !bypassError) {
            throw new Error(`Failed to parse response: ${e}`);
        }
        return { successful: false, error: e as string };   // probably shouldn't be cast to string
    }
}