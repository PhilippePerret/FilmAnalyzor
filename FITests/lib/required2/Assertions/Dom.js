'use strict'
/**
  Pour tous les tests du DOM

  expect(elementString)[.not].exists()
      Retourne true si `elementString` est visible dans la page
      exemple : expect('div#monDiv').exists()

  expect(elementString)[.not].is_visible()
      Retourne true si `elementString` est visible dans la page
      exemple : expect('div#monDiv').is_visible()

**/

global.DOM = {
  /*
    @method (returned) DOM.get(from)
    @description Retourne un DOM élément d'après la valeur fourni +from+ qui peut être un string (sélecteur), un set jQuery ou un élément DOM.
    @provided
      :from {String} Soit le sélecteur.
      :from {jQuery} Soit le set jQuery (on renvoie le premier élément)
      :from {DOMHtml} Soit l'élément DOM
    @returned
      :element {HTMLElement} Le DOM élément correspondant à +from+.
    @usage DOM.get('#monContainer div#monDivCherched')
   */
  get(from){
    if ( 'string' === typeof(from) ) return document.querySelector(from)
    else if ( undefined != from.length && !Array.isArray(from) ) return from[0]
    else if ( from instanceof HTMLElement ) return from
    else return null
  }

  /*
    @method (returned) DOM.exists(element, options)
    @description Retourne true si l'élément +element+ existe dans le DOM.
    @provided
      :element {HTMLElement} Un DOM élément ou
      :element {String} un sélecteur ou
      :element {jQuery} un set jQuery
      :options {Object} Options. {positive:boolean} Si false, on cherche l'absence
    @returned
      :valeur {Boolean} `true` si l'élément existe, `false` dans le cas contraire.
    @usage await DOM.exists('#monDiv')
   */
, async exists(el, options){
    if ( options && options.positive === false && $(el).length === 0){
      // Si on veut vérifier que l'élément n'existe pas et qu'il n'existe
      // pas, on peut retourner tout de suite la valeur.
      return false
    }
    var xtime = 16
    while( xtime -- > 0 ) {
      // console.log(`\$${el}.length = ${$(el).length}`)
      if ( $(el).length ) return true
      await wait(200)
    }
    return false
  }
, contains(el){ return $(el).length > 0 }
, displays(el){ return $(el).is(':visible') }
}

class Dom {
constructor(ref){
  this.o = $(ref)
}
trouve(){
  return new Promise( (ok,ko) => {
    const timeout = 5000
    var   timecur = 0
    const timer = setInterval(() => {
      if ( timecur > timeout ) {
        clearInterval(timer)
        ok(false)
      } else {
        timecur += 100
      }
      if ( DOM.contains(this.o) ){
        clearInterval(timer)
        ok(true)
      }
    }, 100) // tous les dizièmes de secondes
  })
}
async exists(){
  return await this.trouve()
  return res
}
async is_visible(){
  var vrai
  vrai = await this.exists()
  return vrai && DOM.displays(this.o)
}

}

Object.assign(FITExpectation.prototype,{
  async exists(options){
    let resultat = this.newResultat({
        verbe:'existe',
        objet:'dans la page', options:options||{}
    })
    const pass = await DOM.exists(this.actual)
    resultat.validIf(pass)
    assert(resultat)
  }

, async is_visible(options) {
    let resultat = this.newResultat({
        verbe:'est', comp_verbe:'visible', options:options||{}
    })
    let pass
    if ( not(this.positive) && not(DOM.contains(this.sujet))){
      pass = false // donc c'est bon
    } else {
      pass = await DOM.exists(this.sujet)
    }
    resultat.validIf(pass)
    assert(resultat)
  }
})

module.exports.Dom = Dom
// module.exports.DOM = DOM
