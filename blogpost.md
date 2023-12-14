# Mouse support for react ink

ink is a library for writing CLI applications using react. It doesn't support the mouse so I wanted to see if I could get mouse support working and create some simple UI elements. A long the way I learnt a lot about how shells interact with terminals.

This currently isn't production ready, but if there is some interest I might expand on it.

## How it works
CLI programs interact with your terminal by writing special codes to standard out and receiving responses on standard in. These codes start with the escape character and look like in XXX node js. All these codes are documented at XXX.

There are a variety of terminals out there, but this only supports xterm compatible terminals like iTerm2. In the future it should use the terminfo library to ensure compatibility across different terminals.

### Enabling fullscreen and mouse support
Xterm terminals support a fullscreen mode called alternate rendering mode, which is set by writing XXX to the terminal.

The standard mouse support mode (ESC) doesn't support terminals wider that about 120 chars, however there is another mode called sgm mode that supports this. So to enable it in the provider 

### Handling events

Once we've enabled mouse support we need to listen to mouse events which are sent by the terminal to standard in.

This is done inside a react useEffect:

SGR Mouse events are formatted like . Events come in as an absolute position with 0, 0 being the top left. So to locate which box was clicked 

I'm performing this calculation by , however there is probably a better algorithm out there

## Non-fullscreen apps

Detecting clicks in apps that aren't fullscreen is tricky, since we need to know where a box is relative to the output

At the moment this doesn't work and needs a bit more work.

## Using it
### MouseProvider

To enable mouse support you simply wrap 

By default it enables

### useMouse

If you want to add 

To calculate what location is being clicked we need to know the absolute position of the ink box. In practice what this means is that components need to update the mouse provider 

This happens by

### Button and Select

I created two 

Button works the way

Select

For a multi select.

## Next steps

There are a bunch of bugs

There are a bunch of UI elements that would be cool to have e.g. modals

An undo facility would be good, however it would probably require some type of global

Use terminfo to support more terminals.


This is still a work in progress and so it has bugs. I've also got a bunch of other projects I'm working on, but if there is wider interest I can keep working on it.


Currently this isn't production ready.