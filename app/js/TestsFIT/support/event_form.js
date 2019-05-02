'use strict'
/**
 * Méthodes pratiques pour le formulaire d'event
 */



// Pour remplir un formulaire d'event (modification ou création)
window.fillEventFormWith = function(eventId, data, options){
  if(undefined===options) options = {}
  var formId = `#form-edit-event-${eventId}`
  var formData = {}
  for(var prop in data){
    var propId = `event-${eventId}-${prop}`
    formData[propId] = data[prop]
  }
  fillFormWith(formId, formData, options)
  if ( options.submit === true ){
    $(`${formId} div.event-form-buttons button.btn-form-submit`).click()
  }
}
