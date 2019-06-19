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
constructor(sujet, options){
  this.sujet = sujet

  if ( 'string' === typeof options) {
    // C'est le titre seul qui a été donné
    this.options = {subject:options}
  } else {
    this.options = options || {}
  }

  this.value    = undefined

  // if (sujet instanceof FITSubject) {
  if (sujet && sujet.classe === 'FITSubject') {
    this.value = sujet.subject_value || sujet.value
    sujet.subject_message && ( this.subject = sujet.subject_message )
    sujet.assertions      && Object.assign(this, sujet.assertions)
    sujet.options         && Object.assign(this.options, sujet.options)
  }

  this.positive = true
  this.strict   = false
}
// ---------------------------------------------------------------------
//  Sujet

// Inverseur
get not() {
  this.positive = false
  return this // pour le chainage
}
// Mode strict
get strictly() {
  this.strict = true
  return this // chainage
}
// Le sujet du test (à écrire)
get subject(){
  return this.options.subject || this._subject || this.options.sujet || this.sujet
}
set subject(v){this._subject = v}

// Helper pour construire les paramètres de l'appel à `assert`
assertise(suj, verbe, complement_verbe, exp){
  const msgs = this.positivise(verbe, complement_verbe)
  const temp = `${suj} %{msg} ${exp||''}`.trim()
  return [T(temp, {msg:msgs.success}), T(temp, {msg:msgs.failure})]
}
// Le message "est égal" ou "n'est pas égal", etc. en fonction de la positivité
// de l'expectation
positivise(what,state){
  let sujet = this.options.noRef ? '' : ` (${this.sujet}::${typeof(this.sujet)}) `
  switch (what) {
    case 'est':
      return {
          success: `${this.positive? 'est bien' : sujet + 'n’est pas'} ${state}`
        , failure: `${this.positive? sujet + 'devrait être' : 'ne devrait pas être'} ${state}`
      }
    case 'existe':
      return {
          success: `${this.positive?'existe bien':'n’existe pas'} ${state}`
        , failure: `${this.positive?'devrait exister':'ne devrait pas exister'} ${state}`
      }
    case 'contient':
      return {
          success: `${this.positive?'contient bien':'ne contient pas'} ${state}`
        , failure: `${this.positive?'devrait contenir':'ne devrait pas contenir'} ${state}`
      }
    default:
      console.error(`Dans "positivise", les cas ne connaissent pas le verbe "${what}".`)
      return {
          success: 'PHRASE SUCCÈS INCONNUE'
        , failure: 'PHRASE ÉCHEC INCONNUE'
      }
  }
}

/**
  Pour ajouter des expectations générales propres à l'application
**/
static add(objet){
  Object.assign(FITExpectation.prototype, objet)
}

} // class FITExpectation