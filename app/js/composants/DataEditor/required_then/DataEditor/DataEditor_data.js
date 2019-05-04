'use strict'

Object.assign(DataEditor.prototype,{

  checkUnicite(field){
    let val   = field.value
      , prop  = field.prop
      , idx_current = this.currentItemIndex // pour ne pas le considérer

    var elWithSameProp = undefined
    this.forEachElement(el => {
      if(el.DEditorIndex == idx_current) return
      if(el[prop] == val){
        elWithSameProp = el
        return false // pour arrêter
      }
    })
    return elWithSameProp
  }
})
Object.defineProperties(DataEditor,{

})
