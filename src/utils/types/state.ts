export interface hoveringProfile {
    hovering: true;
    type: "profile";
}

export interface hoveringOther {
    hovering: true;
    type: "other";
}

export interface notHovering {
    hovering: false;
}

export type hoveringType = hoveringProfile | hoveringOther | notHovering;

interface dashboardMainState {
    type: "main";
    component: JSX.Element;
}

interface dashboardLoadingState {
    type: "loading";
    component: JSX.Element;
}

export type dashboardStateType = dashboardMainState | dashboardLoadingState;
