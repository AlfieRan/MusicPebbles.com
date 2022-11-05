export interface SpotifyApiError {
    error: string;
    api: "spotify";
    apiResponse: string;
    statusCode: number;
}

export interface InternalApiError {
    error: string;
    api: "internal";
    statusCode: number;
}

export interface UnknownApiError {
    error: string;
    api: "unknown";
}

export type ApiError = SpotifyApiError | InternalApiError | UnknownApiError;
