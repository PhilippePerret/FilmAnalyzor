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
/*
  @method click(obj)
  @description Simule un click sur l'objet DOM +obj+
  @provided
    :obj  {DOMHTML|jQuery|String} DOM Élément ou set jQuery qui doit être cliqué.
  @usage click('div#monDiv');click(document.querySelector('#monDiv'));click($('#monDiv'))
 */
global.click = function(obj) {
  $(obj).click()
}
