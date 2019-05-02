'use strict'
/**
* Un des derniers modules appelés, mais surtout celui définissant la méthode
* d'initialisation
*/
FAWriter.init = function(){
  Snippets.init()
  this.inited = true
}
