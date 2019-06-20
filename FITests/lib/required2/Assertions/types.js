'use strict'

Object.assign(FITExpectation.prototype,{

  is_typeof(value, options){
    const pass = this.positive === (typeof(this.sujet) === value.name.toLowerCase())
    const msgs = this.assertise(`${this.subject}`, 'est', 'de type', value.name.toLowerCase())
    assert(pass, ...msgs, options)
  }
, is_instanceof(value, options){
    const pass = this.positive === (this.sujet instanceof(value))
    const msgs = this.assertise(`${this.subject}`, 'est', 'une instance de', value.name)
    assert(pass, ...msgs, options)
  }

})
