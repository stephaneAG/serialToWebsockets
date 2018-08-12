/*
    serial & bluetooth serial to xdotool module
    provides a mapping from serial input to mouse or keyboard output

    Usage:

    var XdotoolHelper = require('./XdotoolHelper');
    var xdotoolHelper = new XdotoolHelper();
    xdotoolHelper.handleSerialInput(..);
*/

var exec = require('child_process').exec; // nice to have anyway ( and should NOT cause troubles .. I think ? )

// exec('xdotool windowfocus ' + winId + '; xdotool key '+ button + '; sleep 1; xdotool windowfocus ' + winId); // $

// store last mouse buttonS pressed ( to later release them in order ) - plurarl
// & last keybord key pressed - singular
var wsMouseBtnsLastPressed = [];
var wsKeyboardKeyLastPressed = undefined;

// mouse buttons map - to convert from L: 1, R: 2, M: 4 to L: 0, R: 2, M: 1
var wsMouseBtnsMap = function(btn){
  if(btn === 0) return -1; // None
  else if(btn === 1) return 1; // Left btn
  else if (btn === 4) return 2; // // Middle btn
  else if(btn ==2) return 3; // Right btn
}

// little alphabet to uppercase letters when shift is among the modifiers
var alphabet = 'abcdefghijklmnopqrstuvwxyz';

// THx to https://askubuntu.com/questions/93772/where-do-i-find-a-list-of-all-x-keysyms-these-days
// ==> cat /usr/include/X11/keysymdef.h | grep "<something>"
// Also, echo $'\u0022' # 0xYYYY -> \uYYYY to get the corresponding char printed ;)
var revKeyMap = {
  '4':  'a',             // A
  '5':  'b',             // B
  '6':  'c',             // C
  '7':  'd',             // D
  '8':  'e',             // E
  '9':  'f',             // F
  '10': 'g',             // G
  '11': 'h',             // H
  '12': 'i',             // I
  '13': 'j',             // J
  '14': 'k',             // K
  '15': 'l',             // L
  '16': 'm',             // M
  '17': 'n',             // N
  '18': 'o',             // O
  '19': 'p',             // P
  '20': 'q',             // Q
  '21': 'r',             // R
  '22': 's',             // S
  '23': 't',             // T
  '24': 'u',             // U
  '25': 'v',             // V
  '26': 'w',             // W
  '27': 'x',             // X
  '28': 'y',             // Y
  '29': 'z',             // Z
  '30': '1',             // 1
  '31': '2',             // 2
  '32': '3',             // 3
  '33': '4',             // 4
  '34': '5',             // 5
  '35': '6',             // 6
  '36': '7',             // 7
  '37': '8',             // 8
  '38': '9',             // 9
  '39': '0',             // 0
  '40': 'Return',        //  ENTER
  '40': 'Linefeed',      // "\n" - not sure if it will work
  '41': 'Escape',        // ESC - not sure if it will work
  '42': 'BackSpace',     // BACKSPACE
  '43': 'Tab',           // "\t" - not sure if it will work
  '44': 'space',         // " "
  '45': 'minus',         // "-"
  '46': 'equal',         // "="
  '47': 'bracketleft',   // "["
  '48': 'bracketright',  // "]"
  '49': 'backslash',     // "\\"
  '50': 'numbersign',    // NUMBER
  '51': 'semicolon',     // ";"
  '52': 'quoteright',    // "'" - not sure if it will work
  '53': 'asciitilde',    // "~"
  '54': 'comma',         // ","
  '55': 'period',        // "."
  '56': 'slash',         // "/"
  '57': 'Caps_Lock',     // CAPS_LOCK - not sure if it will work
  '58': 'F1',            // F1
  '59': 'F2',            // F2
  '60': 'F3',            // F3
  '61': 'F4',            // F4
  '62': 'F5',            // F5
  '63': 'F6',            // F6
  '64': 'F7',            // F7
  '65': 'F8',            // F8
  '66': 'F9',            // F9
  '67': 'F10',           // F10
  '68': 'F11',           // F11
  '69': 'F12',           // F12
  '70': 'PrintScreen',   // PRINTSCREEN - not sure if it will work
  '71': 'Scroll_Lock',   // SCROLL_LOCK - not sure if it will work
  '72': 'Pause',         // PAUSE - not sure if it will work
  '73': 'Insert',        // INSERT - not sure if it will work
  '74': 'Home',          // HOME - not sure if it will work
  '75': 'Page_Up',       // PAGE_UP - not sure if it will work
  '76': 'Delete',        // DELETE - not sure if it will work
  '77': 'End',           // END - not sure if it will work
  '78': 'Page_Down',     // PAGE_DOWN - not sure if it will work
  '79': 'Right',         // RIGHT - not sure if it will work
  '80': 'Left',          // LEFT - not sure if it will work
  '81': 'Down',          // DOWN - not sure if it will work
  '82': 'Up',            // UP - not sure if it will work
  '83': 'Num_Lock',      // NUM_LOCK - not sure if it will work
  '84': 'KP_Divide',     // PAD_SLASH - not sure if it will work
  '85': 'KP_Multiply',   // PAD_ASTERIX - not sure if it will work
  '86': 'KP_Subtract',   // PAD_MINUS - not sure if it will work
  '87': 'KP_Add',        // PAD_PLUS - not sure if it will work
  '88': 'KP_Enter',      // PAD_ENTER - not sure if it will work
  '89': 'KP_1',          // PAD_1 - not sure if it will work
  '90': 'KP_2',          // PAD_2 - not sure if it will work
  '91': 'KP_3',          // PAD_3 - not sure if it will work
  '92': 'KP_4',          // PAD_4 - not sure if it will work
  '93': 'KP_5',          // PAD_5 - not sure if it will work
  '94': 'KP_6',          // PAD_6 - not sure if it will work
  '95': 'KP_7',          // PAD_7 - not sure if it will work
  '96': 'KP_8',          // PAD_8 - not sure if it will work
  '97': 'KP_9',          // PAD_9 - not sure if it will work
  '98': 'KP_0',          // PAD_0 - not sure if it will work
  '99': 'KP_Separator'   // PAD_PERIOD - not sure if it will work
};

