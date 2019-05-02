'use strict'

// Pour remplir un formulaire quelconque
// TODO Faire la distinction en fonction du type de l'élément
window.fillFormWith = function(formId, data, options){
  if(formId.substr(0,1)!='#') formId = `#${formId}`
  for(var domId in data){
    // console.log("Remplissage de, avec:", domId, data[domId])
    var fullDomId = `form${formId} #${domId}`
    var formObj = document.querySelector(fullDomId)
    if (formObj == null) throw(`Le champ d'édition "${fullDomId}" est inconnu.`)
    $(formObj).val(data[domId])
  }
}
