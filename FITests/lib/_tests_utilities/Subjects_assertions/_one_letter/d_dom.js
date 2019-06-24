'use strict'
/**
  Sujet complexe pour le traitement des éléments DOM
**/

class d_Subject extends FITSubject {
// ---------------------------------------------------------------------
//  ASSERTIONS
/*
  @method expect(d(...)).exists(options)
  @description Produit un succès si le DOM contient l'élément sujet [`d(...)`](#d_subject)
  @provided
    :options {Object} [Options classiques des assertions](#options_assertions)
  @usage await expect(d('#monDiv')).exists({onlyFailure:"Il devrait exister !"})
 */
async exists(options){
  this.checkValiditySujet()
  let resultat = this.newResultat({
      verbe:'existe', objet: 'dans le DOM'
    , options:options
  })
  const pass = await DOM.exists(this.actualValue)
  resultat.validIf(pass)
  return assert(resultat)
}

/*
  @method expect(d(...)).is_visible(options)
  @description Produit un succès lorsque l'élément DOM sujet [`d(...)`](#d_subject) existe et est visible.
  @provided
    :options {Object} [Options classiques des assertions](#options_assertions)
  @usage await expect(d('#monDiv')).is_visible({onlyReturn:true})
 */
async is_visible(options){
  this.checkValiditySujet()
  let resultat = this.newResultat({
      verbe:'est', objet: 'visible dans le DOM'
    , options:options
  })
  const pass = await DOM.exists(this.actualValue, {positive: this.positive})
  if ( !pass && !this.positive ) {
    // C'est un succès puisque l'élément n'existe pas dans le DOM
    // Rien à faire d'autre
  } else if ( pass && !this.positive ) {
    pass = DOM.displays(this.actualValue)
  }
  resultat.validIf(pass)
  return assert(resultat)
}

/*
  @method expect(d(...)).contains(expected, options)
  @description Produit un succès ou retourne `true` si le sujet DOM [`d(...)`](#d_subject) contient l'élément +expected+.
  @provided
    :expected {String} Sélecteur de l'élément à trouver dans le sujet
    :expected {DOMHtml} DOM élément à trouver dans le sujet
    :expected {jQuery} Set jQuery à trouver dans le sujet.
    :options {Object} [Options classiques des assertions](#options_assertions)
  @usage await expect('#monDiv').contains('#monSpan')
 */
async contains(expected, options){
  this.checkValiditySujet()
  expected = DOM.get(expected)
  let resultat = this.newResultat({
    verbe: 'contient', objet:`l'élément ${expected}`
  })
  // Le sujet doit déjà exister
  var res = await DOM.exists(this.actualValue)
  if ( !res ) resultat.validIf(false); return assert(resultat)
  resultat.validIf(this.actualValue.contains(expected))
  return assert(resultat)
}

//  / ASSERTIONS
// ---------------------------------------------------------------------

constructor(suj){
  super('d Subject')
  this.initialSujet = this.sujet = suj
  this.invalidSujet = false
  this.actualValue = this.getActualFromSujet(suj)
  this.invalidSujet || (this.sujet = this.getShortSujetFrom(this.actualValue))
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

/*
  @method d(element)
  @id d_subject
  @description Sujet DOM pour les expectations sur le DOM.
  @provided
    :element  {String} Soit le selector de l'élément.
    :element  {DOMElement} Soit l'élément `DOMHtml`
    :element {jQuery} Soit un set jQuery.
  @usage d('#monDiv');d(document.querySelector('#monDiv'));d(${'#monDiv'})
 */
global.d = function(suj) { return new d_Subject(suj) }
