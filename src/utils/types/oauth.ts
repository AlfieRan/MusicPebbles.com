import { artistApiResponseType, songApiResponseType } from "./spotify";

export interface SpotifyCallbackResponse {
    code: string;
    state: string;
    error: string;
}

export interface SpotifyTokenResponse {
    access_token: string;
    token_type: string;
    scope: string;
    expires_in: number;
    refresh_token: string;
}

export interface profileFull {
    display_name: string;
    id: string;
    image_url: string | undefined;
    refresh_token: string;
}

export interface profileType {
    display_name: string;
    id: string;
    image_url: string | undefined;
}

export type profileDataType = {
    profile: profileType | undefined;
    artists: artistApiResponseType | undefined;
    songs: songApiResponseType | undefined;
};
