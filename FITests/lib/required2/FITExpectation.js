'use strict'

/**
  Méthode principale d'expectation
  Pour définir le sujet.
**/
global.expect = function(){return new FITExpectation(...arguments)}


global.FITExpectation = class {

/**
  C'est la méthode qui est appelée quand on fait `expect(<sujet>)`

  @param {FITSubject|Any} sujet   Le sujet de l'expectation, la valeur à tester,
                                  en général
**/
constructor(sujval, options){

  // Au début, on part du principe que la valeur actuelle et le sujet affiché
  // sont identiques et fournis en premier. C'est le cas par exemple pour un
  // nombre
  this.sujet        = sujval
  this.actualValue  = sujval

  if ( 'string' === typeof options) {
    // Si le second argument est un string, c'est le sujet humain seul
    this.options = {sujet:options}
  } else {
    this.options = options || {}
  }

  // console.log("this.options:", this.options)

  // Si l'argument est une classe héritante de FITSubject, on doit la
  // traiter de façon particulière
  // Sinon, on la transforme toujours en FITSubject pour pouvoir avoir
  // un traitement similaire pour tout le monde
  if (sujval && sujval.classe === 'FITSubject') {
    this.isFitSubject   = true
    this.fitSubject     = sujval // pour pouvoir définir 'positive'
    this.actualValue    = sujval.actualValue
    Object.assign(this, sujval.assertions || {})
    Object.assign(this.options, sujval.options || {})
  } else {
    this.fitSubject = new FITSubject('any')
    this.fitSubject.sujet = this.options.sujet || sujval
    // Quand le sujet n'est pas un FITSubject original, il faut binder
    // les méthodes de FITSubject
    this.bindFITSubjectMethods()
  }

  this.fitSubject.sujet     = this.options.sujet || sujval
  this.fitSubject.positive  = true
  this.fitSubject.strict    = false

}
// ---------------------------------------------------------------------
//  Sujet

// Inverseur
get not() {
  // this.positive = false
  this.fitSubject.positive = false
  return this // pour le chainage
}
// Mode strict
get strictly() {
  this.fitSubject.strict = true
  return this // chainage
}

// ---------------------------------------------------------------------
//  Méthodes correspondant à FITSubject, lorsque le sujet fourni n'en
// est pas un
bindFITSubjectMethods(){
  this.newResultat = this.fitSubject.newResultat.bind(this.fitSubject)
}

/**
  Pour ajouter des expectations générales propres à l'application
**/
static add(objet){
  Object.assign(FITExpectation.prototype, objet)
}

} // class FITExpectation
