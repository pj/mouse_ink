import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import { LocationCallback, Position, useMouse, MouseEvent } from "./mouse.js";
import { Box, DOMElement, Text } from "ink";
import {isDeepStrictEqual} from 'util';

type ClickableBox = {
  onClick: LocationCallback;
  text: string;
  type: "primary" | "secondary" | "error";
};

export function Button(props: ClickableBox) {
  const updateLocation = useMouse();
  const ref = useRef<DOMElement | null>(null);
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null);

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
                if (event.type === "mouseup") {
                    props.onClick(event)
                }
            }
        });
      }
    }
  });

  let color = "green";
  let emoji = "✅"
  if (props.type === "secondary") {
    color = "white";
    emoji = "📋"
  } else if (props.type === "error") {
    color = "red";
    emoji = "❗"
  }

  return (
    <Box ref={ref} borderStyle="round" borderColor={color}>
        <Text color={color}> {emoji}  {props.text} </Text>
    </Box>
  );
}
