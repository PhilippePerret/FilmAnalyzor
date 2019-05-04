'use strict'

const APPFOLDER = path.resolve('.')

function WhenAllIsReallyReady(){
  // DataEditor.toggle()
  FAPersonnage.dataEditor.open()
  // DataEditor.edit({mainClass:FAPersonnage, items:(FAPersonnage.personnages||[]), current: 'personnage2', titleProp:'pseudo'})
}

$(document).ready(() => {
  log.info("--- DOM ready ---")
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

  // SI ON VEUT VRAIMENT JOUER DU CODE TOUT À LA FIN, UTILISER
  // LA MÉTHODE `WhenAllIsReallyReady` ci-dessus
})
