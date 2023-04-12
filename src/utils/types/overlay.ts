import { artistApiResponseType, songApiResponseType } from "./spotify";

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

export interface bugComponentOverlay {
    hidden: false;
    type: "bug";
}

export interface popUpComponentOverlay {
    hidden: false;
    type: "popup";
}

export interface shareComponentOverlay {
    hidden: false;
    type: "share";
}

export interface hiddenOverlay {
    hidden: true;
}

export type overlayStateType =
    | songComponentOverlay
    | artistComponentOverlay
    | uniqueComponentOverlay
    | profileComponentOverlay
    | bugComponentOverlay
    | popUpComponentOverlay
    | shareComponentOverlay
    | hiddenOverlay;

type profileOverlayButtonColourType =
    | "red"
    | "blue-highlight"
    | "red-highlight"
    | "none";

interface profileOverlayButtonLinkType {
    type: "link";
    href: string;
    text: string;
    color: profileOverlayButtonColourType;
}

interface profileOverlayButtonButtonType {
    type: "button";
    onClick: () => void;
    text: string;
    color: profileOverlayButtonColourType;
}

export type profileOverlayButtonType =
    | profileOverlayButtonLinkType
    | profileOverlayButtonButtonType;
