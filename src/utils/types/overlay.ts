export type OverlayTypes = "songs" | "profile";

export interface componentOverlay {
    hidden: false;
    type: OverlayTypes;
}

export interface hiddenOverlay {
    hidden: true;
}

export type overlayStateType = componentOverlay | hiddenOverlay;
