#!/usr/bin/env node
import { Box, Text, render, useApp, useInput } from 'ink';
import React, { useState } from 'react';
import { MouseProvider, MouseEvent } from './mouse.js';
import { Button } from './button.js';
import { FullScreenProvider } from './fullscreen.js';
import { Select } from './select.js';

export default function App() {
  const [message, setMessage] = useState("no button clicked");
  const [scrollable1Indexes, setScrollable1Indexes] = useState<number[]>([]);
  const [scrollable2Indexes, setScrollable2Indexes] = useState<number[]>([]);
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
            Button Event: <Text color="green">{message}</Text>
          </Text>
          <Select 
            itemsToDisplay={5} 
            items={items} 
            multipleSelect={false} 
            onSelect={(selected: number[]) => setScrollable1Indexes(selected)}
          />
          <Text>
            Scrollable 1 Selected Indexes: <Text color="green">{JSON.stringify(scrollable1Indexes)}</Text>
          </Text>
          <Select 
            itemsToDisplay={5} 
            items={items} 
            multipleSelect={true} 
            onSelect={(selected: number[]) => setScrollable2Indexes(selected)}
          />
          <Text>
            Scrollable 2 Selected Indexes: <Text color="green">{JSON.stringify(scrollable2Indexes)}</Text>
          </Text>
        </Box>
      </MouseProvider>
  );
}

render(<App />);