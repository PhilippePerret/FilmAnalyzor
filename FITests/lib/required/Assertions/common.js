'use strict'

Object.assign(FITExpectation.prototype,{

  equals(value){return this.to_be(value)} // alias
, to_be(value) {
    this.value = value
    const pass = this.positive === Object.is(this.voulu, this.value)
    const msgs = this.positivise('est', 'égal à')
    assert(
        pass
      , `${this.subject} ${msgs.success} ${this.value}`
      , `${this.subject} ${msgs.failure} ${this.value}`
      , this.options
    )
  }
, async to_be_visible() {
    let pass
    if ( not(this.positive) && not(DOM.contains(this.voulu))){
      pass = false // donc c'est bon
    } else {
      pass = await DOM.exists(this.voulu)
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
