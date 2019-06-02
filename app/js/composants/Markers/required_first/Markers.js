'use strict'
/**
  Note : avec les deux classes, j'inaugure le fait d'avoir
  deux classes :
    - Markers pour la liste des markeurs de l'analyse
    - Marker  pour les instances de marqueurs
**/
class Markers {
/**
  Pour la propriété `markers` de l'analyse (du locator ?)
**/
constructor(analyse){
  this.a      = analyse
  this.items  = {}
}

/**
  Pour boucler sur tous les markers
**/
each ( fn ) {
  for ( var idm in this.items ) {
    if ( isFalse( fn(this.items[idm]) ) ) break
  }
}
/**
  Pour créer un nouveau marker
**/
createNew(){
  let my = this
  prompt("Nom du nouveau marqueur :", {
      defaultAnswer: ''
    , buttons:['Renoncer','Créer le marqeur']
    , defaultButtonIndex:1
    , cancelButtonIndex:0
    , okButtonIndex:1
    , methodOnOK: (title, indexButtonClicked) => {
        let m = new Marker(my.a, {time: my.a.locator.currentTime.vtime, title:title})
        m.create()
      }
  })
}

/**
  Pour faire une boucle sur les marqueurs
**/
forEach(fn){
  for( const marker of this.arrayItems ){
    if ( isFalse(fn(marker) ) ) break // pour interrompre
  }
}
forEachReverse(fn){
  for( const marker of this.arrayItemsReverse.reverse() ){
    if ( isFalse(fn(marker) ) ) break // pour interrompre
  }
}

/**
  Sauvegarde des marqueurs de l'analyse
**/
save(noMessage){
  this.contents = this.getData()
  this.iofile.save({after: this.afterSave.bind(this, noMessage)})
}
afterSave(noMessage){
  noMessage || F.notify("Marqueurs enregistrés.")
}

/**
  Chargement des marqueurs de l'analyse (if any)
**/
load(){
  this.items = {}
  delete this._arritems
  if ( this.iofile.exists() ) {
    this.iofile.loadSync().forEach( item => {
      this.items[item.id] = new Marker(this.a, item)
    })
  }
  return this // chainage
}
// Construction de tous les marqueurs
build(){
  this.arrayItems.forEach(marker => marker.build())
}

/**
  Ajout d'un marqueur pour l'analyse
**/
add(marker){
  this.items[marker.id] = marker
  this.reset()
  this.save()
}

reset(){
  delete this._arritems
  delete this._arritemsreverse
}

/**
  Fait du marker +marker+ le marker courant (et déselectionne éventuellement
  le marqueur courant s'il existe.)
**/
setCurrent(marker){
  isDefined(this.current) && this.current.deselect()
  this.current = marker
}

/**
  Pour ne pas avoir à créer des nouvelles instances chaque fois

  Noter que time est un temps par rapport à la vidéo, donc elle
  doit renseigner la propriété `vtime` du OTime
**/
otime(time){
  defaultize(this,'_otime', new OTime(0))
  this._otime.vtime = time
  return this._otime
}

selectMarkerAfter(otime){ this.selectMarker(otime, false) }
selectMarkerBefore(otime){ this.selectMarker(otime, true) }
selectMarker(otime, before){
  var time = this[`item${before?'Before':'After'}Time`](otime.vtime)
  time && this.a.locator.setTime(this.otime(time))
  time || F.notify(`Aucun marqueur n'a été trouvé ${before?'avant':'après'} ${otime}.`)
}

/**
  Retourne le marker se trouvant après le temps +otime+ (ou undefined)

  En fait, retourne le temps vidéo en seconds
**/
itemAfterTime(vtime){
  var timeFound
  this.forEach( marker => {
    if ( Math.floor(marker.time) > vtime ) {
      timeFound = parseInt(marker.time, 10)
      return false
    }
  })
  return timeFound
}
/**
  Retourne le marker se trouvant avant le temps +otime+ (ou undefined)
**/
itemBeforeTime(vtime){
  var timeFound
  this.forEachReverse( marker => {
    if ( Math.ceil(marker.time) < vtime ) {
      timeFound = parseInt(marker.time,10)
      return false
    }
  })
  return timeFound
}

getData(){
  return this.arrayItems.map( marker => marker.data)
}

get arrayItems(){
  if ( isUndefined(this._arritems) ) {
     this._arritems = Object.values(this.items)
     this._arritems.sort( (a, b) => a.time > b.time )
  }
  return this._arritems
}
get arrayItemsReverse(){
  if ( isUndefined(this._arritemsreverse) ) {
    this._arritemsreverse = [...this.arrayItems]
    this._arritemsreverse.reverse()
  }
  return this._arritemsreverse
}


// iofile pour enregistrement et chargement
get iofile(){return this._iofile || defP(this,'_iofile', new IOFile(this))}
// Path du fichiers des marqueurs
get path(){return this._path||defP(this,'_path', path.join(this.a.folder,'markers.json'))}
}
