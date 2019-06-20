'use strict'

class FITFrontWindowSubject extends FITSubject {
constructor(currentFWindow){
  super(currentFWindow && currentFWindow.name)
  this.current  = currentFWindow
  this.sujet    = "La FWindow courante"
  this.assertions = {
      is_event_form:        this.is_event_form.bind(this)
    , is_porte_documents:   this.is_porte_documents.bind(this)
  }
}

// ---------------------------------------------------------------------
//  ASSERTIONS
is(name, human_name, options){
  // console.log("-> is", name, human_name, options)
  let resultat = this.newResultat({
      verbe:    'est'
    , objet:    human_name
    , options:  options
  })
  resultat.validIf(!!(this.current && this.current.name === name))
  assert(resultat)
}

is_event_form(options){
  return this.is('AEVENTFORM', 'le formulaire d’events', options)
}

is_porte_documents(options){
  return this.is('PORTEDOCUMENTS', 'le porte-documents', options)
}

}

Object.defineProperties(global,{
  FrontFWindow:{get(){return new FITFrontWindowSubject(FWindow.current)}}
})
