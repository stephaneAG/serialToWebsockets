/* following right below is the Espruino code */
/*
   Original code ( USBKeyboard.js )
   Copyright (c) 2015 Gordon Williams, Pur3 Ltd. See the file LICENSE for copying permission.

   Below code ( modified* version of USBKeyboard.js )
   Copyright (c) 2018 Stephane Adam Garnier, SeedsDesign. MIT license. ( or whatever is the best in regards to Gordon Williams' ;p )

   *Nb: both versions of the module could be merged if we can use the modified version of .type() ;)
*/
```
var wskb = require("USBKeyboard2");

// use as the original USBKeyboard module
setWatch(function() {
  wskb.setModifiers(wskb.MODIFY.SHIFT, function() {
    wskb.type("HELLO WORLD", function() {
      wskb.setModifiers(0, function() {
        wskb.tap(wskb.KEY.ENTER);
      });
    });
  });
}, BTN, {debounce:100,repeat:true, edge:"rising"});

// enjoy niceties
exports.htype('abcdefghijklmnopqrstuvwxyz');
exports.htype('abcdefghijklmnopqrstuvwxyz'.toUpperCase());
exports.htype('aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ');
exports.htype('1234567890');

// combine with .tap() .. and do inception ? ^^
exports.htype('exports.htype("lol");', function(){ exports.tap(KEY.ENTER); });

// combine any char & it will auto handle applying the right modifier flag(s)
exports.htype('rgb(0, 255, 128)');
exports.htype('#0FAC3A');
exports.htype('hsl(360, 100%, 50%)');

// not all characters are supported this way, but adding them is quite easy ( ex: for "©" )
exports.htype('Hello World Espruino© USBKeyboard2.js module !');
```

E.setUSBHID({
  reportDescriptor : [
        0x05, 0x01,          // Usage Page (Generic Desktop),
        0x09, 0x06,          // Usage (Keyboard),
        0xA1, 0x01,          // Collection (Application),
        0x75, 0x01,          //   Report Size (1),
        0x95, 0x08,          //   Report Count (8),
        0x05, 0x07,          //   Usage Page (Key Codes),
        0x19, 0xE0,          //   Usage Minimum (224),
        0x29, 0xE7,          //   Usage Maximum (231),
        0x15, 0x00,          //   Logical Minimum (0),
        0x25, 0x01,          //   Logical Maximum (1),
        0x81, 0x02,          //   Input (Data, Variable, Absolute), ;Modifier byte
        0x95, 0x01,          //   Report Count (1),
        0x75, 0x08,          //   Report Size (8),
        0x81, 0x03,          //   Input (Constant),                 ;Reserved byte
        0x95, 0x05,          //   Report Count (5),
        0x75, 0x01,          //   Report Size (1),
        0x05, 0x08,          //   Usage Page (LEDs),
        0x19, 0x01,          //   Usage Minimum (1),
        0x29, 0x05,          //   Usage Maximum (5),
        0x91, 0x02,          //   Output (Data, Variable, Absolute), ;LED report
        0x95, 0x01,          //   Report Count (1),
        0x75, 0x03,          //   Report Size (3),
        0x91, 0x03,          //   Output (Constant),                 ;LED report padding
        0x95, 0x06,          //   Report Count (6),
        0x75, 0x08,          //   Report Size (8),
        0x15, 0x00,          //   Logical Minimum (0),
        0x25, 0x68,          //   Logical Maximum(104),
        0x05, 0x07,          //   Usage Page (Key Codes),
        0x19, 0x00,          //   Usage Minimum (0),
        0x29, 0x68,          //   Usage Maximum (104),
        0x81, 0x00,          //   Input (Data, Array),
        0xc0                 // End Collection
  ]
});

/*
  R: even if some characters are NOT printed onto some keyboard keys,
  it doesn't mean that pressing a modifier then a key wouldn't produce another character
  in other words, only the OS keymap layout is important, NOT what's printed on one's keyboard
*/
// R: Hut1_12v2.pdf p.53
var MODIFY = {
  CTRL        : 0x01,
  SHIFT       : 0x02,
  ALT         : 0x04,
  GUI         : 0x08,
  LEFT_CTRL   : 0x01,
  LEFT_SHIFT  : 0x02,
  LEFT_ALT    : 0x04,
  LEFT_GUI    : 0x08,
  RIGHT_CTRL  : 0x10,
  RIGHT_SHIFT : 0x20,
  RIGHT_ALT   : 0x40,
  RIGHT_GUI   : 0x80
 };
