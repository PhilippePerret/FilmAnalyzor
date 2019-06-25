'use strict'

const levenshtein = require('js-levenshtein')

class t_Subject extends FITSubject {
// ---------------------------------------------------------------------
//  ASSERTIONS

/*
  @method expect(t(string)).is(expected, options)
  @description Produit un succès si +expected+ est égal strictement au sujet string [t(string)](#t_subject)
  @provided
    :expected {String} La chaine à comparer au sujet
    :options {Object} Les [options classiques des assertions](#options_assertions)
  @usage expect(t("ma chaine")).is("ma chaine") => produit un succès
 */
/*
  @method expect(t(string)).equals
  @description alias de `is`
 */
is(expected, options){
  this.checkValiditySujet()
  let resultat = this.newResultat({
    verbe: 'est', comp_verbe:'égal à', objet: `« ${expected} »`
    , options:options
  })
  if ( 'string' === typeof expected ){
    resultat.validIf(this.actualValue === expected)
    return assert(resultat)
  } else {
    resultat.detailFailure = `Un string doit être fourni à la méthode "is".`
    resultat.validIf(!this.positive)
    return assert(resultat)
  }
}

/*
  @method expect(t(...)).is_close_to(closedValue, options)
  @description Produit un succès si le sujet string [t(...)](#t_subject) est proche de +closeValue+. La proximité est calculée par rapport aux nombres de lettres en commun, dans le même ordre, ou la réduction des accentués et diacritiques en leur valeur simple. Et suppression des ponctuations.
  @provided
    :closedValue {String} La valeur à comparer
    :options {Object} Les [options classiques des assertions](#options_assertions).
  @usage expect(t('chaîne')).is_close_to('chaine');expect(t('chaine !')).is_close_to('chaine') //=> produisent des succès
 */
is_close_to(compValue, options){
  this.checkValiditySujet()
  let resultat = this.newResultat({
      verbe:'est', comp_verbe:'proche de', objet:`« ${compValue} »`
    , options:options
  })
  var pass
  if ( 'string' === typeof(compValue) ){
    if ( this.actualValue === compValue ) {
      pass = true
    } else if ( this.actualValue.toLowerCase() === compValue.toLowerCase() ){
      pass = true
    } else {
      var res = String.ressemblance(this.actualValue, compValue)
      pass = res < 25
      // console.log("levenshtein:", levenshtein(this.actualValue, compValue))
      // var arr = [
      //   ['string','string'], ['string','STRING'], ['string','String'],
      //   ['string !', 'string'], ['ça', 'ca'], ['leçonnement','leconnement'],
      //   ['quoi ???', 'quoi'], ['évènement', 'evenement'],
      //   ['mot', 'tom'], ['camembert','bacemmert'],
      //   ['chienne', 'chien']
      // ]
      // for (var paire of arr ){
      //   console.log(`levenshtein('${paire[0]}','${paire[1]}')" = `, levenshtein(paire[0],paire[1]))
      //   console.log(`String.levenshtein('${paire[0]}','${paire[1]}')" = `, String.levenshtein(paire[0],paire[1]))
      //   console.log(`String.smartLevenshtein('${paire[0]}','${paire[1]}')" = `, String.smartLevenshtein(paire[0],paire[1]))
      //   console.log(`String.ressemblance('${paire[0]}','${paire[1]}')" = `, String.ressemblance(paire[0],paire[1]))
      // }
    }
  } else {
    resultat.detailFailure = `La valeur à comparer doit être un string, c'est un ${typeof compValue}`
    pass = !this.positive
  }
  resultat.validIf(pass)
  return assert(resultat)
}

/*
  @method expect(t(string)).contains(expected,options)
  @description Produit un succès si le sujet [f(string)](#f_subject) contient +expected+.
  @provided
    :expected {String} La chaine à trouver.
    :expected {RegExp} Expression régulière pour trouver la chaine.
    :options {Object} [Options classiques des assertions](#options_assertions) + :strict pour indiquer que la comparaison doit être strict, donc sensible à la casse.
  @usage expect(t('string')).contains('str');expect(t('string')).contains(/str.ng/);// => produisent des succès
 */
contains(expected, options){
  var pass
  this.checkValiditySujet()
  let resultat = this.newResultat({
    verbe:'contient', options:options
  })
  const mode = options && options.strict ? ' (mode strict)' : ''

  if ( 'string' === typeof(expected) ){
    resultat.objet = `« ${expected} »${mode}`
    if ( options && options.strict ) {
      pass = this.actualValue.includes(expected)
    } else {
      pass = this.actualValue.toLowerCase().includes(expected.toLowerCase())
    }
  } else if ( expected instanceof(RegExp) ){
    resultat.objet = `${expected}${mode}`
    if ( options && options.strict ) {
      pass = null != this.actualValue.match(expected)
    } else {
      // console.log("new RegExp(expected,'i')", new RegExp(expected,'i'))
      pass = null != this.actualValue.match(new RegExp(expected,'i'))
      // console.log("pass = ", pass)
    }
  } else {
    resultat.objet = `${expected}`
    pass = false
    resultat.detailFailure = `Mauvais type pour contains. Attendu : String ou RegExp, reçu : ${typeof(expected)}.`
  }

  resultat.validIf(pass)
  return assert(resultat)
}

/*
  @method expect(t(...)).is_empty(options)
  @description Produit un succès si le sujet string [t(...)](#t_subject) est vide.
  @provided
    :options {Object} Les [options classiques des assertions](#options_assertions)
  @usage expect(t("mon texte")).is_empty() // => produit un échec
 */
is_empty(options){
  this.checkValiditySujet()
  let resultat = this.newResultat({
    verbe:'est', comp_verbe:'vide', options:options
  })
  resultat.validIf(this.actualValue.trim().length === 0)
  return assert(resultat)
}

// /Assertions
// ---------------------------------------------------------------------
constructor(string, hsujet){
  super(string)
  this.options = {}
  this.options.sujet = hsujet || `t("${string}")`
  this.actualValue = string
  Object.assign(this.assertions,{
      is:     this.is.bind(this)
    , equals: this.is.bind(this)
    , is_close_to: this.is_close_to.bind(this)
    , contains: this.contains.bind(this)
    , is_empty: this.is_empty.bind(this)
  })
}


checkValiditySujet(){
  if ( 'string' === typeof this.actualValue ){
    return true
  } else {
    throw new Error('not-a-string')
  }
}
}

/*
  @method t(...)
  @description Sujet complexe pour tester les strings/textes
  @id t_subject
 */
if ( global.t ){
  throw new Error("La variable global `t` ne doit pas exister, elle est réservée aux FITests. Mettez toujours vos variables et fonctions dans des espaces de nom définis.")
} else {
  global.t = function(string, hsujet){
    return new t_Subject(string, hsujet)
  }
}
