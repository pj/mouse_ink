import React, { PropsWithChildren } from "react";
export declare function useMouse(): (currentPosition: Position | null, location: Location) => void;
export type MouseEvent = {
    shift: boolean;
    ctrl: boolean;
    meta: boolean;
    mouseButton: number;
    type: 'scrolldown' | 'scrollup' | 'mousedown' | 'mouseup';
    x: number;
    y: number;
};
export type LocationCallback = (event: MouseEvent) => void;
export type Position = {
    top: number;
    bottom: number;
    left: number;
    right: number;
};
export type Location = {
    position: Position;
    callback: LocationCallback;
};
export declare const MouseContext: React.Context<((currentPosition: Position | null, location: Location) => void) | null>;
export declare function MouseProvider(props: PropsWithChildren): React.JSX.Element;
