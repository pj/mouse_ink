#!/usr/bin/env node
import { Box, Text, render, useApp, useInput } from 'ink';
import React, { useState } from 'react';
import { MouseProvider, MouseEvent } from './mouse.js';
import { ClickableBox } from './clickable_box.js';
import { FullScreenProvider } from './fullscreen.js';

export default function App() {
  const [message, setMessage] = useState("no button clicked");
  const { exit } = useApp();
  useInput((input, key) => {
    if (input === 'q') {
      exit();
    }
  });
  return (
      <MouseProvider>
    <FullScreenProvider>
        <Box flexDirection='column' alignItems='flex-start'>
          <ClickableBox onClick={(event: MouseEvent) => setMessage(`First ${JSON.stringify(event)}`)}>
            <Text color="cyan">First</Text>
          </ClickableBox>
          <ClickableBox onClick={(event: MouseEvent) => setMessage(`Second ${JSON.stringify(event)}`)}>
            <Text color="magenta">Second</Text>
          </ClickableBox>
          <ClickableBox onClick={(event: MouseEvent) => setMessage(`Third ${JSON.stringify(event)}`)}>
            <Text color="yellow">Third</Text>
          </ClickableBox>
        </Box>
        <Text>
          Message: <Text color="green">{message}</Text>
        </Text>
    </FullScreenProvider>
      </MouseProvider>
  );
}

render(<App />);