module.exports = function(){

  var self = this;

  //var wsMouseBtnsLastPressed = [];
  //var wsKeyboardKeyLastPressed = undefined;

  this.testXdotoolMouse = function(){
    for(var i=0; i<10; i++){
      exec('xdotool mousemove_relative ' +i + ' ' + i );
    }
  };

  this.handleSerialInput = function(data){
    // cleaning up data if necessary
    if(data.substr(0, 3) === '[J') { // /!\ there's a hidden char within the string as 1st position !
      console.log('hidden character found & stripped at beginning of data: presumably coming from Espruino/serial');
      data = data.substr(3);
      console.log('fixed data: ' + data);
    }
    // seems the above is not bullet-proof, so trying another way ( until I finally decide to try using JSON.stringify on the uC end ? .. )
    var data = data.substr( data.indexOf('ws:') );
    console.log('handleSerialInput: sending ' + data);

    // directly send over ws to client ( we could also have parsed the data here & use xdotool to have sys-wide stuff )
    if( data.substr(0,3) === 'ws:' ){ // forward only xdotool stuff, not all the stuff printed on serial console
      data = data.substr(3); // strip 'ws:' from data
    } else if( data.substr(0,3) !== 'ws:' ){
      console.log('  .. data doesn\'t start with "ws"');
      return -1; // return with error, C-style ;)
    }

    // check whether it's a mouse or keyboard or ..
    var dataObj = JSON.parse(data);
    if(Object.keys(dataObj)[0] === 'wsmouse.send'){ // wsmouse: { 'wsmouse.send': ([btn,x,y,s] }
      console.log('wsmouse event');

      var wsMouseEvtData = dataObj[ Object.keys(dataObj)[0] ];
      var wsMouseData = { x: wsMouseEvtData[0], y: wsMouseEvtData[1], btn: wsMouseEvtData[2], wheel: wsMouseEvtData[3] };

      var wsMouseBtn = wsMouseBtnsMap( wsMouseData.btn ); // /!\ -1 means None
      console.log('wsMouseBtn: ' + wsMouseBtn);

      // compute mouse evt type
      var mouseEvtType = undefined;
      var mouseEvtClickCount = 0;
      var mouseBtn = 0;
      if( wsMouseData.x !== 0 || wsMouseData.y !== 0 ){
        // mousemove
        mouseEvtType = 'mousemove';
        if( wsMouseBtn === -1 ){
          // No btn: release btnS previously pressed if any
          //mouseBtn = (wsMouseBtnsLastPressed.length !== 0 )? wsMouseBtnsLastPressed.pop() : 0; // == original thought ==
          //mouseBtn = 0; // not taken in account anyway during mousemove evt ?
          exec('xdotool mousemove_relative ' +wsMouseData.x + ' ' + wsMouseData.y ); // ex: xdotool mousemove_relative 0 100
        } else {
          // Btn: set it & set evt click count to 1
          //mouseEvtClickCount = 1; // == original thought ==
          //mouseBtn = wsMouseBtn; // == original thought ==
          //wsMouseBtnsLastPressed.push(mouseBtn); // == original thought ==
          //mouseBtn = 0;
          exec('xdotool mousemove_relative ' +wsMouseData.x + ' ' + wsMouseData.y ); // ex: xdotool mousemove_relative 0 100
        }
      } else {
        // mouseup || mousedown
        if( wsMouseBtn === -1 ){
          // No btn: release btnS previously pressed if any
          mouseEvtType = 'mouseup';
          mouseBtn = (wsMouseBtnsLastPressed.length !== 0 )? wsMouseBtnsLastPressed.pop() : 0;
          //exec('xdotool keyup Pointer_Button'+wsMouseBtn ); // ex: xdotool keyup Pointer_Button1
          exec('xdotool mouseup '+mouseBtn ); // ex: xdotool mouseup 1
        } else {
          // Btn: set it & set evt click count to 1
          mouseEvtType = 'mousedown';
          mouseEvtClickCount = 1;
          mouseBtn = wsMouseBtn;
          //exec('xdotool keydown Pointer_Button'+wsMouseBtn ); // ex: xdotool mousedown Pointer_Button1
          exec('xdotool mousedown '+wsMouseBtn ); // ex: xdotool mousedown 1
          wsMouseBtnsLastPressed.push(mouseBtn);
        }
      }
      //console.log(' a little log ? ..');

      //exec('xdotool mousemove_relative ' +wsMouseData.x + ' ' + wsMouseData.y ); // ex: xdotool mousemove_relative 0 100
      //xdotool keydown Pointer_Button1
      //xdotool keyup Pointer_Button1


    } else if (Object.keys(dataObj)[0] === 'wskeyboard.tap'){ // wskeyboard: { 'wskeyboard.tap': ([modifiers,key] }
      console.log('wskeyboard event');

      var wsKeyboardEvtData = dataObj[ Object.keys(dataObj)[0] ];
      var wsKeyboardData = { modifiers: Number(wsKeyboardEvtData[0]), key: wsKeyboardEvtData[1] };

      var keyEvtType = undefined;
      var revMapKeyConst = undefined;
      var actualKey = undefined;

      if( wsKeyboardData.key.toString() in revKeyMap ){
        console.log('mapped keyCode: ' + revKeyMap[ wsKeyboardData.key ] );
        keyEvtType = 'keydown';
        revMapKeyConst = revKeyMap[ wsKeyboardData.key ];

        // check if some modifiers bits are set
        var modifiersPrefix = '';
        modifiersPrefix += !!((wsKeyboardData.modifiers>>2) & 1) ? ( modifiersPrefix === '' ? 'alt' : '+alt' ) : '' ; // alt
        modifiersPrefix += !!((wsKeyboardData.modifiers>>0) & 1) ? ( modifiersPrefix === '' ? 'ctrl' : '+ctrl' ) : '' ; // ctrl
        modifiersPrefix += !!((wsKeyboardData.modifiers>>1) & 1) ? ( modifiersPrefix === '' ? 'shift' : '+shift' ) : '' ; // shift
        modifiersPrefix += !!((wsKeyboardData.modifiers>>3) & 1) ? ( modifiersPrefix === '' ? 'meta' : '+meta' ) : '' ; // meta

        // check the key to be typed & uppercase it if within letters alphabet & shift is present in modifiers
        var modifierContainsShift = !!((wsKeyboardData.modifiers>>1) & 1);
        if( alphabet.indexOf(revMapKeyConst) !== -1 && modifierContainsShift ){
          console.log( 'current modifiers: 0b' + wsKeyboardData.modifiers.toString(2) );
          console.log('current modifier === 0x02/0b10');
          revMapKeyConst = revMapKeyConst.toUpperCase();
        } else {
          console.log( 'current modifiers: 0b' + wsKeyboardData.modifiers.toString(2) );
          console.log('revMapKeyCode not within letters alphabet or current modifier !== 0x02/0b10');
        }
        //console.log('key to be "pressed" using xdotool: ' + revMapKeyConst);
        var modifiersAndKey = ( modifiersPrefix === '' ? revMapKeyConst : modifiersPrefix+'+'+revMapKeyConst );
        console.log('key to be "pressed" AND modifiers using xdotool: ' + modifiersAndKey);
        exec('xdotool keydown ' + modifiersAndKey);
        //wsKeyboardKeyLastPressed = revMapKeyConst;
        wsKeyboardKeyLastPressed = modifiersAndKey;

      } else {
        console.log('key === 0');
        keyEvtType = 'keyup';
        //console.log('key to be "released" using xdotool: ' + revMapKeyConst);
        console.log('key to be "released" using xdotool: ' + wsKeyboardKeyLastPressed);
        exec('xdotool keyup ' + wsKeyboardKeyLastPressed);
      }

      //exec('xdotool key <key>');
      //exec('xdotool key <modifier>+<key>');
      //exec('xdotool keydown <modifier>+<key>');
      //exec('xdotool keyup <modifier>+<key>');
    }
  }
}
