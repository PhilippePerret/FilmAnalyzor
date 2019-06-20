'use strict'
/**
  Pour tous les tests du DOM

  expect(elementString)[.not].exists()
      Retourne true si `elementString` est visible dans la page
      exemple : expect('div#monDiv').exists()

  expect(elementString)[.not].is_visible()
      Retourne true si `elementString` est visible dans la page
      exemple : expect('div#monDiv').is_visible()

**/

global.DOM = {
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
async is_visible(){
  var vrai
  vrai = await this.exists()
  return vrai && DOM.displays(this.o)
}

}

Object.assign(FITExpectation.prototype,{
  async exists(){
    const pass = await DOM.exists(this.sujet)
    const msgs = this.positivise('existe')
    assert(
        pass === this.positive
      , `${this.subject} ${msgs.success} dans la page.`
      , `${this.subject} ${msgs.failure} dans la page.`
      , this.options
    )
  }

, async is_visible() {
    let pass
    if ( not(this.positive) && not(DOM.contains(this.sujet))){
      pass = false // donc c'est bon
    } else {
      pass = await DOM.exists(this.sujet)
    }
    const msgs = this.positivise('est', 'visible')
    assert(
        this.positive === pass
      , `${this.subject} ${msgs.success} dans la page`
      , `${this.subject} ${msgs.failure} dans la page`
      , this.options
    )
  }
})

module.exports.Dom = Dom
// module.exports.DOM = DOM
