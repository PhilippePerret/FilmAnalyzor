'use strict'

global.keyPress = function(key, options){
  keyDown(key,options);
  keyUp(key,options);
}
global.keyDown = function(key, options){
  keySim(key, 'keydown', options)
}
global.keyUp = function(key, options){
  keySim(key, 'keyup', options)
}

const KEYS_PROPS = ['altKey', 'ctrlKey', 'metaKey', 'shiftKey', 'bubbles', 'keyCode']
global.keySim = function(key, type, options) {
  options = options || {}
  var e = $.Event(type)
  e.key = key
  for (var kprop of KEYS_PROPS) {
    if ( undefined !== options[kprop] ) e[kprop] = options[kprop]
  }
  if ( e.keyCode ) e.which = e.keyCode
  var container = options.on || $(document)
  container.trigger(e);
}
