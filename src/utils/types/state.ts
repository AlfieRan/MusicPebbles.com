import { artistType } from "./spotify";
import { Dispatch, SetStateAction } from "react";

export interface hoveringProfile {
    hovering: true;
    type: "profile";
}

export interface hoveringNiche {
    hovering: true;
    type: "niche";
}

export interface hoveringArtist {
    hovering: true;
    type: "artist";
    artist: artistType;
}

export interface notHovering {
    hovering: false;
}

export type hoveringType =
    | hoveringProfile
    | hoveringArtist
    | hoveringNiche
    | notHovering;
export type setHoveringType = Dispatch<SetStateAction<hoveringType>>;

interface dashboardMainState {
    type: "main";
    component: JSX.Element;
}

interface dashboardLoadingState {
    type: "loading";
    component: JSX.Element;
}

export type dashboardStateType = dashboardMainState | dashboardLoadingState;
