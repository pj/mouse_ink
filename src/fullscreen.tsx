import React, { PropsWithChildren, createContext, useEffect } from "react";

const FullScreenContext = createContext(null);

export function FullScreenProvider(props: PropsWithChildren) {
  useEffect(
    () => {
      process.stdout.write('\x1b[?1049h');
      process.stdout.write('\x1bc');

      return (() => {
        process.on('exit', function () {
          process.stdout.write('\x1b[?1049l');
        });
      })
    },
    []
  );

  return (
    <FullScreenContext.Provider value={null}>
      {props.children}
    </FullScreenContext.Provider>
  );
}