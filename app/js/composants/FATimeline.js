'use strict'
/**
* Classe FATimeline
* -----------------
* Pour transformer des éléments qui devront pouvoir répondre
* aux fonctionnalités de la Timeline.
**/

class FATimeline {

// ---------------------------------------------------------------------
//  INSTANCE

/**
* Instanciation de l'objet Timeline, avec son container,
* qui sera la bande qui réagira aux souris.
**/
constructor(container, analyse){
  this.container    = container
  this.jqContainer  = $(container)
  // On ajoute la classe timeline si elle n'est pas déjà dans
  // le container.
  if(!this.jqContainer.hasClass('timeline')) this.jqContainer.addClass('timeline')
  this.analyse = this.a = analyse || current_analyse
}

/**
* Initialisation
*
* +options+ Pour poser quelques options :
*   :height   (nombre pixels) Hauteur à appliquer, plutôt que la hauteur
*             par défaut.
*   :only_slider_sensible      Si true, seul la bande (le slider) est sensible
*                         au déplacement de souris.
**/
init(options){
  if(undefined === options) options = {}
  // Construire les éléments (p.e. l'horloge)
  this.build(options)
  // Placer les observers et faire quelques réglages
  this.observe(options)
  this.inited = true
}

/**
* Positionne le cursor principal au temps voulu
**/
positionneAt(time){
  time instanceof(OTime) || raise(T('otime-arg-required'))
  this.mainCursor.css('left', `${(time.rtime * this.coefT2P)+4}px`)
}
// Position le cursor fantôme
positionneShadowAt(time){
  time instanceof(OTime) || raise(T('otime-arg-required'))
  this.shadowCursor.css('left', `${(time.rtime * this.coefT2P)+4}px`)
}
/**
* Quand on arrive sur le slider
*
* Pour le moment, on ne fait qu'arrêter la vidéo et se mettre en place
**/
onHoverSlider(e){
  this.horloge.css('visibility', 'visible')
  this.shadowCursor.css('visibility', 'visible')
  return stopEvent(e)
}

onMouseOutSlider(e){
  this.horloge.css('visibility', 'hidden')
  this.shadowCursor.css('visibility', 'hidden')
  return stopEvent(e)
}

onMoveOnSlider(e){
  this.otime.updateSeconds((e.offsetX - 10) * this.coefP2T)
  this.positionneShadowAt(this.otime)
  this.horloge.css('visibility', 'visible')
  this.horloge.html(this.otime.horloge)
  stopEvent(e)
}

onClickOnSlider(e){
  this.locator.setTime(this.otime)
  this.positionneAt(this.otime)
  if(this.locator.playing) this.locator.togglePlay()
}

// C'est le double-clic qui démarre la vidéo
onDoubleClickOnSlider(e){
  this.locator.togglePlay()
  this.positionneAt(this.otime)
}

/**
* Construction de la Timeline
**/
build(options){
  // var ho = document.createElement('span')
  // ho.className = 'timeline-horloge horloge'
  // ho.style = 'visibility:hidden;'
  // this.container.appendChild(ho)


  // Le div du curseur principal
  var sty = '', cursorStyle
  if(options.cursorHeight)  sty += `height:${options.cursorHeight}px;`
  if(options.cursorTop)     sty += `top:${options.cursorTop}px;`
  if(sty != '') cursorStyle = sty

  var cu = DCreate('DIV', {
    class: 'cursor timeline-maincursor'
  , style: cursorStyle
  })

  var ho = DCreate('SPAN',{class:'timeline-horloge horloge', style: 'visibility:hidden;'})

  var shcu = DCreate('DIV', {
    class: 'cursor timeline-shadowcursor'
  , style: cursorStyle
  , append: [ho]
  })

  // Le div qui va permettre de placer les
  // cursors. C'est le slider.
  var di = DCreate('DIV', {
    class: 'timeline-cursors'
  , style: options.height ? `height:${options.height}px;` : undefined
  , append: [cu, shcu]
  })

  this.container.appendChild(di)

  this.built = true

  return this // pour le chainage
}
observe(options){
  var cont
  if(options.only_slider_sensible){
    cont = this.jqSlider
  } else {
    cont = this.jqContainer
  }

  cont.on('click',     this.onClickOnSlider.bind(this))
  cont.on('dblclick',  this.onDoubleClickOnSlider.bind(this))
  cont.on('mousemove', this.onMoveOnSlider.bind(this))
  cont.on('mouseover', this.onHoverSlider.bind(this))
  cont.on('mouseout',  this.onMouseOutSlider.bind(this))

  // Taille du cursor (sauf si la vidéo principale)
  if(!options.height && !this.container.parentNode.id === 'section-video'){
    // console.log("this.container.parentNode",this.container.parentNode)
    var contHeight = this.jqSlider.height()
    var cursHeight = $(this.container).height()
    this.mainCursor.css({height: `${cursHeight}px`, top: `-${cursHeight - contHeight}px`})
    this.shadowCursor.css({height: `${cursHeight}px`, top: `-${cursHeight - contHeight}px`})
    // console.log("container.parentNode()", $(this.container.parentNode).height() )
  }

}

get otime(){return this._otime||defP(this,'_otime', new OTime(0))}

get jqSlider(){return this._slider || defP(this,'_slider', this.jqContainer.find('.timeline-cursors'))}
get shadowCursor(){return this._shadowCursor || defP(this,'_shadowCursor', this.jqContainer.find('.timeline-shadowcursor'))}
get mainCursor(){return this._mainCursor || defP(this,'_mainCursor', this.jqContainer.find('.timeline-maincursor'))}
get locator(){return this._locator || defP(this,'_locator',this.a.locator)}
get horloge(){return this._horloge || defP(this,'_horloge',this.jqContainer.find('.timeline-horloge'))}

get coefP2T(){
  if( undefined === this._coefP2T){
    this._coefP2T = this.dureeVideo / this.widthContainer
  }
  return this._coefP2T
}

get coefT2P(){
  if(undefined === this._coefT2P){
    this._coefT2P = this.widthContainer / this.dureeVideo
  }
  return this._coefT2P
}
get widthContainer(){return this.jqContainer.width()}
get dureeVideo(){return this._dureeVideo || defP(this, '_dureeVideo', this.a.videoController.video.duration)}

}// /fin de FATimeline
