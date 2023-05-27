# Mouse support for  

ink is a library that


I wanted to see if I could get mouse support working

This is still a work in progress and so it has bugs. I've also got a bunch of other projects I'm working on, but if there is wider interest I can keep working on it.

To enable various terminal features you write special sequences of

To do this I decided to see if I could build some simple UI elements

A long the way I learnt bits and pieces about how shells interact with terminals.

Currently this isn't production ready.

## Interface
## MouseProvider

To enable mouse support you simply use

By default 

## useMouse

If you want to use mouse.

To calculate what location is being clicked we need to know the absolute position of the ink box. In practice what this means is that components need to update the mouse provider 

This happens by

### Button and Select

## How it works

## Shell codes

Programs interact with the terminal itself by writing special codes to standard out and receiving responses on standard in. These codes start with the escape character.

All these codes

I probably should have used terminfo for this, which provides support for multiple different terminal types. The codes used here only apply to xterm compatible terminals like iTerm2.

## Setting full screen mode

Fullscreen mode 

## Enabling mouse support

The standard mouse support mode (ESC) doesn't support terminals wider that about 120 chars, however there is another mode called sgm mode that supports this. So to enable it in the provider 

## Handling events

Once we've enabled mouse support we need to listen to mouse events which are sent by the terminal to standard in.

Events come in as an absolute position with 0, 0 being the top left.



I'm performing this calculation by , however there is probably a better algorithm out there

## Non-fullscreen apps

Detecting clicks in apps that aren't fullscreen is tricky, since we need to know where a box is relative to the output

## Next steps

There are a bunch of bugs

There are a bunch of UI elements that would be cool to have e.g. modals

An undo facility would be good, however it would probably require some type of global

Use terminfo to support more terminals.