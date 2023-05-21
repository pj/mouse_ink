import React from "react";
import { LocationCallback } from "./mouse.js";
type ClickableBox = {
    onClick: LocationCallback;
    text: string;
    type: "primary" | "secondary" | "error";
};
export declare function Button(props: ClickableBox): React.JSX.Element;
export {};
