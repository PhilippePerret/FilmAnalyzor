'use strict'
/**
  Méthode qui retourne les récompenses formatées
**/
module.exports = function(){
  let my = this

  return DCreate(SECTION,{id:'recompenses', append:[
      DCreate(H3, {inner:'Principales récompenses obtenues'})
    , DCreate(DIV, {inner:"[ICI LE DÉTAIL DES RÉCOMPENSES]"})
    ]}).outerHTML
}
