'use strict'

function FReqGet(name){
  return require(`./js/system/first_required/${name}.js`)
}

const System = FReqGet('System')
const {DOMHorloge, DOMDuration} = FReqGet('DOMHorloge')
const Hash = FReqGet('Hash')
const Flash = FReqGet('Flash')
const F = Flash
const Selector = FReqGet('Selector')
const IOFile = FReqGet('IOFile')
const OTime = FReqGet('OTime')
const FATime = OTime // pour les associates
const App = FReqGet('App')
const FAUnknownElement = FReqGet('FAUnknownElement')
