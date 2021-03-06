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
  Pour faire une boucle sur les marqueurs classés par temps
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
        let m = new Marker(my.a, {id:this.newId(), time: my.a.locator.currentTime.vtime, title:title})
        m.create()
        delete this.kwindow
      }
  })
}
/**
  Pour éditer le marker d'identifiant +marker_id+. L'éditer consiste simplement
  à pouvoir changer son nom. Pour régler son temps, il suffit de le déplacer
  sur la TimeRuler.

  @param {Number} marker_id ID du marker à éditer
**/
edit(marker_id) {
  let marker = this.items[marker_id]
  isDefined(marker) || raise(T('marker-undefined', {id:marker_id}))
  prompt({
      message: 'Nouveau nom du marker :'
    , defaultAnswer: marker.title
    , methodOnOK: this.execModification.bind(this, marker)
  })
}
execModification(marker, newTitle) {
  // F.notify(`Modifier le marker "${marker}" avec le titre "${newTitle}"`)
  newTitle = newTitle.trim()
  if ( marker.title !== newTitle) {
    marker.title = newTitle
    this.save()
    if ( this.kwindow ) this.kwindow.update(this.kwindowItems())
  }
}
// Retourne un nouvel ID unique pour un marqueur
newId(){
  isDefined(this.lastId) || ( this.lastId = 0 )
  return ++ this.lastId
}

/**
  Sauvegarde des marqueurs de l'analyse
**/
save(noMessage){
  this.contents = this.getData()
  this.iofile.save({after: this.afterSave.bind(this, noMessage)})
}
afterSave(noMessage){
  // noMessage || F.notify("Marqueurs enregistrés.")
}

/**
  Chargement des marqueurs de l'analyse (if any)
**/
load(){
  log.info("-> Markers.load")
  this.items  = {}
  this.lastId = 0
  delete this._arritems
  if ( this.iofile.exists() ) {
    this.iofile.loadSync().forEach( item => {
      this.items[item.id] = new Marker(this.a, item)
      if ( item.id > this.lastId ) this.lastId = item.id
    })
  }
  // console.log("this.items:", this.items)
  // console.log("this.lastId:", this.lastId)
  log.info("<- Markers.load")
  return this // chainage
}
// Construction de tous les marqueurs sur le banc timeline
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

/**
  Pour supprimer un marqueur
**/
remove(marker){
  if ( this.current === marker ) delete this.current
  delete this.items[marker.id]
  marker.jqReaderObj.remove()
  marker.jqObj.remove()
  this.reset()
  this.save()
  return true
}

reset(){
  delete this._arritems
  delete this._arritemsreverse
  return this
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

/**
  Méthode pour sélectionner le marker avant ou après
**/
selectMarkerAfter(otime){ this.selectMarker(otime, false) }
selectMarkerBefore(otime){ this.selectMarker(otime, true) }
selectMarker(otime, before){
  var marker = this[`item${before?'Before':'After'}Time`](otime.vtime)
  if ( isDefined(marker) ) this.a.locator.setTime(marker.otime)
  else F.notify(`Aucun marqueur n'a été trouvé ${before?'avant':'après'} ${otime}.`)
}

/**
  Retourne le marker se trouvant après le temps +otime+ (ou undefined)
**/
itemAfterTime(vtime){
  var markerFound
  this.forEach( marker => {
    if ( Math.floor(marker.time) > vtime ) {
      markerFound = marker
      return false
    }
  })
  return markerFound
}
/**
  Retourne le marker se trouvant avant le temps +otime+ (ou undefined)
**/
itemBeforeTime(vtime){
  var markerFound
  this.forEachReverse( marker => {
    if ( Math.ceil(marker.time) < vtime ) {
      markerFound = marker
      return false
    }
  })
  return markerFound
}

getData(){
  return this.arrayItems.map( marker => marker.data)
}

/**
  Retourne la liste des marqueurs, classée par temps
**/
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
