'use strict'
/**
  Méthodes interface (objet UI de BancTimeline)
**/
module.exports = {
  zoom(deca){
    this.setBTZoom(0.2 * (deca||1))
    BancTimeline.items.map(bte => bte.repositionne())
    console.log("ZOOM:", BancTimeline.zoom)
  }
, dezoom(deca){
    this.setBTZoom(-0.2* (deca||1))
    BancTimeline.items.map(bte => bte.repositionne())
    console.log("ZOOM:", BancTimeline.zoom)
  }
, setBTZoom(value){
    delete BancTimeline._coefp2t
    delete BancTimeline._coeft2p
    BancTimeline.zoom += value
    if(BancTimeline.zoom < 0) BancTimeline.zoom = 0.1
  }
}
