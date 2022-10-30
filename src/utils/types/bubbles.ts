import { artistType } from "./spotify";

export interface bubblePosType {
    x: number;
    y: number;
}

export interface profileBubbleType {
    type: "profile";
    pos: bubblePosType;
    radius: number;
    updatePos: (pos: bubblePosType) => void;
}

export interface artistBubbleType {
    type: "artist";
    artist: artistType;
    pos: bubblePosType;
    radius: number;
    updatePos: (pos: bubblePosType) => void;
}

export type bubbleType = profileBubbleType | artistBubbleType;

export interface artistBubbleContextType {
    type: "artist";
    artist: artistType;
}

export type bubbleContextType = artistBubbleContextType;
