'use strict'

const {DOMHorloge} = require('./DOMHorloge.js')
require('../utils')


describe("classe DOMHorloge", () => {
  it('répond à string2seconds', () => {
    expect(typeof DOMHorloge.string2seconds).toBe('function')
  })
  it("retourne la bonne valeur", () => {
    let paires = [
        ['20', 20]
      , ['20.12', 20.5]
      , ['20,12', 20*60 + 12]
      , ['1,1,1', 3600+60+1]
      , ['(20)', 20]
      , ['(30*2)', 60]
      , ['(20*2)+(10*4)', 80]
      , ['20*(2+10)*4)', 960]
      , ['0,1,0.12', 60.5]
    ]
    for ( var paire of paires) {
      expect(DOMHorloge.string2seconds(paire[0])).toBe(paire[1])
    }
  })
})

describe("Les instances DOMHorloge", () => {
  beforeEach(()=> {
    var dom = window.document.createElement('DIV')
    dom.id = 'monID'
    this.horloge = new DOMHorloge(dom)
    // var horloge = new DOMHorloge()
  })
  it("ont une propriété id qui retourne l'identifiant de l'objet DOM", ()=>{
    // var horloge = new DOMHorloge('<div id="monID"></div>')
    expect(this.horloge.id).toBe('monID')
  })

})
