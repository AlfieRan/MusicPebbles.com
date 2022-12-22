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

export interface bugComponentOverlay {
    hidden: false;
    type: "bug";
}

export interface popUpComponentOverlay {
    hidden: false;
    type: "popup";
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

interface profileoOverlayButtonButtonType {
    type: "button";
    onClick: () => void;
    text: string;
    color: profileOverlayButtonColourType;
}

export type profileOverlayButtonType =
    | profileOverlayButtonLinkType
    | profileoOverlayButtonButtonType;