/* followinf layout is for the keyboard mapping on a zenbook prime ( FR ) */
var KEY = {
  //a           : 4,
  //A           :[4, MODIFY.SHIFT],
  a           : 20,                   // MAPPED FROM US/EN "q"
  A           :[20, MODIFY.SHIFT],    // MAPPED FROM US/EN "Q"
  b           : 5,
  B           :[5, MODIFY.SHIFT],
  c           : 6,
  C           :[6, MODIFY.SHIFT],
  "©"         :[6, MODIFY.SHIFT | MODIFY.RIGHT_ALT], // BONUS/EXAMPLE FOR HOW TO SET MULTIPLE MODIFIER FLAGS
  d           : 7,
  D           :[7, MODIFY.SHIFT],
  e           : 8,
  E           :[8, MODIFY.SHIFT],
  f           : 9,
  F           :[9, MODIFY.SHIFT],
  g           : 10,
  G           :[10, MODIFY.SHIFT],
  h           : 11,
  H           :[11, MODIFY.SHIFT],
  i           : 12,
  I           :[12, MODIFY.SHIFT],
  j           : 13,
  J           :[13, MODIFY.SHIFT],
  k           : 14,
  K           :[14, MODIFY.SHIFT],
  l           : 15,
  L           :[15, MODIFY.SHIFT],
  //m           : 16,                  // WILL BECOME ","
  m           : 51,                    // MAPPED FROM US/EN ";"
  //M           :[16, MODIFY.SHIFT],   // WILL BECOME ""
  M           :[51, MODIFY.SHIFT],
  n           : 17,
  N           :[17, MODIFY.SHIFT],
  o           : 18,
  O           :[18, MODIFY.SHIFT],
  p           : 19,
  P           :[19, MODIFY.SHIFT],
  //q           : 20,                  // MAPPED FROM US/EN "a"
  //Q           :[20, MODIFY.SHIFT],   // MAPPED FROM US/EN "A"
  q           : 4,
  Q           :[4, MODIFY.SHIFT],
  r           : 21,
  R           :[21, MODIFY.SHIFT],
  s           : 22,
  S           :[22, MODIFY.SHIFT],
  t           : 23,
  T           :[23, MODIFY.SHIFT],
  u           : 24,
  U           :[24, MODIFY.SHIFT],
  v           : 25,
  V           :[25, MODIFY.SHIFT],
  //w           : 26,
  //W           :[26, MODIFY.SHIFT],
  w           : 29,                    // MAPPED FROM US/EN "z"
  W           :[29, MODIFY.SHIFT],     // MAPPED FROM US/EN "Z"
  x           : 27,
  X           :[27, MODIFY.SHIFT],
  y           : 28,
  Y           :[28, MODIFY.SHIFT],
  //z           : 29,
  //Z           :[29, MODIFY.SHIFT],
  z           : 26,                    // MAPPED FROM US/EN "w"
  Z           :[26, MODIFY.SHIFT],     // MAPPED FROM US/EN "W"
  "²"         : 53,                    // MAPPED FROM US/EN "~"
  "&"         : 30,
  1           :[30, MODIFY.SHIFT],
  "é"         : 31,
  2           :[31, MODIFY.SHIFT],
  "~"         :[31, MODIFY.RIGHT_ALT],
  '"'         : 32,
  3           :[32, MODIFY.SHIFT],
  "#"         :[32, MODIFY.RIGHT_ALT],
  "'"         : 33,
  4           :[33, MODIFY.SHIFT],
  "{"         :[33, MODIFY.RIGHT_ALT],
  "("         : 34,
  5           :[34, MODIFY.SHIFT],
  "["         :[34, MODIFY.RIGHT_ALT],
  "-"         : 35,
  6           :[35, MODIFY.SHIFT],
  "|"         :[35, MODIFY.RIGHT_ALT],
  "è"         : 36,
  7           :[36, MODIFY.SHIFT],
  "`"         :[36, MODIFY.RIGHT_ALT],
  "_"         : 37,
  8           :[37, MODIFY.SHIFT],
  "\\"        :[37, MODIFY.RIGHT_ALT],
  "ç"         : 38,
  9           :[38, MODIFY.SHIFT],
  "^"         :[38, MODIFY.RIGHT_ALT],                                    // HAS A COMMENTED-OUT DUPLICATE "^"
  "à"         : 39,
  0           :[39, MODIFY.SHIFT],
  "@"         :[39, MODIFY.RIGHT_ALT],
  ")"         : 45,                       // MAPPED FROM US/EN "-"
  "°"         :[45, MODIFY.SHIFT],        // DEDUCED FROM THE ABOVE
  "]"         :[45, MODIFY.RIGHT_ALT],    // DEDUCE FROM THE ABOVE
  "="         : 46,                       // SAME AS FOR US/EN "="
  "+"         :[46, MODIFY.SHIFT],        // DEDUCED FROM THE ABOVE
  "}"         :[46, MODIFY.RIGHT_ALT],    // DEDUCED FROM THE ABOVE
  // WIP P..
  //"^"         : 47,                     // MAPPED FROM US/EN   "["      // DUPLICATE "^"
  "¨"         :[47, MODIFY.SHIFT],        // MAPPED FROM US/EN   "{"
  "$"         : 48,                       // MAPPED FROM US/EN   "]"
  "£"         :[48, MODIFY.SHIFT],        // MAPPED FROM US/EN   "}"
  "¤"         :[48, MODIFY.RIGHT_ALT],    // DEDUCED FROM THE ABOVE
  // WIP M..
  "ù"         : 52,                       // MAPPED FROM US/EN "'"
  "%"         :[52, MODIFY.SHIFT],        // DEDUCED FROM THE ABOVE
  "*"         : 49,                       // MAPPED FROM US/EN "\\"
  "µ"         :[49, MODIFY.SHIFT],
  "<"         :[54, MODIFY.SHIFT],        // MAPPED FROM US/EN ","
  ">"         :[55, MODIFY.SHIFT],        // MAPPED FROM US/EN "."
  // WIP N..
  ","         : 16,                       // MAPPED FROM US/EN "m"
  "?"         :[16, MODIFY.SHIFT],        // MAPPED FROM US/EN "M"
  ";"         : 54,                       // MAPPED FROM US/EN ","
  "."         :[54, MODIFY.SHIFT],        // DEDUCED FROM THE ABOVE
  ":"         : 55,                       // MAPPED FROM US/EN "."
  "/"         :[55, MODIFY.SHIFT],        // DEDUCED FROM THE ABOVE
  "!"         : 56,                       // MAPPED FROM US/EN "/"
  "§"         :[56, MODIFY.SHIFT],        // DEDUCED FROM THE ABOVE
  ENTER       : 40,
  "\n"        : 40,
  ESC         : 41,
  BACKSPACE   : 42,
  "\t"        : 43,
  " "         : 44,
  //"-"         : 45, // - & _            // REMAPPED
  //"="         : 46, // = & +            // REMAPPED
  //"["         : 47, // [ & {            // REMAPPED
  //"]"         : 48, // ] & }            // REMAPPED
  //"\\"        : 49, // \ & |            // REMAPPED
  NUMBER      : 50, // # & ²
  //";"         : 51, // ; & :            // REMAPPED
  //"'"         : 52, // ' & "            // REMAPPED
  //"~"         : 53, // grave accent & ~ // REMAPPED
  //","         : 54, // , & <            // REMAPPED
  //"."         : 55, // . & >            // REMAPPED
  //"/"         : 56, // / & ?            // REMAPPED
  CAPS_LOCK   : 57,
  F1          : 58,
  F2          : 59,
  F3          : 60,
  F4          : 61,
  F5          : 62,
  F6          : 63,
  F7          : 64,
  F8          : 65,
  F9          : 66,
  F10         : 67,
  F11         : 68,
  F12         : 69,
  PRINTSCREEN : 70,
  SCROLL_LOCK : 71,
  PAUSE       : 72,
  INSERT      : 73,
  HOME        : 74,
  PAGE_UP     : 75,
  DELETE      : 76,
  END         : 77,
  PAGE_DOWN   : 78,
  RIGHT       : 79,
  LEFT        : 80,
  DOWN        : 81,
  UP          : 82,
  NUM_LOCK    : 83,
  PAD_SLASH   : 84,
  PAD_ASTERIX : 85,
  PAD_MINUS   : 86,
  PAD_PLUS    : 87,
  PAD_ENTER   : 88,
  PAD_1       : 89,
  PAD_2       : 90,
  PAD_3       : 91,
  PAD_4       : 92,
  PAD_5       : 93,
  PAD_6       : 94,
  PAD_7       : 95,
  PAD_8       : 96,
  PAD_9       : 97,
  PAD_0       : 98,
  PAD_PERIOD  : 99
};

