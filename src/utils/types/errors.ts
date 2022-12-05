export interface SpotifyApiError {
    error: string;
    api: "spotify";
    apiResponse: string;
    statusCode: number;
    time: number;
}

export interface InternalApiError {
    error: string;
    api: "internal";
    statusCode: number;
    time: number;
}

export interface UnknownApiError {
    error: string;
    api: "unknown";
    statusCode: number;
    time: number;
}

export type ApiError = SpotifyApiError | InternalApiError | UnknownApiError;

export interface errorReport {
    error: string;
    time: number;
    ip: string;
}

export type errorReports = errorReport[];
