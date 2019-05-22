'use strict'
/**
  Méthodes concernant les events DOM
**/
Object.assign(BancTimeline,{
  onFocusTextField(e){
    UI.toggleKeyUpAndDown(/* out-text-field = */ false)
  }
, onBlurTextField(e){
    // e && stopEvent(e)
    UI.toggleKeyUpAndDown(/* out-text-field = */ true)
  }

})
