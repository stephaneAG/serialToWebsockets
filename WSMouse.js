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
  console.log( JSON.stringify( { 'wsmouse.send': [b&7,x,y,s] } ) ); // log a JSON obj to the serial to forward to websockets
};
