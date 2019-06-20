'use strict'
/**
  Class FITResultat

  L'idée est de faire une classe qui permette de simplifier la composition
  des assertions.
  Par exemple, on a ajouté les variables `ajout` et `details` à des assertions
  avec options, par exemple la présence dans la Timeline avec une hauteur
  précise

  Dans l'idée, le FITResultat devrait pouvoir être envoyé comme premier
  et dernier argument de la méthode `assert`

**/
global.FITResultat = class {
/**
  Pour créer un nouveau résultat attendu
**/
constructor(owner, data){
  this.owner = owner
  this.badDetails = []
  this.bonDetails = []
  this.positive = owner.positive
  this.valide = true // par défaut, on part du principe que c'est bon
  // On dispatche les données
  for(var k in data){this[`_${k}`] = data[k]}
}

// Retourne true si le résultat (le test) est valide
get valid(){return this.isValid()}
get invalid(){return !this.isValid()}
isValid(){return this.valide === this.positive}

/**
  Si +bon+ et +bad+ ne sont pas définis, c'est qu'il s'agit de la condition
  principale, celle qui génèrera le message principal.
**/
validIf(condition, bon, bad){
  this.valide = this.valide && condition
  bon && this.bonDetails.push(bon)
  bad && this.badDetails.push(bad)
}

addBadDetail(str){
  this.badDetails.push(str)
}
addBonDetail(str){
  this.bonDetails.push(str)
}

// ---------------------------------------------------------------------
// Méthodes pour les messages
get sujet() { return this._sujet }
set sujet(v){ this._sujet = v}
get objet() { return this._objet }
set objet(v){ this._objet = v }
get verbe() { return this._verbe }
set verbe(v){ this._verbe = v }
get comp_verbe() {return this._comp_verbe}
set comp_verbe(v){ this._comp_verbe = v }
get options() { return this._options}
set options(v){ this._options = options}

// Pour détailler l'échec avec un message complet
get detailFailure(){return this._detailFailure}
set detailFailure(v){
  this._detailFailure = `\n\t\t${v.split("\n").join("\n\t\t")}`
}

get messages(){
  if (undefined === this._msgs){
    this._msgs = {success: null, failure: null}
    let [succ, fail] = this.assertise(this.sujet, this.verbe, this.comp_verbe, this.objet)
    this._msgs.success = succ
    if ( this.bonDetails.length ) {
      this._msgs.success += ` (${this.bonDetails.join(', ')})`
    }
    this._msgs.failure = fail
    if ( this.badDetails.length ) {
      this._msgs.failure += ` (MAIS ${this.badDetails.join(', ')})`
    }
    if ( this.detailFailure ) {
      this._msgs.failure += this.detailFailure
    }
  }
  return this._msgs
}


// Helper pour construire les paramètres de l'appel à `assert`
assertise(suj, verbe, complement_verbe, exp){
  const msgs = this.positivise(verbe, complement_verbe)
  if ( undefined === exp ) exp = '' // pour que 0 reste 0
  const temp = `${suj} %{msg} ${exp}`.trim()
  return [T(temp, {msg:msgs.success.trim()}), T(temp, {msg:msgs.failure.trim()})]
}
// Le message "est égal" ou "n'est pas égal", etc. en fonction de la positivité
// de l'expectation
/**
  @param {String} verbe   Le verbe de base
  @param {String} comp_verbe  Le complément du verbe, par exemple 'visible' pour
                              faire "est visible".
**/
positivise(verbe,comp_verbe){
  comp_verbe = comp_verbe || ''
  let sujet = this.options.ref ?` (${this.sujet}::${typeof(this.sujet)}) `:''
  switch (verbe) {
    case 'a':
      return {
          success: `${this.positive? 'a bien' : sujet + 'n’a pas'} ${comp_verbe}`
        , failure: `${this.positive? sujet + 'devrait avoir' : 'ne devrait pas avoir'} ${comp_verbe}`
      }
    case 'est':
      return {
          success: `${this.positive? 'est bien' : sujet + 'n’est pas'} ${comp_verbe}`
        , failure: `${this.positive? sujet + 'devrait être' : 'ne devrait pas être'} ${comp_verbe}`
      }
    case 'existe':
      return {
          success: `${this.positive?'existe bien':'n’existe pas'} ${comp_verbe}`
        , failure: `${this.positive?'devrait exister':'ne devrait pas exister'} ${comp_verbe}`
      }
    case 'contient':
      return {
          success: `${this.positive?'contient bien':'ne contient pas'} ${comp_verbe}`
        , failure: `${this.positive?'devrait contenir':'ne devrait pas contenir'} ${comp_verbe}`
      }
    case 'répond':
      return {
          success: `${this.positive?'répond bien':'ne répond pas'} ${comp_verbe}`
        , failure: `${this.positive?'devrait répondre':'ne devrait pas répondre'} ${comp_verbe}`
      }
    default:
      console.error(`Dans "positivise", les cas ne connaissent pas le verbe "${verbe}".`)
      return {
          success: 'PHRASE SUCCÈS INCONNUE'
        , failure: 'PHRASE ÉCHEC INCONNUE'
      }
  }
}


} // /class
