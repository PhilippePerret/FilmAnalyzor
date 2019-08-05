'use strict'

class FITFrontWindowSubject extends FITSubject {
// ---------------------------------------------------------------------
//  ASSERTIONS

/*
  @method expect(FrontFWindow).is(name, human_name, options)
  @description Produit un succès si la fenêtre au premier plan est bien la fenêtre de nom +name+.
  @provided
    :name {String} Nom (name) de la fenêtre
    :human_name {String} Nom humain de la fenêtre, pour les messages uniquement
    :options {Object} Les [options classiques des assertions](#options_assertions)
  @usage expect(FrontFWindow).is('CETTEFENÊTRE', "Ma fenêtre préférée", {onlyFailure:true})
 */
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
    if ( FWindow.current ) {
      current = FWindow.current
      // if ( current ) console.log("current.name / name", current.name, name)
      // else console.log("Pas de courante")
      pass = !!(current && current.name === name)
      if ( this.positive === pass ) break
    } else {
      this.pass = false
    }
    await wait(500)
  }
  resultat.validIf(pass === this.positive)
  return assert(resultat)
}

/*
  @method expect(FrontFWindow).is_event_form(options)
  @description Produit un succès si la fenêtre au premier plan est bien le formulaire d'édition des events.
  @provided
    :options {Object} Les [options classiques des assertions](#options_assertions)
 */
async is_event_form(options){
  options = options || {}
  if ( this.positive ) {
    options.success = "La fenêtre au premier plan est bien le formulaire d'édition des events."
    var hfencur = FWindow.current ? `C'est la fenêtre "${FWindow.current.name}"` : 'Il n’y a pas de fenêtre courante.'
    options.failure = `La fenêtre au premier plan devrait être le formulaire d'édition des events. ${hfencur}`
  } else {
    options.success = "La fenêtre au premier plan n'est pas ou plus le formulaire d'édition des events."
    options.failure = "La fenêtre au premier plan ne devrait pas être le formulaire d'édition des events."
  }
  await this.is('AEVENTFORM', 'le formulaire d’events', options)
}

/*
  @method expect(FrontFWindow).is_porte_documents(options)
  @description Produit un succès si la fenêtre au premier plan est bien le porte documents.
  @provided
    :options {Object} Les [options classiques des assertions](#options_assertions)
 */
async is_porte_documents(options){
  options = options || {}
  if ( this.positive ) {
    options.success = "La fenêtre au premier plan est bien le porte-documents."
    options.failure = `La fenêtre au premier plan devrait être le porte-documents. ${FWindow.current? FWindow.current.name + ' est la fenêtre au premier plan' : 'Pas de fenêtre au premier plan.'}.`
  } else {
    options.success = "La fenêtre au premier plan n'est pas ou plus le porte-documents."
    options.failure = "La fenêtre au premier plan ne devrait pas ou plus être le porte-documents."
  }
  await this.is('PORTEDOCUMENTS', 'le porte-documents', options)
}

//  /Assertions
// ---------------------------------------------------------------------
constructor(currentFWindow){
  super(currentFWindow && currentFWindow.name)
  this.current  = currentFWindow
  this.sujet    = "La FWindow courante"
  this.assertions = {
      is_event_form:        this.is_event_form.bind(this)
    , is_porte_documents:   this.is_porte_documents.bind(this)
  }
}

}

Object.defineProperties(global,{
  FrontFWindow:{get(){return new FITFrontWindowSubject(FWindow.current)}}
})
