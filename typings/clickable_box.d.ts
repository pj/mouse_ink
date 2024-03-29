import React, { PropsWithChildren } from "react";
import { LocationCallback } from "./mouse.js";
type ClickableBox = {
    onClick: LocationCallback;
} & PropsWithChildren;
export declare function Button(props: ClickableBox): React.JSX.Element;
export {};
