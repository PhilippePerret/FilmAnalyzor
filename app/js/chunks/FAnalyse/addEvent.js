'use strict'

/**
  Ajout d'un event

  Noter que maintenant la procédure ne s'occupe plus du chargement de
  l'analyse (depuis la version 0.5.2).
**/
let addEvent = function(nev){
  if(undefined === this.ids){
    this.events = []
    this.ids    = {}
  }
  if (this.events.length){
    // On place l'event à l'endroit voulu dans le film
    var idx_event_before = this.getIndexOfEventAfter(nev.time)
    this.events.splice(idx_event_before, 0, nev)
  } else {
    this.events.push(nev)
  }
  this.ids[nev.id] = nev

  // C'est une vraie création, pas une instanciation au
  // rechargement de l'analyse.
  this.locator.addEvent(nev)
  // Si le nouvel event est une scène, il faut peut-être numéroter
  // les suivantes
  if(nev.type === 'scene'){
    FAEscene.updateAll()
    FADecor.resetAll()
  }
  // Si le nouvel event est un noeud structurel, il faut l'enregistrer
  // dans les données du paradigme de Field
  if(nev.type === 'stt'){
    // note : le PFA est toujours chargé
    // => On peut placer le nouveau noeud directement
    //    dans les données et les enregistrer
    var d = this.PFA.data
    d[nev.sttID] = {event_id: nev.id, stt_id: nev.sttID}
    this.PFA.data = d
    this.PFA.save()
    this.PFA.update() // seulement si déjà ouvert
  }

  // On place tout de suite l'évènement sur le reader
  nev.show()
  this.modified = true
  // On ajoute l'event à la liste des modifiés du moment
  FAEvent.addModified(nev)
  //  On reset
  nev = null
  idx_event_before = null

}

module.exports = addEvent
