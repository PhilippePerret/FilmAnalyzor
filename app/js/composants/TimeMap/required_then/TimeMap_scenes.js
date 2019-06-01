'use strict'

Object.assign(TimeMap,{
/**
  Retourne la scène se trouvant sur la seconde +otime+
  Ou undefined
**/
  sceneAt(otime){
    let dMap = this.dataAt(otime)
    let dElement = dMap.filter( e => isTrue(e.scene) )[0]
    if ( isDefined(dElement) ) return FAEvent.get(dElement.id)
  }

, sceneBefore(time){
    time = this.secondFor(time)
    while( --time >= 0 ){
      var scene = this.sceneAt(time)
      if ( isDefined(scene) ) return scene
    }
  }
/**
  Retourne la scène qui commence vraiment après le temps +time+.
**/
, sceneAfter(time){
    var dMap, scenes, scene
    time = this.secondFor(time)
    while ( dMap = this.map[++time] ) {
      scenes = dMap.filter( el => el.scene )
      // On cherche une scène *qui commence*
      scene = scenes.filter( el => el.phase === PHASE_START )[0]
      if ( isDefined(scene) ) return FAEvent.get(scene.id)
    }
  }

})
