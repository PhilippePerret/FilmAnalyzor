'use strict'

Object.assign(TimeMap,{
/**
  Retourne tous les éléments se trouvant sur la seconde +otime+
  Ou une liste vide.
  Pour le moment, les éléments sont :
    - les events
    - les images
    - les noeuds structurels

  Attention : pour une question de vitesse, on ne retourne des instances que
  si options.instances = true
**/
  allAt(otime, options){
    options = options || {}
    if ( options.instances ) {
      return this.dataAt(otime).map(elm => this.a.elementAsInstance(elm))
    } else {
      return this.dataAt(otime)
    }
  }

/**
  Retourne TOUS LES éléments qui commencent au temps +otime+

  ATTENTION : contrairement aux autres méthodes, les deux suivantes
  retournent une liste d'élément quelconques.
**/
, allStartAt(otime){
    return this.dataAt(otime).filter( e => (e.phase & PHASE_START) )
  }
, allEndAt(otime) {
    return this.dataAt(otime).filter( e => (e.phase & PHASE_END) )
  }

// , anyBefore(time){
//     time = this.secondFor(time)
//     while( --time >= 0 ){
//       var e = this.eventAt(time)
//       if ( isDefined(e) ) return e
//     }
//   }
// /**
//   Retourne l'élément quelconque qui commence vraiment après le temps +time+.
// **/
// , anyAfter(time){
//     var dMap, events, e
//     time = this.secondFor(time)
//     while ( dMap = this.map[++time] ) {
//       events = dMap.filter( el => el.realEvent )
//       // On cherche une scène *qui commence*
//       e = events.filter( el => el.phase === PHASE_START )[0]
//       if ( isDefined(e) ) return FAEvent.get(e.id)
//     }
//   }

})
