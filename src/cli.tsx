#!/usr/bin/env node
import { Box, Text, render, useApp, useInput } from 'ink';
import React, { useState } from 'react';
import { MouseProvider, MouseEvent } from './mouse.js';
import { Button } from './button.js';
import { FullScreenProvider } from './fullscreen.js';
import { Scrollable } from './scrollable.js';

export default function App() {
  const [message, setMessage] = useState("no button clicked");
  const { exit } = useApp();
  useInput((input, key) => {
    if (input === 'q') {
      exit();
    }
  });
  let items = []
  for (let x = 0; x < 20; x++) {
    items.push(`Item ${x}`)
  }
  return (
      <MouseProvider fullScreen={true}>
      {/* <MouseProvider> */}
        <Box flexDirection='column' alignItems='flex-start'>
          <Box flexDirection='row' alignItems='flex-start'>
            <Button 
              text="Primary" 
              type="primary" 
              onClick={(event: MouseEvent) => setMessage(`Primary clicked ${JSON.stringify(event)}`)} 
            />
            <Button 
              text="Secondary" 
              type="secondary" 
              onClick={(event: MouseEvent) => setMessage(`Secondary clicked ${JSON.stringify(event)}`)} 
            />
          </Box>
          <Button 
            text="Error" 
            type="error" 
            onClick={(event: MouseEvent) => setMessage(`Error clicked ${JSON.stringify(event)}`)} 
          />
          <Text>
            Message: <Text color="green">{message}</Text>
          </Text>
          <Scrollable itemsToDisplay={5} items={items} multipleSelect={true} />
          <Scrollable itemsToDisplay={5} items={items} multipleSelect={false} />
        </Box>
      </MouseProvider>
  );
}

render(<App />);