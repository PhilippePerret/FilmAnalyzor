'use strict'
/**
  Méthodes concernant les events DOM
**/
module.exports = {

observeModeBanTimeline(){

    // La tape d'échelle (bande métrée) est sensible au clic pour se
    // déplacer dans le film
    this.scaleTape.on(STRclick, this.onClickScaleTape.bind(this))

    // On rend tous les éléments sensible au clic pour les éditer
    this.timelineTape.find('.bantime-element').on(STRclick, this.onClickElement.bind(this))

    // Dans le mode ban timeline, toutes les touches forment des combinaisons
    // clavier, tant qu'on n'est pas dans un champ de texte.
    window.onkeyup    = this.onKeyUpModeBanTimeline.bind(this)
    window.onkeydown  = this.onKeyDownModeBanTimeline.bind(this)
  }

}
