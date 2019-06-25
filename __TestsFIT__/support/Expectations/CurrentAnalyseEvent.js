'use strict'

global.CurrentAnalyseEvent = class {
// ---------------------------------------------------------------------
//  PUBLIC METHODS

/*
  @method CurrentAnalyseEvent#clickEditButton()
  @description Simule le clic souris sur le bouton d'édition dans le reader
 */
clickEditButton(){
  this.btnEditReader.click()
}


// ---------------------------------------------------------------------
constructor(analyse, event){
  this.a = analyse
  this.event = event // l'event de référence (classe FAEvent)
}

get jqReader(){return $(`#reader #reader-event-${this.id}`)}
// Le bouton dans le reader pour éditer l'event
get btnEditReader(){return this.jqReader.find('div.e-tools button.btn-edit')}
// Le bouton dans le reader pour jouer l'event
get btnPlayReader(){return this.jqReader.find('div.e-tools button.btn-play')}
get jqTimeline(){return $(`#banctime-tape #banctime-event-${this.id}`)}
get type(){return this.event.type}
get id(){return this.event.id}
}
