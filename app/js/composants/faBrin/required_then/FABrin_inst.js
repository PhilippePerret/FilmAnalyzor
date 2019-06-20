'use strict'

Object.defineProperties(FABrin.prototype,{
  id:{get(){return this.data.id}}

, domId:{get(){return this._domId||defP(this,'_domId',`brin-${this.id}`)}}

, modified:{
    get(){return this._modified || false}
  , set(v){
      this._modified = v
      if (true === v) this.constructor.modified = true
    }
  }

, title:{get(){return DFormater(this.data.title)}}

, libelle:{get(){return this.title}} // alias

, description:{get(){
    if(undefined === this._description){
      if(this.data.description) this._description = DFormater(this.data.description)
      else this._description = null
    }
    return this._description
  }}

// Retourne la liste des events, sans les scènes
, eventsByScenes:{
    get(){return this.events.filter(ev => ev.type == STRscene && ev.isRealScene())}
  }

/**
  Retourne la liste des scènes du brin.
  Cette méthode est indispensable à l'instance FAStats pour les calculs de
  statistiques.
  Mais ce comptage des scènes, pour les brins, est assez compliqué, puisqu'il
  y a les scènes auxquelles il appartient par la scène elle-même, mais il y a
  aussi les scènes des éléments associés, qui ne sont pas des event.scene.
  Par convention, on ne tient pas compte des documents, qui ne peuvent pas
  avoir de durée à proprement parler.

  @return {Array of FAEscene} Liste des instances scène du brin
**/
, scenes:{
    get(){
      if( isUndefined(this._scenes)){
        // Note : on met d'abord les scènes dans une table avec en clé le
        // numéro de la scène, pour ne pas les doubler ou avoir à vérifier
        var sc, arr = {}, ev
        for(var time of this.times){
          sc = FAEscene.at(time)
          arr[sc.numero] = sc
        }
        for(var ev_id of this.events){
          ev = this.a.ids[ev_id]
          if(ev){
            sc = ev.scene
            // La scène n'est peut-être pas définie.
            if(sc) arr[sc.numero] = sc
          }
          else if (!FAEvent.exists(ev_id)){// il peut être en création
            console.error(`GRAVE PROBLÈME : l'event #${ev_id} n'existe pas dans l'analyse… Or il est associé à un brin. L'analyse doit être corrigée.`)
          }
        }
        this._scenes = Object.values(arr)
        arr = null
      }
      return this._scenes
    }
  }

, stats:{get(){return this._stats||defP(this,'_stats',new FAStats(this))}}

// Retourne le div de la minitimeline pour le brin
, miniTimeline:{
    get(){
      return new MiniTimeline(this, {scenes: this.scenes, times: this.times, events: this.eventsByScenes})
        .build({suff_id: this.id})
    }
  }

})//defineProperties
