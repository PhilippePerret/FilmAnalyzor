'use strict'
/**
  Méthodes concernant les events DOM
**/
Object.assign(BancTimeline,{
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
    window.onkeyup    = this.onKeyUpOutTextField.bind(this)
    window.onkeydown  = this.onKeyDownOutTextField.bind(this)
    this.markShortcuts.html('INTERFACE')
  }
})