var exports = {}; // when using a module from the right hand side of the Espruino IDE

exports.KEY = KEY;
exports.MODIFY = MODIFY;

var modifiers = 0;

exports.setModifiers = function(m, callback) {
  modifiers = m;
  E.sendUSBHID([modifiers,0,0,0,0,0,0,0]);
  if (callback) setTimeout(callback, 10);
}

exports.tap = function(key, callback) {
  E.sendUSBHID([modifiers,0,key,0,0,0,0,0]);
  setTimeout(function() {
    E.sendUSBHID([modifiers,0,0,0,0,0,0,0]);
    if (callback) setTimeout(callback, 10);
  }, 10);
}

/*
// original typing fcn
exports.type = function(txt, callback) {
  var intr = setInterval(function() {
    if (!txt.length) {
      clearInterval(intr);
      if (callback) callback();
    } else {
      if (txt[0] in KEY) exports.tap(KEY[txt[0]]);
      txt = txt.substr(1);
    }
  }, 20);
}
*/
// original typing fcn - modified to work with the adjusted "KEY" obj
exports.type = function(txt, callback) {
  var intr = setInterval(function() {
    if (!txt.length) {
      clearInterval(intr);
      if (callback) callback();
    } else {
      if (txt[0] in KEY) {
        // to ease using the adjusted "mixed values type" KEY obj
        if( typeof KEY[txt[0]] === 'number'){ exports.tap(KEY[txt[0]]); }
        else { exports.tap(KEY[txt[0]][0]); }
      }
      //exports.tap(KEY[txt[0]]); // originally
      txt = txt.substr(1);
    }
  }, 20);
}

