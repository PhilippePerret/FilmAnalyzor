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
  const jqRef = `#banctime-tape #banctime-event-${foo.id}`
  var ajout = []
    , valide = DOM.contains(jqRef)
  if (valide && options && options.top){
    const o = $(jqRef)
    // console.log("$(jqRef):", $(jqRef))
    const otop = o.position().top
    valide = otop.isCloseTo(options.top, 4)
    ajout.push(`top à ${options.top}px`)
  }
  const pass = this.positive === valide
  if ( ajout.length ){
    ajout = `(avec ${ajout.join(', ')})`
  } else ajout = ''
  const msgs = this.assertise('La Timeline', 'contient', ajout, foo)
  assert(pass, ...msgs, options)
}
}

global.FITTimeline = new FITTimelineSubject('Timeline')
