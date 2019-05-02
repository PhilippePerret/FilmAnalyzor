'use strict'

// TODO
// Si un event détruit était un event structurel, il faut modifier
// la données pfa.json
const destroyEvent = function(event_id, form_instance){
  var ev = this.ids[event_id]

  // Destruction dans la liste events
  // console.log("this.events avant:", Object.assign([], this.events))
  // console.log("Index de l'évènement à détruire : ", this.indexOfEvent(event_id))
  this.events.splice(this.indexOfEvent(event_id),1)
  // console.log("this.events après:", this.events)

  // Destruction dans la table par clé identifiants
  delete this.ids[event_id]
  this.ids[event_id] = undefined

  // Si c'est une scène, il faut la retirer de la liste des
  // scène et updater les numéros
  if(ev.type === 'scene'){

    // Cas particulier de la destruction d'une scène
    FAEscene.destroy(ev.numero)

    // Il faudra forcément actualiser la liste des décors
    FADecor.resetAll()

  } else if (ev.type === 'stt'){
    // Cas particulier de la destruction d'un event de structure (qui doit
    // donc être en relation avec un sttNode)
    ev.sttNode.event = undefined
    // Il faut le supprimer des données du PFA (et peut-être actualiser
      // le PFA s'il est affiché)
      delete this.PFA.data[ev.sttID] // = undefined
      this.PFA.save()
      this.PFA.update()
  }


  // On peut détruire l'instance du formulaire
  form_instance = undefined

  // On peut détruire tous les clones qui seraient affichés en utilisant
  // la classe 'EVT<id event>' faite pour ça
  $(`.EVT${event_id}`).remove()

  // On l'ajoute dans la liste des modifiés. Noter qu'au moment de
  // sauver cette « liste des modifiés », FAEvent ne trouvera pas cet
  // event. C'est de cette manière qu'elle saura qu'il a été détruit.
  FAEvent.addModified(event_id)

  F.notify("Event détruit avec succès.")

  this.modified = true
}


module.exports = destroyEvent
