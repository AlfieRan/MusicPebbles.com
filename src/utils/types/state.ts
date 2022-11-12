import { Dispatch, SetStateAction } from "react";

interface hoveringComponentState {
    hovering: true;
    type: "component";
    component: JSX.Element;
}

interface hoveringTextState {
    hovering: true;
    type: "text";
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
