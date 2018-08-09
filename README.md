# serialToWebsockets
Little repo hosting some tool(s) to ease debug &amp; development

## switching between xdotool & websockets
Later on, a switch could be provided to either output to xdotool or websockets
https://brewinstall.org/Install-xdotool-on-Mac-with-Brew/

## API

once the server is started with ```javascript nodejs ./app.js```,
use either cli or Espruino board connected over serial & send data in the following format to forward it to client as inputs

### cli supported commands
```javascript
ws:{"wsmouse.send":[20,20,0,0]} // to send mouse events ( wsmouse.send:[x,y,btn,wheel]} )
ws:{"wskeyboard.tap":[0,5]} // to send keyboard events ( wskeyboard.tap:[modifiers,key] )
```
### Espruino commands
```javascript
// WSMouse
wsmouse.send( [x,y,btn,wheel] )
// WSKeyboard
wskeyboard.setModifiers(modifiers, callback)
wskeyboard.tap = (key, callback)
wskeyboard.type(txt, callback)

```
