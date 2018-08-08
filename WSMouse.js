/* 
   Original code ( USBMouse.js )
   Copyright (c) 2015 Gordon Williams, Pur3 Ltd. See the file LICENSE for copying permission.
   
   Below code ( WSMouse.js )
   Copyright (c) 2018 Stephane Adam Garnier, SeedsDesign. MIT license.
*/
/* 

```
var wsmouse = require("WSMouse");

setWatch(function() {
  wsmouse.send(20,20,wsmouse.BUTTONS.NONE, 0); // X movement, Y movement, buttons pressed, scrollwheel mvmt
}, BTN, {debounce:100,repeat:true, edge:"rising"});
```

*/

exports.BUTTONS = {
  NONE : 0,
  LEFT : 1,
  RIGHT : 2,
  MIDDLE : 4
};

exports.send = function(x,y,b,s) {
  console.log( 'ws:' + JSON.stringify( { 'wsmouse.send': [b&7,x,y,s] } ) ); // log a JSON obj to the serial to forward to websockets
};

/* == debug code ==

var exports = {};
exports.BUTTONS = {
  NONE : 0,
  LEFT : 1,
  RIGHT : 2,
  MIDDLE : 4
};

exports.send = function(x,y,b,s) {
  //console.log( JSON.stringify( { 'wsmouse.send': [x,y,b&7,s] } ) ); // log a JSON obj to the serial to forward to websockets
  return JSON.stringify( { 'wsmouse.send': [x,y,b&7,s] } ); // for quick debug in the browser js console ;)
};

// usage:
//exports.send(0, 0, exports.BUTTONS.LEFT, 0);
//exports.send(20, 20, exports.BUTTONS.NONE, 0);
var wsMouseEvtDataJson = exports.send(20, 20, exports.BUTTONS.NONE, 0);
var wsMouseEvtData = JSON.parse( wsMouseEvtDataJson );

console.log( 'eventType: ' + Object.keys(wsMouseEvtData)[0] );
console.log( 'eventData: ' + wsMouseEvtData[ Object.keys(wsMouseEvtData)[0] ]);
var wsMouseEvtData = wsMouseEvtData[ Object.keys(wsMouseEvtData)[0] ];
console.log('x: ' + wsMouseEvtData[0] + ' y:' + wsMouseEvtData[1] + ' btn: ' + wsMouseEvtData[2] + ' wheel: ' + wsMouseEvtData[3]);

*/
