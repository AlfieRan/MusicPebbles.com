import { songApiResponseType } from "./spotify";

export interface songComponentOverlay {
    hidden: false;
    type: "songs";
    songs: songApiResponseType;
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
    | profileComponentOverlay
    | hiddenOverlay;
