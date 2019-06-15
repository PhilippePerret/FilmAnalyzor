'use strict'
/**
  Pour tous les tests Dom

  const o = new Dom(<string|DOMElement|jQuery>)
    Pour instancier un élément Dom
  o.exists()        Retourne true (asynchrone)
  o.isVisible()     Retourne true si l'élément est visible
**/

const DOM = {
  async exists(el){
    const o = new Dom(el)
    const res = await o.exists()
    return res
  }
, contains(el){ return $(el).length > 0 }
, displays(el){ return $(el).is(':visible') }
}

class Dom {
constructor(ref){
  this.o = $(ref)
}
trouve(){
  return new Promise( (ok,ko) => {
    const timeout = 5000
    var   timecur = 0
    const timer = setInterval(() => {
      if ( timecur > timeout ) {
        clearInterval(timer)
        ok(false)
      } else {
        timecur += 100
      }
      if ( DOM.contains(this.o) ){
        clearInterval(timer)
        ok(true)
      }
    }, 100) // tous les dizièmes de secondes
  })
}
async exists(){
  return await this.trouve()
  return res
}
async isVisible(){
  var vrai
  vrai = await this.exists()
  return vrai && DOM.displays(this.o)
}

}

module.exports.Dom = Dom
module.exports.DOM = DOM
