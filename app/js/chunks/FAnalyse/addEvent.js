'use strict'

/**
  Ajout d'un event

  Noter que maintenant la procédure ne s'occupe plus du chargement de
  l'analyse (depuis la version 0.5.2).
**/
let addEvent = function(nev){
  if(isUndefined(this.ids)){
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

  // Puisque c'est une vraie création, on doit ajouter cet élément à la
  // TimeMap
  TimeMap.addEvent(nev)

  // C'est une vraie création, pas une instanciation au
  // rechargement de l'analyse. Donc on ajoute le nouvel event dans le reader
  // et sur le banc timeline
  this.reader.append(nev)
  BancTimeline.append(nev)

  // Si le nouvel event est une scène, il faut peut-être numéroter
  // les suivantes
  if(nev.type === STRscene){
    FAEscene.updateAll()
    FADecor.resetAll()
  }
  // Si le nouvel event est un noeud structurel, il faut l'enregistrer
  // dans les données du paradigme de Field
  if(nev.type === STRstt){
    // note : le PFA est toujours chargé
    // => On peut placer le nouveau noeud directement
    //    dans les données et les enregistrer
    let pfa = this.PFA.get(nev.idx_pfa)
    var d = pfa.data
    d[nev.sttID] = {event_id: nev.id, stt_id: nev.sttID}
    pfa.data = d
    pfa.save()
    pfa.update() // seulement si déjà ouvert
  }

  // On place tout de suite l'évènement sur le reader
  nev.show()
  this.modified = true
  // On ajoute l'event à la liste des modifiés du jour (du moment)
  FAEvent.addModified(nev)
  //  On reset
  nev = null
  idx_event_before = null

}

module.exports = addEvent
