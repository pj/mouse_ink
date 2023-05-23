import React, { PropsWithChildren, useEffect, useReducer, useRef, useState } from "react";
import { LocationCallback, Position, useMouse, MouseEvent } from "./mouse.js";
import { Box, DOMElement, Text } from "ink";
import { isDeepStrictEqual } from 'util';
import fs from 'fs';

// const mylog = new console.Console(
//   fs.createWriteStream("logger.log"),
//   fs.createWriteStream("error.log")
// );

type SelectProps = {
  items: string[];
  itemsToDisplay: number;
  multipleSelect: boolean;
  onSelect: (selected: number[]) => void;
};

type SelectState = {
  currentIndex: number;
  selectedIndexes: number[];
  currentBoundingBox: Position | null;

  multipleSelect: boolean;
  itemsLength: number;
  itemsToDisplay: number;
}

type SelectAction =
  { type: "scrollDown" }
  | { type: "scrollUp" }
  | { type: "selectItem", x: number, y: number, shift: boolean }
  | { type: "updateBoundingBox", position: Position }
  | { type: "updateFromProps", multipleSelect: boolean, itemsLength: number, itemsToDisplay: number }

function selectReducer(state: SelectState, action: SelectAction): SelectState {
  if (action.type === "scrollDown") {
    return ({
      ...state,
      currentIndex: Math.min(state.currentIndex + 1, state.itemsLength - state.itemsToDisplay),
    });
  } else if (action.type === "scrollUp") {
    return ({
      ...state,
      currentIndex: Math.max(state.currentIndex - 1, 0),
    });
  } else if (action.type === "selectItem") {
    if (state.currentBoundingBox) {
      let selectedItem: number | null = null;
      if (
        action.x > 1
        && action.x < state.currentBoundingBox.right - 3
        && action.y > 0
        && action.y < state.currentBoundingBox.bottom
      ) {
        const clickLocation = action.y - state.currentBoundingBox.top - 1;

        selectedItem = state.currentIndex + clickLocation;
      }

      if (selectedItem === null) {
        return state
      }

      // mylog.log("=====")
      // mylog.log(JSON.stringify(state))
      // mylog.log(JSON.stringify(action))
      if (state.multipleSelect && action.shift) {
        if (state.selectedIndexes.includes(selectedItem)) {
          return ({
            ...state,
            selectedIndexes: state.selectedIndexes.filter(item => item !== selectedItem)
          });
        } else {
          return ({
            ...state,
            selectedIndexes: [...state.selectedIndexes, selectedItem],
          });
        }
      } else {
        return ({
          ...state,
          selectedIndexes: [selectedItem],
        });
      }
    } else {
      return state;
    }
  } else if (action.type === "updateBoundingBox") {
    return ({
      ...state,
      currentBoundingBox: action.position
    });
  } else if (action.type === "updateFromProps") {
    return ({
      ...state,
      multipleSelect: action.multipleSelect,
      itemsLength: action.itemsLength,
      itemsToDisplay: action.itemsToDisplay
    });
  }

  throw new Error("Unknown action");
}

export function Select(props: SelectProps) {
  const updateLocation = useMouse();
  const ref = useRef<DOMElement | null>(null);
  const [selectState, dispatch] = useReducer(
    selectReducer,
    {
      currentIndex: 0,
      selectedIndexes: [],
      currentBoundingBox: null,
      multipleSelect: props.multipleSelect,
      itemsLength: props.items.length,
      itemsToDisplay: props.itemsToDisplay,
    }
  );

  useEffect(() => {
    if (ref.current && ref.current.yogaNode) {
      const layout = ref.current.yogaNode.getComputedLayout();
      const position: Position = {
        left: layout.left,
        top: layout.top,
        right: layout.right + layout.width,
        bottom: layout.top + layout.height
      }

      if (!isDeepStrictEqual(position, selectState.currentBoundingBox)) {
        dispatch({ type: "updateBoundingBox", position })
        updateLocation(
          null, {
          position: position,
          callback: (event: MouseEvent) => {
            if (event.type === "scrolldown") {
              dispatch({ type: "scrollDown" });
            } else if (event.type === "scrollup") {
              dispatch({ type: "scrollUp" });
            } else if (event.type === "mousedown") {
              dispatch({ type: "selectItem", x: event.x, y: event.y, shift: event.shift });
            }
          }
        });
      }
    }
  });

  useEffect(() => {
    dispatch({
      type: "updateFromProps",
      itemsLength: props.items.length,
      itemsToDisplay: props.itemsToDisplay,
      multipleSelect: props.multipleSelect
    })
  }, [props.items, props.itemsToDisplay, props.multipleSelect]);

  useEffect(() => {
    if (selectState.selectedIndexes.length > 0) {
      props.onSelect(selectState.selectedIndexes)
    }
  }, [selectState.selectedIndexes]);


  let items = [];
  let widestItem = 0;
  let selectItems = [];
  for (let i = 0; i < props.items.length; i++) {
    const item = props.items[i];
    if (i >= selectState.currentIndex && i < selectState.currentIndex + props.itemsToDisplay) {
      let backgroundColor = "black"
      if (selectState.selectedIndexes.includes(i)) {
        backgroundColor = "grey"
      }
      items.push(<Box key={item}><Text backgroundColor={backgroundColor}>{item}</Text></Box>);
    }
    widestItem = Math.max(item.length, widestItem);
  }

  let barPosition = Math.floor((selectState.currentIndex / props.items.length) * props.itemsToDisplay);

  for (let i = 0; i < props.itemsToDisplay; i++) {
    if (i === barPosition) {
      selectItems.push(<Box key={i}><Text>│║</Text></Box>);
    } else {
      selectItems.push(<Box key={i}><Text>│</Text></Box>);
    }
  }

  return (
    <Box ref={ref} borderStyle="round" flexDirection="row" width={widestItem + 6} justifyContent="space-between">
      <Box flexDirection="column">
        {items}
      </Box>
      <Box flexDirection="column">
        {selectItems}
      </Box>
    </Box>
  );
}
