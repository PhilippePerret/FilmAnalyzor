'use strict'
/**
  Sujet complexe pour le traitement des éléments DOM
**/

class d_Subject extends FITSubject {

// ---------------------------------------------------------------------
//  ASSERTIONS

async exists(options){
  this.checkValiditySujet()
  let resultat = this.newResultat({
      verbe:'existe', objet: 'dans le DOM'
    , options:options
  })
  const pass = await DOM.exists(this.actual)
  resultat.validIf(pass)
  return assert(resultat)
}

is_visible(options){

}

contains(expected, options){

}

//  / ASSERTIONS
// ---------------------------------------------------------------------

constructor(suj){
  super('d Subject')
  this.initialSujet = this.sujet = suj
  this.invalidSujet = false
  this.actual = this.getActualFromSujet(suj)
  this.invalidSujet || (this.sujet = this.getShortSujetFrom(this.actual))
  // console.log("this.sujet = ", this.sujet)
  Object.assign(this.assertions,{
      exists:     this.exists.bind(this)
    , is_visible: this.is_visible.bind(this)
    , contains:   this.contains.bind(this)
  })
}

/**
  Retourne false si le sujet fourni est invalide
**/
checkValiditySujet(){
  if ( this.invalidSujet ){
    this.sujet = this.sujet || this.initialSujet
    throw new Error('not-a-domisable')
  }
  else return true
}
/**
  Retourne l'élément DOM en fonction du sujet +suj+ fourni à l'instanciation
  @return {DOMElement} L'élément DOM (existant ou non)
**/
getActualFromSujet(suj){
  if ( ! suj ) {
    this.invalidSujet = true
    return null
  } else if ( 'string' === suj ) {
    return document.querySelector(suj)
  } else if ( suj instanceof HTMLElement ) {
    // <= C'est un HTMLElement
    // => on le renvoie tel quel
    return suj
  } else if ( undefined !== suj.length && 'string' !== typeof(suj) && !Array.isArray(suj)) {
    // <= l'élément est un objet jQuery puisqu'il possède une propriété length
    // => Il faut renvoyer son premier élément (ou null)
    return suj[0] || null
  } else {
    // <= Ce n'est pas un élément valide
    // => On le marque juste invalide, ça sera signalé seulement au check
    //    pour que les tests puissent vérifier sans complication.
    this.invalidSujet = true
    return null
  }
}

/**
  Retourne le titre pour l'affichage
**/
getShortSujetFrom(domel){
  if ( ! domel /* pas encore dans le dom */) return this.initialSujet
  // console.log("domel:", domel)
  var out = domel.outerHTML
  if ( ! out /* pour $(document) par exemple */ ){
    domel = this.initialSujet.find('html')[0]
  }
  var tit = domel.outerHTML.replace(/[\n\r]/g,' ').replace(/[ \t][ \t]+/g,' ')
  var len = tit.length
  if ( len > 100 ) {
    tit = tit.substring(0,25) + ' […] ' + tit.substring(len-25,len)
  }
  // console.log("tit = ", tit)
  return tit
}

}

global.d = function(suj) { return new d_Subject(suj) }
