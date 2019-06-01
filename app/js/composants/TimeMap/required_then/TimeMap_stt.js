'use strict'
/**
  Extension de TimeMap pour les nœuds structurels
**/
Object.assign(TimeMap,{
/**
  Retourne le nœud structurel se trouvant sur la seconde +otime+
  Ou undefined
**/
  sttNodeAt(otime){
    let dMap = this.dataAt(otime)
    let dElement = dMap.filter( e => isTrue(e.sttNode) )[0]
    if ( isDefined(dElement) ) return FAEvent.get(dElement.id).sttNode
  }

, sttNodeBefore(time){
    time = this.secondFor(time)
    while( --time >= 0 ){
      var sttNode = this.sttNodeAt(time)
      if ( isDefined(sttNode) ) return sttNode
    }
  }
/**
  Retourne la scène qui commence vraiment après le temps +time+.
**/
, sttNodeAfter(time){
    var dMap, sttNodes, sttNode
    time = this.secondFor(time)
    while ( dMap = this.map[++time] ) {
      sttNodes = dMap.filter( el => el.sttNode )
      // On cherche un nœud structurel *qui commence*
      sttNode = sttNodes.filter( el => el.phase === PHASE_START )[0]
      if ( isDefined(sttNode) ) return FAEvent.get(sttNode.id).sttNode
    }
  }
})
