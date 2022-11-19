import { artistApiResponseType, songApiResponseType } from "./spotify";
import { uniqueHookType } from "./uniqueness";

export interface songComponentOverlay {
    hidden: false;
    type: "songs";
    songs: songApiResponseType;
}

export interface artistComponentOverlay {
    hidden: false;
    type: "artists";
    artists: artistApiResponseType;
}

export interface uniqueComponentOverlay {
    hidden: false;
    type: "unique";
}

export interface profileComponentOverlay {
    hidden: false;
    type: "profile";
}

export interface hiddenOverlay {
    hidden: true;
}

export type overlayStateType =
    | songComponentOverlay
    | artistComponentOverlay
    | uniqueComponentOverlay
    | profileComponentOverlay
    | hiddenOverlay;
