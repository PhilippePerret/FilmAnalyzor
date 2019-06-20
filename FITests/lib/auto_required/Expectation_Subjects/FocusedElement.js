'use strict'
/**
  Class FITFocusedElementSubject
  -> FocusedElement
  Pour gérer l'élément courante et faire les tests dessus.
**/
class FITFocusedElement extends FITSubject {
constructor(){
  super('FocusedElement')
  this.element = document.activeElement
  this.sujet = `L'élément DOM courant (${this.element.outerHTML})`
  this.assertions = {
    is: this.is.bind(this)
  }
}

// ---------------------------------------------------------------------
//  ASSERTIONS

is(attrs, options){
  let resultat = this.newResultat({
        verbe:'a', comp_verbe:'un ID de'
      , options:options, objet:`#${JSON.stringify(attrs)}`
  })
  var all_attrs_ok = true
  for (var att in attrs ){
    if ( this.element.getAttribute(att) != attrs[att]){
      all_attrs_ok = false
      break
    }
  }
  resultat.validIf(all_attrs_ok)
  assert(resultat)
}

}

Object.defineProperties(global,{
  FocusedElement:{get(){return new FITFocusedElement()}}
})
