'use strict'
/**
  Méthodes concernant les events DOM
**/
module.exports = {
  onFocusTextField(e){
    /**
      // TODO Mettre les raccourcis pour textes
    **/
    delete window.onkeyup
    delete window.onkeydown
    this.markShortcuts.html('CHAMP SAISIE')
  }
, onBlurTextField(e){
    // e && stopEvent(e)
    window.onkeyup    = this.onKeyUpModeBancTimeline.bind(this)
    window.onkeydown  = this.onKeyDownModeBancTimeline.bind(this)
    this.markShortcuts.html('INTERFACE')
  }
}
