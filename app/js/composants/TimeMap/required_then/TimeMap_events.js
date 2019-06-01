'use strict'

Object.assign(TimeMap,{
/**
  Retourne la scène se trouvant sur la seconde +otime+
  Ou undefined
**/
  eventAt(otime){
    let dMap = this.dataAt(otime)
    let dElement = dMap.filter( e => isTrue(e.realEvent) )[0]
    if ( isDefined(dElement) ) return FAEvent.get(dElement.id)
  }

/**
  Retourne LES events qui commencent au temps +otime+

  ATTENTION : contrairement aux autres méthodes, les deux suivantes
  retournent tous les types d'events, qu'ils soient scène ou nœuds structurels.
**/
, eventsStartAt(otime){
    let dMap = this.dataAt(otime)
    return dMap.filter( e => e.phase & PHASE_START )
  }
, eventsEndAt(otime) {
    let dMap = this.dataAt(otime)
    return dMap.filter( e => e.phase & PHASE_END )
  }

, eventBefore(time){
    time = this.secondFor(time)
    while( --time >= 0 ){
      var e = this.eventAt(time)
      if ( isDefined(e) ) return e
    }
  }
/**
  Retourne la scène qui commence vraiment après le temps +time+.
**/
, eventAfter(time){
    var dMap, events, e
    time = this.secondFor(time)
    while ( dMap = this.map[++time] ) {
      events = dMap.filter( el => el.realEvent )
      // On cherche une scène *qui commence*
      e = events.filter( el => el.phase === PHASE_START )[0]
      if ( isDefined(e) ) return FAEvent.get(e.id)
    }
  }

})
