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

, is_defined(options){
    const pass = this.positive === (undefined !== this.sujet)
    const msgs = this.assertise(this.sujet, 'est', 'défini')
    assert(pass, ...msgs, options)
  }
, is_undefined(options){
    const pass = this.positive === (undefined === this.sujet)
    const msgs = this.assertise(this.subject, 'est', 'indéfini')
    assert(pass, ...msgs, options)
  }
})
