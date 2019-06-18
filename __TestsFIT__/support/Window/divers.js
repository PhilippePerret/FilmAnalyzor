'use strict'

// Pour faire :
//    expect(FrontFWindow).is(<son nom>)
global.FrontFWindow = class {
static toString(){
  return `${FWindow.current.name}`
}
static is_event_form(options){
  assert(
      FWindow.current && (FWindow.current.name == 'AEVENTFORM')
    , "La fenêtre au premier plan est bien le formulaire d'events"
    , `La fenêtre au premier plan devrait être le formulaire d'events (mais c'est la fenêtre ${FWindow.current.name})`
    , options
  )
}
}
