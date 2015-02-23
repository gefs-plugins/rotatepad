// ==UserScript==
// @name RotatePad for GEFS-Online
// @description This extension (by Qantas 94 Heavy) allows you to use your joystick in GEFS.
// @namespace GEFS-Plugins
// @match http://www.gefs-online.com/gefs.php*
// @match http://gefs-online.com/gefs.php*
// @run-at document-end
// @version 0.1.1
// @grant none
// ==/UserScript==

(function (fn) {
  // check if ges.init has already been called
  if (window.ges && ges.map3d) fn();
  else {
    var timer = setInterval(function () {
      if (window.ges && ges.init) {
        clearInterval(timer);
        var oldInit = ges.init;
        ges.init = function () {
          fn();
          oldInit();
        };
      }
    }, 4);
  }
})(function () {
  controls.joystick.test = function() {
    controls.joystick.api = null;
    if (navigator.getGamepads && navigator.getGamepads()[0]) {
      controls.joystick.api = 'html5';
      controls.joystick.stick = navigator.getGamepads()[0];
      controls.joystick.info = '<b>' + controls.joystick.stick.id + '</b> detected on native HTML5 API';
    } else {
      controls.joystick.stick = new Joystick();
      if (controls.joystick.stick.isConnected()) {
        controls.joystick.api = 'extension';
        controls.joystick.info = '<b>Controller</b> detected on JS Joystick extension';
      }
    }
    return controls.joystick.api !== null;
  };

  controls.joystick.getAxis = function(axis) {
    if (controls.joystick.api === 'html5') {
      var ret;
      switch (axis) {
        case 'x':
          ret = controls.joystick.stick.axes[0];
          break;
        case 'y':
          ret = controls.joystick.stick.axes[1];
          break;
        case 'z':
          ret = controls.joystick.stick.axes[2];
          break;
        case 'r':
          ret = controls.joystick.stick.axes[3];
          break;
      }

      if (ret !== undefined) return Math.floor(ret * 32767.5 + 32767.5);
    }
    else switch (axis) {
      case 'x': return controls.joystick.stick.getX();
      case 'y': return controls.joystick.stick.getY();
      case 'z': return controls.joystick.stick.getZ();
      case 'r': return controls.joystick.stick.getR();
    }
  };

  controls.joystick.checkButton = function(button) {
    if (controls.joystick.api === 'html5') return controls.joystick.stick.buttons[button - 1].pressed;

    var value = controls.joystick.stick.getButtons();
    return value & (1 << (button - 1)) !== 0;
  };
});
