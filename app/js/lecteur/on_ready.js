'use strict'

const APPFOLDER = path.resolve('.')


$(document).ready(() => {
  log.info("DOM ready")
  console.clear()

  var d = ipc.sendSync('get-screen-dimensions')
  ScreenWidth   = d.width
  ScreenHeight  = d.height

  window.onkeydown  = KeyUpAndDown.commonKeyDown
  window.onkeyup    = KeyUpAndDown.commonKeyUp

  // ATTENTION : QUAND ON PASSE ICI, TOUT N'EST
  // PAS ENCORE CHARGÉ CAR CERTAINS MODULES  SONT
  // CHARGÉS DE FAÇON DYNAMIQUE. C'EST LA MÉTHODE
  // `App.onReady` QUI DÉTERMINE VRAIMENT LA FIN
  // DU CHARGEMENT DE L'APPLICATION ET LE DÉMARRAGE

})
