'use strict'

Object.assign(FABrin.prototype,{
addDocument(doc_id){
  this.addToList('documents', doc_id)
}
,
addEvent(ev_id){
  this.addToList('events', ev_id)
}
,
addTime(time){
  this.addToList('times', otime.seconds)
}
,
addBrin(brin_id){
  if(this.id === brin_id){
    return F.notify('Un brin ne peut pas être associé à lui-même, voyons…', {error: true})
  }
  this.addToList('brins', brin_id)
}
,
addToList(list_id, foo_id){
  // console.log("addToList:", list_id, foo_id)
  if(undefined === this.data[list_id] || this.data[list_id].indexOf(foo_id) < 0){
    if (undefined === this.data[list_id]) this.data[list_id] = []
    this.data[list_id].push(foo_id)
    // console.log(`this.data[${list_id}] vaut maintenant:`,this.data[list_id])
    this.modified = true
  } else {
    F.notify(`Le brin est déjà lié à cet élément « ${list_id} ».`)
  }
}
})
Object.defineProperties(FABrin.prototype,{
id:{get(){return this.data.id}}
,
modified:{
  get(){return this._modified || false}
, set(v){
    this._modified = v
    if (true === v) FABrin.modified = true
  }
}
,
title:{get(){return DFormater(this.data.title)}}
,
libelle:{get(){return this.title}} // alias
,
description:{get(){
  if(undefined === this._description){
    if(this.data.description) this._description = DFormater(this.data.description)
    else this._description = null
  }
  return this._description
}}
,
documents:{
  get(){return this.data.documents || []}
, set(v){this.data.documents = v}
}
,
events:{
  get(){return this.data.events || []}
, set(v){this.data.events = v}
}
,
times:{
  get(){return this.data.times || []}
, set(v){this.data.times = v}
}
// Retourne la liste des events, sans les scènes
, eventsByScenes:{
    get(){return this.events.filter(ev => ev.type == 'scene' && ev.isRealScene())}
  }
,
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
scenes:{
  get(){
    if(undefined === this._scenes){
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
          qsc = ev.scene
          arr[sc.numero] = sc
        }
        else {
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
})
