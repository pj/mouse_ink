import React, { PropsWithChildren, createContext, useContext, useEffect, useRef } from "react";

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

export const MouseContext = createContext<
  ((currentPosition: Position | null, location: Location) => void) | null
>(null);

export function MouseProvider(props: PropsWithChildren) {
  const locationRef = useRef<Location[]>([]);

  function updateLocation(currentPosition: Position | null, newLocation: Location) {
    const newLocations = [];
    if (currentPosition) {
      for (const location of locationRef.current) {
        if (location.position !== currentPosition) {
          newLocations.push(location)
        }
      }
    }
    locationRef.current.push(newLocation)
  }

  function handleData(data: Buffer) {
    const asdf = data.toString();
    const codes = [];
    for (let x = 0; x < asdf.length; x++) {
      codes.push(asdf.charCodeAt(x));
    }

    if (asdf.startsWith("\x1b[<")) {
      const data = asdf.slice(3);
      const dsplit = data.split(';');
      const button = parseInt(dsplit[0])
      const scrolling = (button & (1 << 6)) !== 0;
      const mouse1 = (button & 0b1) === 0;
      const mouse2 = (button & 0b1) === 1;
      const event: MouseEvent = {
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
      // console.log(JSON.stringify(event));
      for (let location of locationRef.current) {
        // console.log(JSON.stringify(event));
        // console.log(JSON.stringify(location.position));
        if (
          location.position.top <= event.y && location.position.bottom >= event.y
          && location.position.left <= event.x && location.position.right >= event.x
        ) {
          // console.log("calling back");
          location.callback(event)

          break
        }
      }
    }
  }
  useEffect(
    () => {
      process.stdout.write('\x1b[?1000h');
      // Enable SGR mode to get support for wider terminals.
      process.stdout.write('\x1b[?1006h');
      process.stdin.on("data", handleData)

      return (() => {
        process.on('exit', function () {
          process.stdout.write('\x1b[?1006l');
          process.stdout.write('\x1b[?1000l');
        });
      })
    },
    []
  );

  return (
    <MouseContext.Provider value={updateLocation}>
      {props.children}
    </MouseContext.Provider>
  );
}
