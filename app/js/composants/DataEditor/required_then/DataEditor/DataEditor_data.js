'use strict'

Object.assign(DataEditor.prototype,{

/**
  Méthode qui retourne true si le champ +field+ ne contient pas une
  valeur unique.
**/
  isNotUniq(field){
    let val   = field.fieldValue
      , prop  = field.prop
      , idx_current = this.currentItemIndex // pour ne pas le considérer

    // console.log("Index item courant :", idx_current)
    var elWithSameProp = false
    this.forEachElement(el => {
      if(el.DEditorIndex == idx_current) return
      if(el[prop] == val){
        elWithSameProp = el
        return false // pour arrêter la boucle
      }
    })
    return elWithSameProp
  }
})
