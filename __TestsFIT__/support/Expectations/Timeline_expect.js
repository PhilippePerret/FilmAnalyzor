'use strict'
/**
  Définition du sujet FITTimeline qui permet de travailler avec la Timeline,
  c'est-à-dire le banc de ligne de temps en bas de l'éditeur
**/

class FITTimelineSubject extends FITSubject {
constructor(name){
  super(name)
  this.assertions = TimelineAssertions
}
}

const TimelineAssertions = {
/**
  Produit un succès si la Timeline contient l'event correspondant à +foo+
  @param {Event|Anything} foo   En général un évènement
  @param {Object} options Les options normales +
                    top     Valeur en pixels de la hauteur attendue de l'event
**/
contains(foo, options){
  options = options || {}
  let resultat = new FITResultat(this,{
      sujet: 'La Timeline'
    , verbe: 'contient'
    , objet: `${foo}`
    , options: options
  })
  const jqRef = `#banctime-tape #banctime-event-${foo.id}`

  resultat.validIf(DOM.contains(jqRef))

  if (resultat.valid && options.top){
    const otop = $(jqRef).position().top
    resultat.validIf(
        otop.isCloseTo(options.top, 4)
      , `top à ${options.top}px`
      , `placé à top:${otop}px au lieu de ${options.top}px`
    )
  }
  if (resultat.valid && options.left){
    const oleft = $(jqRef).position().left
    resultat.validIf(
        oleft.isCloseTo(options.left, 4)
      , `left à ${options.left}px`
      , `placé à left:${oleft}px au lieu de ${options.left}px`
    )
  }
  assert(resultat)
}
}

global.FITTimeline = new FITTimelineSubject('Timeline')
