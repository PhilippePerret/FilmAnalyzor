'use strict'


const PHASE_START     = 1
const PHASE_CONTINUE  = 2
const PHASE_END       = 4

const TYPE_EVENT  = 1
const TYPE_STT    = 2
const TYPE_MARKER = 4
const TYPE_IMAGE  = 8

const TYP_TIMEMAP_TO_TYP = {}
TYP_TIMEMAP_TO_TYP[TYPE_EVENT]  = STRevent
TYP_TIMEMAP_TO_TYP[TYPE_STT]    = 'sttNode'
TYP_TIMEMAP_TO_TYP[TYPE_MARKER] = 'marker'
TYP_TIMEMAP_TO_TYP[TYPE_IMAGE]  = 'image'



const TimeMap = {

  init(){
    this.map = {}
  }
, reset(){
    this.init()
  }

/**
  Retourne la donnée map au temps otime
  @param {Int|Float|OTime} time La seconde de la donnée à retourner
  @return {Array} La liste des éléments qui se trouvent à la seconde +time+
**/
, dataAt(time){
    if ( time instanceof(OTime) ) time = time.vtime
    time = Math.floor(time)
    return this.map[time] || []
  }


, secondFor(time){
    if ( time instanceof(OTime) ) time = time.seconds
    return Math.floor(time)
  }
/**
  Actualisation complète de la map par secondes

  La méthode est également appelée au chargement de l'analyse, pour définir
  la première fois la map
**/
, update(){
    var s // seconde
      , len

    let startOpe = new Date().getTime()

    this.init()

    // Préparation de la map. On met un array pour chaque seconde
    for(s = 0, len = UI.video.duration; s <= len ; ++s ){
      this.map[s] = []
    }

    // On passe en revue chaque event pour l'entrer dans la map
    var s_end, de, de_
    this.a.forEachEvent(ev => {
      s = Math.floor(ev.startAt)
      de = {type:TYPE_EVENT, id:ev.id}

      // Propriétés supplémentaires en fonction du type de l'event
      if ( ev.isAScene ) de.scene = true
      else if ( ev.isASttNode ) de.sttNode = true
      else de.realEvent = true

      de_ = Object.assign({}, de, {phase:PHASE_START, time: ev.startAt})
      this.map[s].push(de_)
      s_end = Math.floor(ev.endAt)
      de_ = Object.assign({}, de, {phase:PHASE_END, time: ev.endAt})
      this.map[s_end].push(de_)
      do {
        ++ s
        de_ = Object.assign({}, de, {phase:PHASE_CONTINUE})
        this.map[s].push(de_)
      } while ( s < s_end - 1 )
    })

    // Ajout des images
    // Note : on les laisse 5 secondes à l'affichage
    FAImage.forEachByTime( himg => {
      // console.log("Image dans TimeMap:", himg)
      s = Math.floor(himg.time)
      Object.assign(himg,{type:TYPE_IMAGE, id:himg.affixe, phase:PHASE_START})
      this.map[s].push(himg)
      for(var i = 0; i<5;++i){
        this.map[++s].push(Object.assign({}, himg,{phase:PHASE_CONTINUE}))
      }
      this.map[s + 6].push(Object.assign({}, himg,{phase:PHASE_END}))
    })

    // Ajout des markers
    // -----------------
    // On les laisse 5 secondes à l'affichage dans le reader
    this.a.markers.each( marker => {
      var hmarker = {type:TYPE_MARKER, id:marker.id, time:marker.time, phase:PHASE_START}
        , s = Math.floor(marker.time)
      this.map[s].push(hmarker)
      for(var i = 0; i<5;++i){
        this.map[++s].push(Object.assign({}, hmarker,{phase:PHASE_CONTINUE}))
      }
      this.map[s + 6].push(Object.assign({}, hmarker,{phase:PHASE_END}))
    })

    // Finalisation de la map : on classe dans chaque seconde
    for(s in this.map){
      this.map[s].sort(function(a,b){return a.time > b.time})
    }

    let endOpe = new Date().getTime()


    // console.log("TimeMap.map", TimeMap.map)
    log.info(`    Durée de fabrication de la TimeMap.map: ${endOpe - startOpe}msecs`)
  }
}
Object.defineProperties(TimeMap,{
  a:{get(){return current_analyse}}
})
TimeMap.init()