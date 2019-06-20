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

async is(name, human_name, options){
  options = options || {}
  // console.log("-> is", name, human_name, options)
  let resultat = this.newResultat({
      verbe:    'est'
    , objet:    human_name
    , options:  options
  })
  var pass
    , xtimes = options.xtimes || 8
    , current
  while ( xtimes -- ){
    current = FWindow.current
    // if ( current ) console.log("current.name / name", current.name, name)
    // else console.log("Pas de courante")
    pass = !!(current && current.name === name)
    if ( this.positive === pass ) break
    await wait(500)
  }
  resultat.validIf(pass)
  return assert(resultat)
}

async is_event_form(options){
  await this.is('AEVENTFORM', 'le formulaire d’events', options)
}

async is_porte_documents(options){
  await this.is('PORTEDOCUMENTS', 'le porte-documents', options)
}

}

Object.defineProperties(global,{
  FrontFWindow:{get(){return new FITFrontWindowSubject(FWindow.current)}}
})
