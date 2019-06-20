'use strict'
/**
  Toutes des méthodes pratiques pour le DOM

  On part du principe que toutes les méthodes étant dans des namespaces,
  des méthodes comme `click`, `keyPress`, etc. ne peuvent pas exister au
  niveau global.
  
**/
/**
  Simule le clic sur l'objet +obj+ qui peut être un objet ou un string
**/
global.click = function(obj) {
  $(obj).click()
}
