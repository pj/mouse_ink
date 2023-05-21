import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import { LocationCallback, Position, useMouse, MouseEvent } from "./mouse.js";
import { Box, DOMElement, Text } from "ink";
import {isDeepStrictEqual} from 'util';

type ScrollableBox = {
  items: string[];
  itemsToDisplay: number;
};

export function Scrollable(props: ScrollableBox) {
  const updateLocation = useMouse();
  const ref = useRef<DOMElement | null>(null);
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    if (ref.current && ref.current.yogaNode) {
      const layout = ref.current.yogaNode.getComputedLayout();
      const position: Position = {
        left: layout.left, 
        top: layout.top,
        right: layout.right + layout.width, 
        bottom: layout.top + layout.height
      }

      if (!isDeepStrictEqual(position, currentPosition)) {
        setCurrentPosition(position);
        updateLocation(
            null, {
            position: position,
            callback: (event: MouseEvent) => {
                if (event.type === "scrolldown") {
                    setCurrentIndex(idx => Math.min(idx+1, props.items.length - props.itemsToDisplay));
                } else if (event.type === "scrollup") {
                    setCurrentIndex(idx => Math.max(idx-1, 0));
                }
            }
        });
      }
    }
  });

  let items = [];
  let widestItem = 0;
  let scrollbarItems = [];
  for (let i = 0; i < props.items.length; i++) {
    const item = props.items[i];
    if (i >= currentIndex && i < currentIndex+props.itemsToDisplay) {
        items.push(<Box key={item}><Text>{item}</Text></Box>);
    }
    widestItem = Math.max(item.length, widestItem);
  }

  let barPosition = Math.floor((currentIndex / props.items.length) * props.itemsToDisplay);

  for (let i = 0; i < props.itemsToDisplay; i++) {
    if (i === barPosition) {
        scrollbarItems.push(<Box key={i}><Text>│║</Text></Box>);
    } else {
        scrollbarItems.push(<Box key={i}><Text>│</Text></Box>);
    }
  }

  return (
    <Box ref={ref} borderStyle="round" flexDirection="row" width={widestItem+6} justifyContent="space-between">
        <Box flexDirection="column">
            {items}
        </Box>
        <Box flexDirection="column">
            {scrollbarItems}
        </Box>
    </Box>
  );
}
