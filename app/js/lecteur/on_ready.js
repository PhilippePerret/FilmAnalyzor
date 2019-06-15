'use strict'

const APPFOLDER = path.resolve('.')

window.onCancelMe = function(){
  F.notify("Je cancel le truc")
}
window.onOKMe = function(){F.notify("OK ? Tu as fait OK ?…")}

function WhenAllIsReallyReady(){

  App.runtests()

  // confirm("Voulez-vous vraiment tout casser ?", {type: 'confirm',
  //     defaultButtonIndex:1
  //   , okButtonIndex:1
  //   , cancelButtonIndex:0
  //   , methodOnCancel: window.onCancelMe.bind(window)
  //   , methodOnOK: window.onOKMe.bind(window)
  // })
  // FAPersonnage.dataEditor.open()
  // FABrin.dataEditor.open()
  // current_analyse.openDocInDataEditor('fondamentales')
  // current_analyse.openDocInDataEditor('infos')
  // current_analyse.editDocumentInPorteDocuments('building_script')
  // current_analyse.editDocumentInPorteDocuments()
  // current_analyse.togglePanneauDecors()
  // current_analyse.togglePanneauBrins()
  // setTimeout(current_analyse.togglePanneauBrins.bind(current_analyse),1000)
  // current_analyse.togglePanneauImages()
  // current_analyse.togglePanneauPersonnages()

  // // Pour afficher le premier paradigme de Field
  // current_analyse.displayPFA(1)

  // // Construire l'analyse
  // current_analyse.displayFullAnalyse(/*forcer update = */true)

  // Afficher la liste des markers
  // current_analyse.markers.showListing()
}

$(document).ready(() => {
  // Mais ici on n'est pas encore prêt, des dossiers sont toujours en
  // chargement
  // Par exemple, ici, UI n'est pas défini, encore

  log.info("--- DOM ready ---")
  // console.clear()

  // var d = ipc.sendSync('get-screen-dimensions')
  // window.W = ScreenWidth  = d.width
  // window.H = ScreenHeight = d.height

  // ATTENTION : QUAND ON PASSE ICI, TOUT N'EST
  // PAS ENCORE CHARGÉ CAR CERTAINS MODULES  SONT
  // CHARGÉS DE FAÇON DYNAMIQUE. C'EST LA MÉTHODE
  // `App.onReady` QUI DÉTERMINE VRAIMENT LA FIN
  // DU CHARGEMENT DE L'APPLICATION ET LE DÉMARRAGE

  // SI ON VEUT VRAIMENT JOUER DU CODE TOUT À LA FIN, UTILISER
  // LA MÉTHODE `WhenAllIsReallyReady` ci-dessus
  // ET ENCORE… IL SE PASSE DES CHOSES APRÈS
})
