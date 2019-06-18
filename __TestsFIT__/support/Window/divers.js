'use strict'

// Pour faire :
//    expect(FrontFWindow).<methode>
Object.defineProperties(window,{

  // La FWindow au premier plan
  FrontFWindow:{get(){return FWindow.current && FWindow.current.name}}

})
