'use strict'
/**
  Gestion des combinaisons de touches dans le mode Ban Timeline
**/

module.exports = {

/**
  Méthode principale qui reçoit les touches
**/
onKeyUpModeBanTimeline(e){
  console.log("Touche pressée :", e.key)
  switch (e.key) {
    case STRk:
    case STRj:
    case STRl:
      let loc = this.a.locator
        , vid = this.a.videoController
      if (e.key === STRj) { // meta + j => rewind or accelerate
        loc.playing && loc.togglePlay()
        loc.rewind(1.0)
      } else if(e.key === STRk){ // meta + k => stop
        loc.playing && loc.stop()
        vid.setSpeed(1.0)
      } else if(e.key === STRl){ // meta + l => start or accelerate
        // Si la vidéo est déjà en train de jouer, on l'accélère
        // Si la vidéo n'est pas en train de jouer, on la démarre
        loc.playing ? vid.setSpeed(vid.getSpeed() + 0.5) : loc.togglePlay()
      }
      return stopEvent(e)

    // La touche "z" permet de ZOOMER/DÉZOOMER
    case STRz:
      this.UI.zoom();break
    case 'Â':
      this.UI.dezoom();break
    default:

  }
}


}
