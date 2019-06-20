'use strict'

Object.assign(FITExpectation.prototype,{

  responds_to(value) {
    this.value = value
    const pass = this.positive === ('function' === typeof(this.voulu[this.value]))
    assert(
        pass
      , `${this.subject} ${this.positive?'répond bien à':'ne répond pas'} à ${this.value}`
      , `${this.subject} ${this.positive?'devrait répondre à':'ne devrait pas répondre'} à ${this.value}`
      , this.options
    )
  }


})
