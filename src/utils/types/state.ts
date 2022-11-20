import { Dispatch, SetStateAction } from "react";
import { songType } from "./spotify";
import { profileDataType } from "./oauth";

interface hoveringComponentState {
    hovering: true;
    type: "component";
    y: "top" | "bottom";
    x: "left" | "right";
    component: JSX.Element;
}

interface hoveringTextState {
    hovering: true;
    type: "text";
    y: "top" | "bottom";
    x: "left" | "right";
    text: string;
}

interface notHoveringState {
    hovering: false;
}

export type hoveringType =
    | hoveringComponentState
    | hoveringTextState
    | notHoveringState;

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

export type audioPlayerType = {
    playPause: () => void;
    paused: boolean;
    setSong: (song: songType) => void;
    addSongs: (songs: songType[]) => void;
    nextSong: () => void;
    prevSong: () => void;
    playing: songType | undefined;
};

export type songOverlayInfo = {
    song: string;
    artist: string;
    album: string;
};

export type profileHookType = {
    profile: profileDataType;
    loading: boolean;
    error: boolean;
};
