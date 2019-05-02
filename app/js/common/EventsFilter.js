'use strict'
/**
  Filtre des events
  ------------------

  USAGE
  =====

  var efilter = new EventsFilter(this, {filter: <filter>})

  avec <filter> = {é
    eventTypes:   Liste Array des types retenus
    fromTime:     Temps en seconde de start
    toTime:       Temps en seconde de fin
    invert:       Pour inverser tous les choix (exclusion)
  }

  =é

  Par exemple, pour filtrer seulement les scènes :
  var sceneFilter = new EventsFilter(this, {filter:{eventType:['scene']}})

**/
class EventsFilter {

// ---------------------------------------------------------------------
//  INSTANCE

constructor(owner, args){
  this.owner  = owner
  this.args   = args
  this.filter = (args && args.filter) || {}

  this.prepareFilter()
}

/**
  Boucle sur les events filtrés

  Note : on peut interrompre la boucle en faisant retourner
  la valeur false à la méthode. Mais la valeur undefined ne
  mettra pas fin à la boucle

**/
forEachFilteredEvent(method){
  for(var ev of this.filtereds){
    if(false === method(ev)) break
  }
}
get forEachFiltered(){ return this.forEachFilteredEvent.bind(this) }

/**
  Retourne la liste des filtrés
**/
get filtereds(){
  let my = this
    , fn_texte        // fonction pour chercher le texte
  // console.log("-> EventFilter#filtereds", this.filter)
  if(undefined === this._filtereds){
    this._filtereds = []

    // Ce qu'il faut checker
    var checkType   = my.eventTypes != null
      , checkTimes  = my.fromTime!=null && my.toTime!=null
      , checkPersos = my.withPersonnages != null
      , checkText   = my.withText != null

    this.a.forEachEvent(function(ev){
      // console.log("Event : ",ev)
      if(checkType && my.isFalse(my.hTypes[ev.type]))        return
      // console.log("      : type OK")
      if(checkTimes && my.isFalse(ev.time >= my.fromTime))    return
      // console.log("      : time from OK")
      if(checkTimes && my.isFalse(ev.time <= my.toTime))      return
      // console.log("      : time to OK")
      if(checkPersos && my.isFalse(my.filtrePersonnages(ev))) return
      // console.log("      : personnages OK")
      if(checkText && my.isFalse(my.filtreText(ev)))          return
      // console.log("      : texte OK")
      // console.log("   RETENU")
      my._filtereds.push(ev)
    })
  }
  my = null
  if(this._filtereds.length === 0){
    F.notify(T('no-event-with-filter'))
  }
  return this._filtereds
}

/**
  @return {function}  Une fonction qui permet de filtrer les events par
                      leur texte. Pour le moment, on le cherche seulement
                      dans le `content` et le `titre`
**/
get filtreText(){
  if (undefined === this._filtreText){
    let my = this
    if(my.withText){
      if(my.withText.regular){
        // Une recherche par expression régulière
        this._filtreText = function(ev){
          return !!(ev.titre + ' ' + ev.content).match(new RegExp(my.withText.search), my.withText.caseSensitive ? '' : 'i')
        }
      } else {
        // Une recherche explicite

        let search = my.withText.search
        if (!my.withText.caseSensitive) search = search.toLowerCase()
        this._filtreText = function(ev){
          var inText = ' ' + ev.titre + ' ' + ev.content
          if (!my.withText.caseSensitive) inText = inText.toLowerCase()
          return inText.indexOf(search) > -1
        }
      }
    } else {
      // Sinon, on renvoie toujours true
      this._filtreText = function(ev){return true}
    }
  }
  return this._filtreText
}

get filtrePersonnages(){
  let my = this
  if(undefined === this._filtrePersonnages){
    if(my.withPersonnages){
      // Il faut faire la liste de tous les diminutifs des personnages
      // recherchés
      var dims = []
      for(var pid of my.withPersonnages.list){
        dims.push(FAPersonnage.get(pid).dim)
      }
      if(my.withPersonnages.all){
        my.withPersonnages.regulars = []
        for(var dim of dims){
          my.withPersonnages.regulars.push(new RegExp(`@${dim}([^a-zA-Z0-9_]|$)`))
        }
      } else {
        // Expression régulière quand 'all' (personnages) est faux et qu'on cherche
        // donc à ne trouver qu'au moins un personnage.
        my.withPersonnages.regulars = [
          new RegExp(`@(${dims.join('|')})([^a-zA-Z0-9_]|$)`)
        ]
      }
      this._filtrePersonnages = function(ev){return ev.hasPersonnages(my.withPersonnages)}
      // console.log("my.filter.with_personnages:", my.filter.with_personnages)
    } else {
      this._filtrePersonnages = function(ev){return true}
    }
  }
  return this._filtrePersonnages
}

/**
  Retoune true si la condition +condition+ est fausse, en tenant
  compte de l'inversion.
**/
isFalse(condition){
//   console.log(`
// condition: ${condition}
// invert: ${this.invert}
// this.invert === condition = ${this.invert === !!condition}
//     `)
  return this.invert === !!condition
}

// ---------------------------------------------------------------------
//  Les données du filtre

get fromTime(){ return this.filter.fromTime }
get toTime(){   return this.filter.toTime }
get withPersonnages(){return this.filter.with_personnages}
get withText(){return this.filter.with_text}
get eventTypes(){return this.filter.eventTypes}

// Pour inverser la condition générale
get invert(){
  if(undefined === this._invert){
    if(undefined === this.filter.invert){
      this._invert = false
    } else {
      this._invert = this.filter.invert
    }
  }
  return this._invert
}
/**
  Prépare le filtre
  On prépare le filtre pour qu'ils oit plus rapide. Par exemple,
  pour la liste des types, au lieu d'avoir une liste qu'on
  passe en revue chaque fois pour trouver l'indexOf, on fait
  une table.
**/
prepareFilter(){
  var my = this
  if(my.eventTypes == null) return
  my.hTypes = {}
  my.eventTypes.forEach(function(el){my.hTypes[el] = true})
  my = null
}

get a(){return this._a||defP(this,'_a', current_analyse)}

}// fin de EventsFilter
