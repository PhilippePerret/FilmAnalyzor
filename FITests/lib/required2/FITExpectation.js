'use strict'

/**
  Méthode principale d'expectation
  Pour définir le sujet.
**/
global.expect = function(){return new FITExpectation(...arguments)}

/**
  Méthode d'attente
**/
global.wait = function(wTime, wMsg){
  undefined === wMsg || console.log(wMsg)
  Tests.dureeWaits += wTime
  return new Promise(ok => {setTimeout(ok, wTime)})
}

global.FITExpectation = class {

/**
  C'est la méthode qui est appelée quand on fait `expect(<sujet>)`

  @param {FITSubject|Any} sujet   Le sujet de l'expectation, la valeur à tester,
                                  en général
**/
constructor(sujet, options){
  this.sujet = sujet

  // Pour garder toujours une trace du sujet original envoyé
  this.actual = sujet

  if ( 'string' === typeof options) {
    // C'est le titre seul qui a été donné en string
    this.options = {subject:options}
  } else {
    this.options = options || {}
  }

  this.value = undefined

  // Si le sujet est une classe héritante de FITSubject, on doit la
  // traiter de façon particulière
  // Sinon, on la transforme toujours en FITSubject pour pouvoir avoir
  // un traitement similaire pour tout le monde
  if (sujet && sujet.classe === 'FITSubject') {
    this.isFitSubject   = true
    this.fitSubject     = sujet // pour pouvoir définir 'positive'
    this.value = sujet.subject_value || sujet.value
    sujet.subject_message && ( this.subject = this.options.subject || sujet.subject_message )
    sujet.assertions      && Object.assign(this, sujet.assertions)
    sujet.options         && Object.assign(this.options, sujet.options)
    console.log("this.options:", this.options)
    // this.fitSubject.sujet = this.options.subject || sujet
  } else {
    this.fitSubject = new FITSubject('any')
    this.fitSubject.sujet = this.options.subject || sujet
    // Quand le sujet n'est pas un FITSubject original, il faut binder
    // les méthodes de FITSubject
    this.bindFITSubjectMethods()
  }

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

// // Le sujet du test (à écrire)
// get subject(){
//   return this.options.subject || this._subject || this.options.sujet || this.sujet
// }
// set subject(v){this._subject = v}

/**
  Pour ajouter des expectations générales propres à l'application
**/
static add(objet){
  Object.assign(FITExpectation.prototype, objet)
}

} // class FITExpectation
