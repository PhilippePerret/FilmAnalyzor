'use strict'
/**
  Pour construire des mini-timeline
**/
class MiniTimeline {


// ---------------------------------------------------------------------
//  INSTANCE
constructor(owner, elements){
  this.a = this.analyse = current_analyse
  this.owner = owner
  this.scenes = elements.scenes
  this.times  = elements.times
  this.events = elements.events
}

/**
  Construction de la timeline, avec les options +options+ qui contient
  notamment la largeur de la timeline voulue

  @param {Object} options
    :width      La largeur attendue (100 % par défaut)
    :suff_id    Identifiant du div principal ajouté à 'minitimeline-<suff_id>'
**/
build(options){
  log.info("-> MiniTimeline#build()",options)
  // return DCreate('DIV',{inner:'rien pour le moment'})

  if(undefined === options) options = {}
  if(undefined === options.width){
    options.width = 100 /* i.e. 100 % */
    options.unit = '%'
  } else if(undefined === options.unit){
    options.unit = 'px'
  }
  let width   = options.width
    , coefT2P = width / this.a.duree

  this.unit = options.unit

  var divs = []
  if(this.scenes){
    divs.push(...this.buildElementListDivs(this.scenes, 'scene', coefT2P))
  }
  if(this.events){
    divs.push(...this.buildElementListDivs(this.events, 'event', coefT2P))
  }
  if(this.times){
    divs.push(...this.buildElementListDivs(this.times, 'time', coefT2P))
  }
  log.info("<- MiniTimeline#build()")
  return DCreate('DIV',{class:'minitimeline', id:`minitimeline-${options.suff_id}`, append: divs})
}

buildElementListDivs(arr_elements, type, coefT2P){
  var arr = []
  arr_elements.map(elm => arr.push(this.buildElementDiv(elm, type, coefT2P)))
  return arr
}

buildElementDiv(elm, type, coefT2P){
  var w, l
  let u = this.unit
  switch(type){
    case 'time':
      w = u == 'px' ? 4 : 1
      l = (elm * coefT2P).round(1)
      break
    default:
      w = (elm.duree * coefT2P).round(1)
      l = (elm.time * coefT2P).round(1)
  }
  if (u != '%' && w < 4) w = 4
  else if (u == '%' && w < 0.5) w = 0.5
  return DCreate('SPAN', {class:`mtl-seg mtl-${type}`, style:`left:${l}${u};width:${w}${u};`})
}


}
