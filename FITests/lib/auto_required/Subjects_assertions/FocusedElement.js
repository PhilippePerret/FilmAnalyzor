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

is(expectedAttrs, options){
  let resultat = this.newResultat({
        verbe:'a', comp_verbe:'un ID de'
      , options:options, objet:`#${JSON.stringify(expectedAttrs)}`
  })
  var all_expectedAttrs_ok = true
  for (var att in expectedAttrs ){
    if ( this.element.getAttribute(att) != expectedAttrs[att]){
      all_expectedAttrs_ok = false
      break
    }
  }
  resultat.validIf(all_expectedAttrs_ok)
  assert(resultat)
}

}

Object.defineProperties(global,{
  FocusedElement:{get(){return new FITFocusedElement()}}
})
