export interface componentOverlay {
    hidden: false;
    component: JSX.Element;
}

export interface hiddenOverlay {
    hidden: true;
}

export type overlayStateType = componentOverlay | hiddenOverlay;
