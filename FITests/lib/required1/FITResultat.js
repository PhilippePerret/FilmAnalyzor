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

get messages(){
  if (undefined === this._msgs){
    this._msgs = {success: null, failure: null}
    let [succ, fail] = this.owner.assertise(this.sujet, this.verbe, this.comp_verbe, this.objet)
    if ( this.bonDetails.length ) {
      this._msgs.success = `${succ} (${this.bonDetails.join(', ')})`
    }
    if ( this.badDetails.length ) {
      this._msgs.failure = `${fail} (MAIS ${this.badDetails.join(', ')})`
    }
  }
  return this._msgs
}
get shortSuccessMessage(){

}
get shortFailureMessage(){

}
get fullSuccessMessage(){

}
get fullFailureMessage(){
}

} // /class
