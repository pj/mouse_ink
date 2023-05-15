import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import { LocationCallback, Position, useMouse } from "./mouse.js";
import { Box, DOMElement, Text } from "ink";

type ClickableBox = {
  onClick: LocationCallback
} & PropsWithChildren;

export function ClickableBox(props: ClickableBox) {
  const updateLocation = useMouse();
  const ref = useRef<DOMElement | null>(null);
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null);

  useEffect(() => {
    if (ref.current && ref.current.yogaNode) {
      const layout = ref.current.yogaNode.getComputedLayout();
    //   console.log(JSON.stringify(ref.current.yogaNode))
      const position: Position = {
        left: layout.left, 
        top: layout.top,
        right: layout.right + layout.width, 
        bottom: layout.top + layout.height
      }

      setCurrentPosition(position);
      updateLocation(
        null, {
        position: position,
        callback: props.onClick
      }
      );
    }
  }, [ref.current, ref.current?.yogaNode]);

  return (
    <Box ref={ref} borderStyle="round">
      {props.children}
      <Text> currentPosition: {currentPosition === null ? null : JSON.stringify(currentPosition)}</Text>
    </Box>
  );
}
