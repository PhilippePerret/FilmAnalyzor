'use strict'
/**
  Class FAUnknownElement
  ----------------------
  Classe spéciale permettant d'intercepter les éléments manquants, notamment
  lors des associations.

  C'est elle, notamment, qui est retournée par FAnalyse.instanceOfElement
  lorsque l'élément n'existe pas.

**/
class FAUnknownElement {
// ---------------------------------------------------------------------
//  CLASS

// ---------------------------------------------------------------------
//  INSTANCE
constructor(ref){
  this.id   = ref.id
  this.type = ref.type
}

as(format,flag,options){
  options = options || {}
  let div = DCreate(DIV,{class:'warning', inner:`&lt;&lt;&lt;ELEMENT INCONNU @type=${this.type} @id=${this.id}&gt;&gt;&gt;`})
  if(options.as === STRstring) return div.outerHTML
  return div
}

}// /class

module.exports = FAUnknownElement
