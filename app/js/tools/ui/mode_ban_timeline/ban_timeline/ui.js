'use strict'
/**
  Méthodes interface (objet UI de BanTimeline)
**/
module.exports = {
  zoom(deca){
    this.setBTZoom(0.2 * (deca||1))
    BanTimeline.items.map(bte => bte.repositionne())
    console.log("ZOOM:", BanTimeline.zoom)
  }
, dezoom(deca){
    this.setBTZoom(-0.2* (deca||1))
    BanTimeline.items.map(bte => bte.repositionne())
    console.log("ZOOM:", BanTimeline.zoom)
  }
, setBTZoom(value){
    delete BanTimeline._coefp2t
    delete BanTimeline._coeft2p
    BanTimeline.zoom += value
    if(BanTimeline.zoom < 0) BanTimeline.zoom = 0.1
  }
}
