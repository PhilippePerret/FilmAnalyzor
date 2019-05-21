'use strict'
/**
  Gestion des combinaisons de touches dans le mode Ban Timeline
**/

module.exports = {

/**
  Méthode principale qui reçoit les touches pressées (pas encore relevées)
**/
onKeyDownModeBancTimeline(e){
  console.log("Touche DOWN :", e.key)
  // On met la touche pressée dans une variable pour pouvoir la
  // modifier plus tard.
  var touche = e.key

  switch (touche) {
    case STRm:
      if(e.metaKey){
        log.info('CMD-m:create new marker')
        F.notify("TODO: Je dois créer un nouveau marqueur.")
        return stopEvent(e)
      } else if (e.altKey){
        log.info('ALT-M:go to previous marker')
        F.notify("TODO: Je dois passer en revue les marqueurs en sens inverse.")
      }
      break
    case STRArrowLeft:
      if(e.metaKey && e.shiftKey){
        // `META SHIFT <-` => === DÉBUT DU FILM ===
        log.info('Meta+Maj+<-:go to start of the film or zero')
        this.a.locator.goToFilmStartOrZero()
        return stopEvent(e)
      } else if (e.metaKey) {
        // META+FLECHE-GAUCHE ===> SCÈNE PRÉCÉDENTE <===
        log.info('Meta+<-:go to previous scene')
        this.a.locator.goToPrevScene()
        return stopEvent(e)
      }
      break
    case STRArrowRight:
      if(e.metaKey && e.shiftKey){
        // `META SHFT ->` => FIN DU FILM
        log.info('Meta+Maj+->:go to end of the film or video')
        this.a.locator.goToFilmEndOrEnd()
        return stopEvent(e)
      } else if (e.metaKey) {
        // META+FLÈCHE-DROITE ===> SCÈNE SUIVANTE <===
        log.info('Meta+->:go to next scene')
        this.a.locator.goToNextScene()
        return stopEvent(e)
      }
      break
    default:

  }
}


}
