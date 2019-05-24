'use strict'
/**
  Gestion des combinaisons de touches dans le mode Ban Timeline
**/

Object.assign(UI,{

/**
  Méthode principale qui reçoit les touches quand on est dans un champ
  de saisie.
**/
onKeyUpInTextField(e){
    return true // TODO à implémenter
  }

/**
  Méthode principale qui reçoit les touches quand on est hors d'un champ
  de saisie
**/
, onKeyUpOutTextField(e){
    console.log("Touche pressée :", e.key)
    // On met la touche pressée dans une variable pour pouvoir la
    // modifier plus tard.
    var touche = e.key

    switch (touche) {
      case STREscape: // Escape
        if (FWindow.closeCurrent()){
          return stopEvent(e)
        } else return true
      case STRm: // m
        log.info('m:go to next marker')
        F.notify("TODO: Je dois aller au marqueur suivant.")
        break
      case STRM: // M
        log.info('M:show markers list')
        F.notify("TODO: Je dois afficher la liste des marqueurs.")
        break
      case ' ':
        touche = this.a.locator.playing ? STRk : STRl
        console.log("touche modifiée: ", touche)
      case STRk: // k
      case STRj: // j
      case STRl: // l
        let loc = this.a.locator
          , vid = this.a.videoController
        if (touche === STRj) { // meta + j => rewind or accelerate
          loc.playing && loc.togglePlay()
          loc.rewind(1.0)
        } else if(touche === STRk){ // meta + k => stop
          loc.playing && loc.stop()
          vid.setSpeed(1.0)
        } else if(touche === STRl){ // meta + l => start or accelerate
          // Si la vidéo est déjà en train de jouer, on l'accélère
          // Si la vidéo n'est pas en train de jouer, on la démarre
          loc.playing ? vid.setSpeed(vid.getSpeed() + 0.5) : loc.togglePlay()
        }
        return stopEvent(e)

      // La touche "z" permet de ZOOMER/DÉZOOMER
      case STRz:
        this.UI.zoom();break
      case STRZ:
        this.UI.zoom(10); break
      case 'Â':
        this.UI.dezoom();break
      case 'Å': // alt-maj-z
        this.UI.dezoom(10);break
      case 'Escape':
        /**
          // TODO Close current fwindow
        **/
        break
      default:

    }
  }


})