/*
// wip debug code
var htype = function(txt, callback){
  var intr = setInterval(function(){
    if (!txt.length){
      clearInterval(intr);
      if(callback) callback();
    } else {
      if(txt[0] in KEY){
        console.log('key idx exist in layout keys:', KEY[txt[0]]);
        if( typeof KEY[txt[0]] === 'number'){ console.log('char keycode: ' + KEY[txt[0]] ); }
        else { console.log('modifier(s): ' + KEY[txt[0]][1] + ' char keycode: ' + KEY[txt[0]][0] ); }
      }
      txt = txt.substr(1);
    }
  }, 20);
}
*/

// wip debug code -- TO TEST ON ESPRUINO DEVICE :D
//var htype = function(txt, callback){
exports.htype = function(txt, callback){
  var intr = setInterval(function(){
    if (!txt.length){
      clearInterval(intr);
      if(callback) callback();
    } else {
      if(txt[0] in KEY){
        //console.log('key idx exist in layout keys:', KEY[txt[0]]);
        if( typeof KEY[txt[0]] === 'number'){
          //console.log('char keycode: ' + KEY[txt[0]]);
          var keyCode = KEY[txt[0]];
          exports.setModifiers(0, function(){
            exports.tap( keyCode );
          });
        }
        else {
          //console.log('modifier(s): ' + KEY[txt[0]][1] + ' char keycode: ' + KEY[txt[0]][0] );
          var modifiersFlag = KEY[txt[0]][1];
          var keyCode = KEY[txt[0]][0];
          exports.setModifiers(modifiersFlag, function(){
            exports.tap( keyCode, function(){
              exports.setModifiers(0); // TODO: try moving this to be called only on end of txt processing
            });
          });
        }
      }
      txt = txt.substr(1);
    }
  }, 50); // 20ms seems not enough for reliable typing ..
}
