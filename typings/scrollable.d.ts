import React from "react";
type ScrollableBox = {
    items: string[];
    itemsToDisplay: number;
    multipleSelect: boolean;
    onSelect: (selected: number[]) => void;
};
export declare function Scrollable(props: ScrollableBox): React.JSX.Element;
export {};
