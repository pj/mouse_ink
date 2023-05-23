import React from "react";
type SelectProps = {
    items: string[];
    itemsToDisplay: number;
    multipleSelect: boolean;
    onSelect: (selected: number[]) => void;
};
export declare function Select(props: SelectProps): React.JSX.Element;
export {};
