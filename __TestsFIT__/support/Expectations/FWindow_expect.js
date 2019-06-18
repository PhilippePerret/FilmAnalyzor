'use strict'
/**
  Expectations concernant les Flying-Windows (FWindow)
**/

const FWindowExpectations = {
  is_event_form(options){
    assert(
        FWindow.current && (FWindow.current.name == 'AEVENTFORM')
      , "La fenêtre au premier plan est bien le formulaire d'events"
      , `La fenêtre au premier plan devrait être le formulaire d'events (mais c'est la fenêtre ${FWindow.current.name})`
      , options
    )
  }
, is_porte_documents(options){
    assert(
      FWindow.current && FWindow.current.name == 'PORTEDOCUMENTS'
    )
  }
}

FITExpectation.add(FWindowExpectations)
