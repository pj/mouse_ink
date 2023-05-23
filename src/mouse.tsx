import { Box, Newline, Text, DOMElement } from "ink";
import React, { PropsWithChildren, createContext, useContext, useEffect, useRef, useState } from "react";
import {isDeepStrictEqual} from 'util';
import {Node} from 'yoga-wasm-web';
import intercept from 'intercept-stdout';

export function useMouse() {
  const setLocations = useContext(MouseContext);

  if (!setLocations) {
    throw new Error(
      'No MouseContext.Provider found when calling useMouse.'
    );
  }

  return setLocations;
}

export type MouseEvent = {
  shift: boolean,
  ctrl: boolean,
  meta: boolean,
  mouseButton: number;
  type: 'scrolldown' | 'scrollup' | 'mousedown' | 'mouseup';
  x: number;
  y: number;
}

export type LocationCallback = (event: MouseEvent) => void

export type Position = {
  top: number,
  bottom: number,
  left: number,
  right: number,
}

export type Location = {
  position: Position,
  callback: LocationCallback
}

export type MouseRefState = {
  locations: Location[];
  cursorPosition: [number, number] | null;
}

export type MouseProps = {
  fullScreen?: boolean
} & PropsWithChildren;

export const MouseContext = createContext<
  ((currentPosition: Position | null, location: Location) => void) | null
>(null);

function parseMouseEvent(event_data: string): MouseEvent {
  const data = event_data.slice(3);
  const dsplit = data.split(';');
  const button = parseInt(dsplit[0])
  const scrolling = (button & (1 << 6)) !== 0;
  const mouse1 = (button & 0b1) === 0;
  const mouse2 = (button & 0b1) === 1;
  return (
    {
      shift: (button & (1 << 2)) !== 0,
      ctrl: (button & (1 << 4)) !== 0,
      meta: (button & (1 << 3)) !== 0,
      mouseButton: (button & 0b11),
      x: parseInt(dsplit[1]) - 1,
      y: parseInt(dsplit[2]) - 1,
      type:
        (scrolling && mouse1) ? 'scrollup'
          : (scrolling && mouse2) ? 'scrolldown'
            : dsplit[2].endsWith('M') ? 'mouseup'
              : 'mousedown'
    }
  );
}

export function MouseProvider(props: MouseProps) {
  const boxRef = useRef<DOMElement | null>(null);
  const stateRef = useRef<MouseRefState>({
    locations: [],
    cursorPosition: null
  });
  const [fullScreenEnabled, setFullScreenEnabled] = useState(false);

  function updateLocation(currentPosition: Position | null, newLocation: Location) {
    stateRef.current.locations.push(newLocation);
  }

  function handleData(data: Buffer) {
    const asdf = data.toString();
    // const codes = [];
    // for (let x = 0; x < asdf.length; x++) {
    //   codes.push(asdf.charCodeAt(x));
    // }

    if (asdf.startsWith("\x1b[<")) {
      const event = parseMouseEvent(asdf)
      if (!(boxRef.current && boxRef.current.yogaNode)) {
        throw new Error("Box ref not set");
      }

      const layout = boxRef.current.yogaNode.getComputedLayout();
      let currentOffset = 0;
      if (!props.fullScreen) {
        if (!(stateRef.current && stateRef.current.cursorPosition)) {
          throw new Error("cursor position not set");
        }

        currentOffset = stateRef.current.cursorPosition[0] - layout.height - 1;
      }

      for (let location of stateRef.current.locations) {
        if (
          (currentOffset + location.position.top) <= event.y && (currentOffset + location.position.bottom) > event.y
          && location.position.left <= event.x && (location.position.right + location.position.left) > event.x
        ) {
          location.callback(event)
          break
        }
      }
    } else if (asdf.startsWith("\x1b[") && asdf.endsWith("R")) {
      const [rowString, columnString] = asdf.slice(2, -1).split(";");
      stateRef.current.cursorPosition = [parseInt(rowString), parseInt(columnString)];
    } 
  }

  useEffect(
    () => {
      if (props.fullScreen) {
        process.stdout.write('\x1b[?1049h');
        process.stdout.write('\x1bc');
        setFullScreenEnabled(true);
      }
      process.stdout.write('\x1b[?1000h');
      // Enable SGR mode to get support for wider terminals.
      process.stdout.write('\x1b[?1006h');
      process.stdin.on("data", handleData)

      // When not in fullscreen, we need to know where the bottom of the output so we can offset the location of 
      // elements to register clicks correctly. We need to reset this position every time there is some output. To do 
      // this we write out a code to get the cursor status, this is received in the handleData function above.
      let unhookIntercept : ReturnType<typeof intercept> | null = null;
      if (!props.fullScreen) {
        // Get initial cursor position
        process.stdout.write(`\x1b[6n`);
        // unhookIntercept = intercept((txt: string) => {
        //   return `${txt}\x1b[6n`;
        // });
      }

      return (() => {
        process.stdout.write('\x1b[?1006l');
        process.stdout.write('\x1b[?1000l');
        if (props.fullScreen) {
          process.stdout.write('\x1b[?1049l');
        } else if (unhookIntercept) {
          unhookIntercept()
        }
      })
    },
    []
  );

  if (props.fullScreen && !fullScreenEnabled) {
    return null;
  }

  return (
    <MouseContext.Provider value={updateLocation}>
      <Box ref={boxRef}>
        {props.children}
      </Box>
    </MouseContext.Provider>
  );
}
