'use strict'

Object.assign(FITExpectation.prototype,{

  equals(value){return this.to_be(value)} // alias
, is(value){return this.to_be(value)} // alias

, to_be(value) {
    this.value = value
    const pass = this.positive === Object.is(this.sujet, this.value)
    const msgs = this.positivise('est', 'égal à')
    assert(
        pass
      , `${this.subject} ${msgs.success} ${this.value}`
      , `${this.subject} ${msgs.failure} ${this.value}`
      , this.options
    )
  }
})
