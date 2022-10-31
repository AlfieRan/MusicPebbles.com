import { artistType } from "./spotify";

export interface bubblePosType {
    x: number;
    y: number;
}

export interface artistBubbleContextType {
    type: "artist";
    artist: artistType;
}

export interface profileBubbleContextType {
    type: "profile";
}

export type bubblePhysicsType = {
    pos: bubblePosType;
    velocity: bubblePosType;
    radius: number;
    updatePos: (pos: bubblePosType) => void;
};

export type bubbleType = {
    details: artistBubbleContextType | profileBubbleContextType;
    physics: bubblePhysicsType;
};

export type bubbleContextType =
    | artistBubbleContextType
    | profileBubbleContextType;
