import { artistType } from "./spotify";

export interface artistOverlay {
    type: "artist";
    artist: artistType;
}

export interface nicheOverlay {
    type: "niche";
}

export type infoOverlayType = {
    hidden: boolean;
    info: artistOverlay | nicheOverlay;
};
