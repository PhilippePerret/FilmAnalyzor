'use strict'

module.exports = {
/**
  Méthode qui place l'élément sur la tape de la timeline
**/
  place(){
    BanTimeline.timelineTape.append(this.div)
    this.observe()
  }

/**
  Observe l'objet de cet event
**/
, observe(){

  }

}
