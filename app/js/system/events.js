'use strict'
/**
 * Tout un tas de choses concernant les events (système, pas de l'analyse)
 */
function stopEvent(e){
  e.stopPropagation()
  e.preventDefault()
  return false
}

const KTAB          = 9   // keycode
const KENTER  = 13 // keyCode
const KENTREE = 13 // keyCode
const KRETURN = 13 // keyCode
const KERASE        = 8   // keyCode
const KESCAPE       = 27  // touche escape
const KSPACE        = 10

const K_S           = 83  //
const K_OCROCHET    = 53  // MAIS AVEC altKey
const K_GUIL_DROIT  = 51

const ARROW_LEFT    = 37
const ARROW_UP      = 38
const ARROW_RIGHT   = 39
const ARROW_DOWN    = 40
