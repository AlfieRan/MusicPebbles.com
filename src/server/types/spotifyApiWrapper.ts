export interface successfulSpotifyRequest<T> {
    data: T;
    raw: string;
    code: number;
    success: true;
}

export interface failedSpotifyRequest {
    error: string;
    raw: string;
    code: number;
    success: false;
}

export type SpotifyApiRequest<T> =
    | successfulSpotifyRequest<T>
    | failedSpotifyRequest;

export interface spotifyGetOptions {
    method: "GET";
    contentType: "application/json";
    parameters: string | undefined;
    Authorization: string;
}

export interface spotifyPostOptions {
    method: "POST";
    contentType: "application/x-www-form-urlencoded";
    body: any;
    Authorization: string;
}

export type spotifyRequestOptions = spotifyGetOptions | spotifyPostOptions;
