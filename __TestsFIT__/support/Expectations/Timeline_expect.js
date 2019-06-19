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
  var ajout   = []
    , details = []
    , valide  = DOM.contains(jqRef)
  if ( valide ) details.push(`L'élément ${foo} a été trouvé`)
  else details.push(`L'élément ${foo} n'a pas été trouvé`)
  if (valide && options && options.top){
    const o = $(jqRef)
    // console.log("$(jqRef):", $(jqRef))
    const otop = o.position().top
    valide = otop.isCloseTo(options.top, 4)
    if ( valide ) details.push(`l'élément est bien placé à top:${options.top}px`)
    else details.push(`mais l'élément est placé à top:${otop}px au lieu de ${options.top}px`)
    ajout.push(`top à ${options.top}px`)
  }
  if (valide && options && options.left){
    const o = $(jqRef)
    // console.log("$(jqRef):", $(jqRef))
    const oleft = o.position().left
    valide = oleft.isCloseTo(options.left, 4)
    if ( valide ) details.push(`l'élément est bien placé à left:${options.left}px`)
    else details.push(`mais l'élément est placé à left:${oleft}px au lieu de ${options.left}px`)
    ajout.push(`left à ${options.left}px`)
  }
  const pass = this.positive === valide
  if ( ajout.length ){
    ajout = `(avec ${ajout.join(', ')})`
  } else ajout = ''
  const msgs = this.assertise('La Timeline', 'contient', ajout, foo)
  options.details = details
  assert(pass, ...msgs, options)
}
}

global.FITTimeline = new FITTimelineSubject('Timeline')
