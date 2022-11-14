export type OverlayTypes = "songs";

export interface componentOverlay {
    hidden: false;
    type: OverlayTypes;
}

export interface hiddenOverlay {
    hidden: true;
}

export type overlayStateType = componentOverlay | hiddenOverlay;
