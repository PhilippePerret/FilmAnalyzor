'use strict'
/**
  Définition du sujet complexe FITReader
**/

class FITReaderSubject extends FITSubject {
constructor(name){
  super(name)
  this.sujet = 'Le Reader'
  this.assertions = {
    contains: this.contains.bind(this)
  }
}

// ---------------------------------------------------------------------
//  LES ASSERTIONS
/**
  Assertion qui vérifie que le reader contienne bien l'item +item+

  @param {Object} options
                    :shown    Si true, l'item doit être visible
**/
contains(item, options){
  let resultat = this.newResultat({
      verbe: 'contient'
    , objet: `${item}` // cf. son toString()
    , options: options
  })
  let jqRef   = `#reader #reader-${item.metaType||item.type}-${item.id}`

  // Toujours la condition principale en premier
  resultat.validIf(DOM.contains(jqRef))

  if ( resultat.valid && options && options.shown ) {
    resultat.validIf(DOM.displays(jqRef), "visible", "il n'est pas visible")
  }

  assert(resultat)
}

}

global.FITReader = new FITReaderSubject('Reader')
