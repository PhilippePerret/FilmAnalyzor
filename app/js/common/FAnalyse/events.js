'use strict'

Object.assign(FAnalyse.prototype, {

/**
  Retourne l'event d'identifiant +eid+
**/
  getEventById(eid){
    return this.ids[eid]
  }

/**
  Méthode appelée à la modification d'un event

  [1]  En règle générale, si une opération spéciale doit être faite sur
      l'event, il vaut mieux définir sa méthode d'instance `onModify` qui
      sera automatiquement appelée après la modification.

*/
, updateEvent(ev, options){
    log.info("-> FAnalyse#updateEvent")
    var new_idx = undefined
    if (options && options.initTime != ev.time){
      // Quand le temps initial de l'event est différent de son nouveau temps
      var idx_init      = this.indexOfEvent(ev.id)
      var next_ev_old   = this.events[idx_init + 1]
      var idx_new_next  = this.getIndexOfEventAfter(ev.time)
      var next_ev_new   = this.events[idx_new_next]
      if( next_ev_old != next_ev_new){
        // => Il faut replacer l'event au bon endroit
        this.events.splice(idx_init, 1)
        var new_idx = this.getIndexOfEventAfter(ev.time)
        this.events.splice(new_idx, 0, ev)
      }
    }
    // [1]
    if (ev.type === STRscene){
      FAEscene.updateAll()
      FADecor.resetAll()
    }

    // Il faut aussi replacer l'event dans le banc-timeline
    ev.updateInTimeline()

    // On actualise tous les autres éléments (par exemple l'attribut data-time)
    ev.updateInUI()

    // S'il est affiché, il faut updater son affichage dans le
    // reader (et le replacer si nécessaire)
    ev.updateInReader(new_idx)

    // Et enfin on actualise l'état d'avancement
    FAStater.update()
    next_ev_old = null
    next_ev_new = null

    // On marque l'analyse modifiée
    this.modified = true

    log.info("<- FAnalyse#updateEvent")
  }

/**
  Création d'un event
**/
, addEvent(nev) {
    if ( this.locked ) return F.notify(T('analyse-locked-no-save'));

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
    if( nev.isAScene ){
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

    FAStater.update()

  }// /addEvent


, destroyEvent(event_id, form_instance){

    // On prend l'event à détruire
    var ev = this.ids[event_id]

    // Destruction dans la liste `events`
    // ----------------------------------
    // console.log("this.events avant:", Object.assign([], this.events))
    // console.log("Index de l'évènement à détruire : ", this.indexOfEvent(event_id))
    this.events.splice(this.indexOfEvent(event_id),1)
    // console.log("this.events après:", this.events)

    // Destruction dans la timeline et sa map
    BancTimeline.remove(ev)

    // Destruction dans le reader
    this.reader.removeItem(ev)

    // Destruction dans la table par clé identifiants
    // delete this.ids[event_id] // ça ne sert à rien
    this.ids[event_id] = undefined

    // Si c'est une scène, il faut la retirer de la liste des
    // scène et updater les numéros
    if(ev.type === STRscene){

      // Cas particulier de la destruction d'une scène
      FAEscene.destroy(ev.numero)

      // Il faudra forcément actualiser la liste des décors
      FADecor.resetAll()

    } else if (ev.type === STRstt){
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

    FAStater.update()

  } // /destroyEvent

})
