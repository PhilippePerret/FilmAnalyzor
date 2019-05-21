'use strict'

const APPFOLDER = path.resolve('.')

function WhenAllIsReallyReady(){

  $('#section-reader').append(DCreate(SECTION,{id:"try", style:'width:100px;height:100px;background-color:blue;'}))
  var d = $('#try')
  d.draggable()
  d.resizable()

  // FAPersonnage.dataEditor.open()
  // FABrin.dataEditor.open()
  // current_analyse.openDocInDataEditor('fondamentales')
  // current_analyse.openDocInDataEditor('infos')
  // current_analyse.openDocInWriter('building_script')
  // current_analyse.togglePanneauDecors()
  // current_analyse.togglePanneauBrins()
  // setTimeout(current_analyse.togglePanneauBrins.bind(current_analyse),1000)
  // current_analyse.togglePanneauImages()
  // current_analyse.togglePanneauPersonnages()

  // // Construire l'analyse
  // current_analyse.displayFullAnalyse(/*forcer update = */true)
}

$(document).ready(() => {
  log.info("--- DOM ready ---")
  // console.clear()

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
