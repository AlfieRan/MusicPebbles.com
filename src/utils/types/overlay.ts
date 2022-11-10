import { Component } from "react";

export interface componentOverlay {
    hidden: false;
    component: Component;
}

export interface hiddenOverlay {
    hidden: true;
}

export type overlayStateType = componentOverlay | hiddenOverlay;
