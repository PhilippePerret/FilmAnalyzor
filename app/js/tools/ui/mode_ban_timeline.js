'use strict'




const BanTimeline = {

  observeModeBanTimeline(){
    this.scaleTape.on(STRclick, this.onClickScaleTape.bind(this))
  }

, toggle(){
  let my = this

  // NOTE : pour le moment, on passe en mode ban timeline
  // TODO : pouvoir repasser dans le mode normal

  // --- PRÉPARATION DE L'INTERFACE ---
  this.prepareInterface()

  // --- ÉCRITURE DE L'ANALYSE ---
  this.dispatchElementOnTape()

}

// ---------------------------------------------------------------------
//  MÉTHODES GÉNÉRALES DE PRÉPARATION

/**
  Préparation de l'interface.
  Construction des éléments de l'interface et observation
**/
, prepareInterface(){
    // On doit supprimer la pied de page
    $('#section-footer').hide()

    // $('#section-videos').hide() // en attendant
    // $('#section-reader').hide() // en attendant
    $('#analyse-state-bar').hide() // en attendant

    // Si c'est la première fois, il faut charger la feuille de style
    isEmpty($('#ban-timeline-stylesheet')) && (
      System.loadCSSFile('./css/mode_ban_timeline.css', 'ban-timeline-stylesheet')
    )

    // Retirer la taille imprimée à la vidéo
    $('#section-videos .section-video').attr('style', null)

    // Retirer le placement imprimé au reader
    $('#reader').attr('style', null)
    // Retirer le draggable du
    current_analyse.reader.fwindow.jqObj.draggable('option','disabled','true')


    // Le ban timeline lui-même
    document.body.append(DCreate(SECTION,{id:'bantime-ban-timeline', append:[
        DCreate(DIV,{id:'bantime-scaletape'})   // bande pour positionner le curseur
      , DCreate(DIV,{id:'bantime-tape'})        // bande pour déposer les éléments
      , DCreate(DIV,{id:'bantime-cursor'}) // curseur de timeline
      ]}))

    // Il faut régler les hauteurs aux hauteurs de l'écran
    let timelineRowHeight = 260
      , topRowHeight = ScreenHeight - timelineRowHeight - 80
      , timelineTapeHeight = timelineRowHeight - this.scaleTape.height()
      
    $(STRbody).css('grid-template-rows', `${topRowHeight}px ${timelineRowHeight}px`)

    // Hauteur de la tape de timeline
    this.timelineTape.css('height', `${timelineTapeHeight}px`)
    // Hauteur du curseur de timeline
    this.cursor.css('height', `${timelineRowHeight - 10}px`)

    this.observeModeBanTimeline()
  }

/**
  Méthode qui place les éléments courants sur la "tape" de la timeline
**/
, dispatchElementOnTape(){
    console.log("-> BanTimeline::dispatchElementOnTape()")
    this.a.forEachEvent(e => { new BanTimelineElement(e).place() })
  }

// ---------------------------------------------------------------------
//  MÉTHODES D'EVENTS

, onClickScaleTape(e){
    stopEvent(e)
    this.setCurrentPosition(e.offsetX)
  }

, setCurrentPosition(x){
    this.cursor.css('left',`${x - 4}px`)
    this.currentTime = this.p2t(x)
    this.a.locator.setTime(this.currentTime)
  }
/**
  @param {OTime} t   Time où mettre le cursor
**/
, setCursorByTime(t){
    this.currentTime = t
    this.cursor.css('left',`${(this.t2p(t.vtime)) + 4}px`)
  }

// ---------------------------------------------------------------------
//  MÉTHODES D'HELPER

/**
  Méthode qui reçoit un nombre de pixels +x+ correspondant à une coordonnée
  dans le ban de timeline et retourne le temps correspondant en fonction :
    - du zoom appliquée, de la position 0 de la timeline (son scroll horizontal)
**/
, p2t(x){

    // On ajoute le scroll éventuel de la bande
    x += this.scrollX
    return (x * this.coefP2T()).round(2)
  }
, t2p(t){
    return (t * this.coefT2P()).round(2) - this.scrollX
  }
// ---------------------------------------------------------------------
//  MÉTHODES DE CALCUL

, coefP2T(){
    return this._coefp2t || defP(this,'_coefp2t', (this.a.duree / this.width ) / this.zoom)
  }

, coefT2P(){
    return this._coeft2p || defP(this,'_coeft2p', (this.width / this.a.duree) * this.zoom)
}

}// /const BanTimeLine
Object.defineProperties(BanTimeline, {
  // Propriétés diverses
  a:{get(){return current_analyse}}

, currentTime:{
    get(){return this._currenttime || new OTime(0)}
  , set(v){
      isDefined(this._currenttime) || (this._currenttime = new OTime(0))
      this._currenttime.vtime = v

    }
  }
// ---------------------------------------------------------------------
//
  // zoom courant (défaut = 100)
, zoom:{
    get(){return this._zoom || 1}
  , set(v){this._zoom = v}
  }
  // Scroll courant du ban de timeline
, scrollX:{
    get(){return this.timelineTape.scrollLeft()}
  }

// ---------------------------------------------------------------------
//  PROPRIÉTÉS DOM

//
, width:{get(){
    return this._width || defP(this,'_width', this.banTimeline.width())
  }}

// ---------------------------------------------------------------------
//  OBJETS DOM

, cursor:{get(){return $('section#bantime-ban-timeline div#bantime-cursor')}}
  // Bande sur laquelle on dépose les éléments.
, timelineTape:{get(){return $('section#bantime-ban-timeline div#bantime-tape')}}
, scaleTape:{get(){return $('section#bantime-ban-timeline div#bantime-scaletape')}}
, banTimeline:{get(){return $('section#bantime-ban-timeline')}}
})


class BanTimelineElement {
/**
  Instanciation de l'élément de BanTime, avec un FAEvent pour le moment
**/
constructor(ev){

  this.event = ev
}

/**
  Méthode qui place l'élément sur la tape de la timeline
**/
place(){
  BanTimeline.timelineTape.append(this.div)
}

get div(){
  return DCreate(DIV,{class:'bantime-element', style:`width:${this.width}px;left:${this.left}px;`})
}
get width(){
  return 40;
}
get left(){
  return BanTimeline.t2p(this.event.otime.vtime)
}
}

module.exports = BanTimeline
