'use strict'

/*
  @method keyPress(key, options)
  @description  Simule une touche pressée (down et up)
  @provided
    :key  {String} La touche à presser, par exemple "k"
    :options {Objet} Table des options, pour indiquer les modificateurs et la cible, avec `metaKey:true`, `shiftKey:true`, etc. :on permet aussi d'indiquer sur quel DOMElement il faut trigger la touche.
  @usage keyPress('c', {shiftKey:true, metaKey:true, on:'div#mondiv'})
 */
global.keyPress = function(key, options){
  keyDown(key,options);
  keyUp(key,options);
}
/*
  @method keyDown(key, options)
  @description Pour simuler une touche pressée (mais pas relevée)
  @provided
    :key {String} La touche pressée, par exemple 'c'
    :options {Object} Table des options, pour indiquer les modificateurs et la cible, avec `metaKey:true`, `shiftKey:true`, etc. :on permet aussi d'indiquer sur quel DOMElement il faut trigger la touche.
  @usage keyDown('s', {altKey:true})
*/
global.keyDown = function(key, options){
  keySim(key, 'keydown', options)
}
/*
  @method keyUp(key, options)
  @description Pour simuler une touche relevée (après avoir été pressée)
  @provided
    :key {String} La touche relevée, par exemple 'c'
    :options {Object} Table des options, pour indiquer les modificateurs et la cible, avec `metaKey:true`, `shiftKey:true`, etc. :on permet aussi d'indiquer sur quel DOMElement il faut trigger la touche.
  @usage keyDown('s', {altKey:true})
*/
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
  if ( options.on ) options.on = $(options.on)
  var container = options.on || $(document)
  container.trigger(e);
}
