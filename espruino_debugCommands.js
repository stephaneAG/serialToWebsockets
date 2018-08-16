/*
var num = 0;
var intr = setInterval(function(){
  if(num < 1000) num++;
  else num = 0;
  console.log(num);
},1000);
*/
/*
var num = 0;
var intr = setInterval(function(){
  if(num < 50) num++;
  else num = 0;
  console.log('ws:{"wsmouse.send":['+num+',0,0,0]}');
},1000);
*/
/*
var num = 0;
var nxt = function(){
  if(num < 50) num++;
  else num = 0;
  return 'ws:{"wsmouse.send":['+num+',0,0,0]}';
};
setWatch(function() {
  LED3.toggle();
  console.log( nxt() );
  LED3.toggle();
}, BTN, {debounce:100,repeat:true, edge:"rising"});
*/

/*
// When the button is pressed, mouse the cursor in a circle around the screen
setWatch(function() {
  var p = 0;
  var intr = setInterval(function() {
    tab.send((Math.sin(p)+1)/2, (Math.cos(p)+1)/2, tab.BUTTONS.NONE);
    p += 0.02;
    if (p>Math.PI*2) clearInterval(intr);
  }, 10);
}, BTN, {debounce:100,repeat:true, edge:"rising"});
*/

// when button is pressed: draw a line - works
/*
var timeoutSpeed = 20; // 15 seems to be minimum,20 for reliable over websockets ?
setWatch(function() {
  LED1.toggle();
  console.log('ws:{"wsmouse.send":[0,0,1,0]}'); // - click left mouse button
  setTimeout(function(){
    console.log('ws:{"wsmouse.send":[0,100,0,0]}'); // - move the cursor 10xp up on screen
    setTimeout(function(){
      console.log('ws:{"wsmouse.send":[0,0,0,0]}');// - release left mouse button
      LED1.toggle();
      setTimeout(function(){
        LED2.toggle();
        console.log('ws:{"wsmouse.send":[0,0,2,0]}');// - click right mouse button
        setTimeout(function(){
          console.log('ws:{"wsmouse.send":[100,0,0,0]}');// - click right mouse button
          setTimeout(function(){
            console.log('ws:{"wsmouse.send":[0,0,0,0]}');// - release right mouse button
            LED2.toggle();
          }, timeoutSpeed);
        }, timeoutSpeed);
      }, timeoutSpeed);
    }, timeoutSpeed);
  }, timeoutSpeed);
}, BTN, {debounce:100,repeat:true, edge:"rising"});
*/

// - move the cursor in a circle around the screen
// - release left mouse button
// - move the cursor 10px above
// - click right mouse button
// - move the cursor in a circle around the screen
// - release right mouse button
// - move the cursor 10px above
// - click middle mouse button
// - move the cursor in a circle around the screen
// - release middle mouse button
/*
setWatch(function() {
  LED1.toggle();
  console.log('ws:{"wsmouse.send":[0,0,1,0]}'); // - click left mouse button
  // - move the cursor in a circle around the screen
  var p = 0;
  var intr = setInterval(function() {
    //tab.send((Math.sin(p)+1)/2, (Math.cos(p)+1)/2, tab.BUTTONS.NONE); // original Espruino USBTablet.js example
    console.log('ws:{"wsmouse.send":['+(Math.sin(p)+1)/2+','+(Math.cos(p)+1)/2+',0,0]}');
    p += 0.02;
    if (p>Math.PI*2){
      clearInterval(intr);
      console.log('ws:{"wsmouse.send":[0,0,0,0]}');// - release left mouse button
      LED1.toggle();
    }
  }, 10);
  //console.log('ws:{"wsmouse.send":[0,0,0,0]}');// - release left mouse button
  //LED1.toggle();
}, BTN, {debounce:100,repeat:true, edge:"rising"});
*/



// ==== keyboard debug ====
/*
var timeoutSpeed = 20; // 15 seems to be minimum,20 for reliable over websockets ?
setWatch(function() {
  LED1.toggle();
  //console.log('ws:{"wskeyboard.tap":[0,'+4+']}');// - keydown key 'a'
  console.log('ws:{"wskeyboard.tap":[2,'+4+']}');// - keydown key 'A'
  setTimeout(function(){
    console.log('ws:{"wskeyboard.tap":[0,'+0+']}');// - keyup key 'a'
    LED1.toggle();
  }, timeoutSpeed);
}, BTN, {debounce:100,repeat:true, edge:"rising"});
*/
// R: use 'println' instead of 'console.log' to NOT get "weird chars prefix" for parsing
/*
var println = function(msg){print(msg+'\r\n');};
var timeoutSpeed = 20; // 15 seems to be minimum,20 for reliable over websockets ?
setWatch(function() {
  LED1.toggle();
  //console.log('ws:{"wskeyboard.tap":[0,'+4+']}');// - keydown key 'a'
  println('ws:{"wskeyboard.tap":[2,'+4+']}');// - keydown key 'A'
  setTimeout(function(){
    println('ws:{"wskeyboard.tap":[0,'+0+']}');// - keyup key 'a'
    LED1.toggle();
  }, timeoutSpeed);
}, BTN, {debounce:100,repeat:true, edge:"rising"});
*/



// ==== keyboard debug ( official Espruino module ) ====
// TODO: fix qwerty/azerty stuff at 1st, then maybe add to supported keys ?
/*
var kb = require("USBKeyboard");
//kb.toggleMapping = function(){ [ kb.KEY.A, kb.KEY.Q, kb.KEY.Z, kb.KEY.W ] = [ kb.KEY.Q, kb.KEY.A, kb.KEY.W, kb.KEY.Z ]; };
kb.toggleMapping = function(){
  kb.KEY.Q = [ kb.KEY.A, kb.KEY.A=kb.KEY.Q][0];
  kb.KEY.W = [ kb.KEY.Z, kb.KEY.Z=kb.KEY.W][0];
};
kb.toggleMapping(); // from default qwerty to azerty
setWatch(function() {
  kb.setModifiers(kb.MODIFY.SHIFT, function() {
    LED1.toggle();
    //kb.type("A", function() { // gives me a 'Q' ?
    //kb.type("HELLO WORLD !", function() { // gives me a 'HELLO ZORLD' ?
    kb.type("AZERTY", function() { // gives me a 'QWERTY' ?
      kb.setModifiers(0, function() {
        kb.tap(kb.KEY.ENTER);
        LED1.toggle();
      });
    });
  });
}, BTN, {debounce:100,repeat:true, edge:"rising"});
*/


// ==== mouse debug ( official Espruino module ) ====
/*
var mouse = require("USBMouse");
// When the button is pressed, move the mouse south-east by 20px
setWatch(function() {
  mouse.send(20, 20, mouse.BUTTONS.NONE); // X movement, Y movement, buttons pressed
}, BTN, {debounce:100,repeat:true, edge:"rising"});
*/
