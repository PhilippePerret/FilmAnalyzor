'use strict'
/**
 * Object Reader
 * --------------
 * Pour la lecture de l'analyse
 */

class FAReader {

// Constante déterminant le temps qu'il faut laisser avant et après le
// temps courant. Les events avant tempsCourant-TIME_AROUND et les events
// après tempsCourant + TIME_AROUND seront masqués (mais laissés dans le DOM)
// TODO Plus tard, cette constante devra devenir une préférence qu'on peut
// régler.
static get TIME_AROUND(){ return 5 * 60 }

static reset(){
  UI.sectionReader.html('')
}


static get a(){return current_analyse}

// ---------------------------------------------------------------------
//  INSTANCE

constructor(analyse){
  this.a = analyse
}

/**
 * Initialisation de l'instance FAReader
 */
init(){
  this.show().hide()
}
show(){this.fwindow.show(); return this}
hide(){this.fwindow.hide(); return this}
build(){
  return DCreate(DIV, {id:'titre-reader-to-remove', inner: 'LECTEUR', class: 'fw-title'})
}
afterBuilding(){
  $('#titre-reader-to-remove').remove()
}

/**
  Toutes les secondes, on va vérifier si le temps courant survole
  l'item +item+ (event ou image). Si c'est le cas, on le met en exergue.
  Si le temps de fin de l'item est dépassé depuis plus de cinq seconde,
  on le fait disparaitre et on arrête de le surveiller.

  Noter que ça ne le fait que lorsqu'il est visible.

  @param {FAEvent|FAImage} item   Image ou event à surveiller
**/
startWatchingItems(item){
  this.timerWatchingItems = setInterval(this.revealAndHideElements.bind(this), 1000)
}

revealAndHideElements(){
  // console.log("-> revealAndHideElements")

  // On prend les events courants qui commencent et on les affiche
  TimeMap.allStartAt(this.currentTime).map( he => {
    console.log("Reader revèle : ", he)
    $(`#reader-${TYP_TIMEMAP_TO_TYP[he.type]}-${he.id}`).show()
  })

  // On prend les events courants qui finissent et on les affiche
  TimeMap.allEndAt(this.currentTime).map( he => {
    console.log("Reader masque : ", he)
    $(`#reader-${TYP_TIMEMAP_TO_TYP[he.type]}-${he.id}`).hide()
  })

  // console.log("<- revealAndHideElements")
}
stopWatchingItems(){
  if ( isDefined(this.timerWatchingItems) ) {
    clearInterval(this.timerWatchingItems)
    delete this.timerWatchingItems
  }
}

/**
  Révèle et masque les éléments au point temps +curt+. Contrairement à la
  méthode `revealAndHideElements` qui fonctionne toutes les secondes, celle-ci
  permet d'afficher les éléments visibles à un moment M quelconques.
**/
revealAndHideElementsAt(curt) {
  TimeMap.allAt(curt).map( he => {
    $(`#reader-${TYP_TIMEMAP_TO_TYP[he.type]}-${he.id}`).show()
    if ( he.scene ) {
      this.a.locator.actualizeMarkScene(curt)
    } else if ( he.stt ) {

    }
  })
}

get currentTime(){ return this.a.locator.currentTime }

/**
  Quand on charge une autre analyse, il faut détruire le
  reader de l'analyse courante.
  Ce qui revient à détruire sa flying-window.
**/
remove(){ this.fwindow.remove() }

/**
  Vide tout le reader
  Ne pas la confondre avec la méthode `resetBeyond` suivante
 */
reset(){ this.reader.html('')}

/**
  Lorsqu'une analyse est chargée, on appelle cette méthode pour mettre
  tous les éléments dans le reader. Il s'agit pour le moment :
    - des events (avec les scènes comme event particulier)
    - les images
    - les marqueurs

  Note : on n'utilise pas la méthode this.append qui vérifierait chaque
  fois l'emplacement. Ici, on peut les mettre les uns après les autres
**/
peuple(){

  // Boucle pour écrire tous les events
  this.a.forEachEvent(ev => {
    this.reader.append(ev.div)
    ev.observe()
    ev.jqReaderObj.hide()
  })

  // Boucle pour écrire toutes les images et tous les markers
  let aImages   = FAImage.byTimes.map( himg => FAImage.get(himg.id) )
    , aMarkers  = [...this.a.markers.arrayItems]
  var nextImage, nextMarker, o, time

  nextImage   = aImages.shift()
  nextMarker  = aMarkers.shift()

  this.reader.find('> div').each( (i, o) => {
    if ( isUndefined(nextImage) && isUndefined(nextMarker)) return // accélération
    o = $(o)
    time = parseFloat(o.data(STRtime))
    if ( nextImage && time > nextImage.time ) {
      $(nextImage.div).insertBefore(o)
      nextImage.observe()
      nextImage.jqReaderObj.hide()
      nextImage = aImages.shift()
    }
    if ( nextMarker && time > nextMarker.time ) {
      $(nextMarker.divReader).insertBefore(o)
      nextMarker = aMarkers.shift()
    }
  })

}

/**
 * Vide le reader, mais seulement en supprimant les évènements qui se trouvent
 * avant +from_time+ et après +to_time+
 *
 * Note : les temps sont exprimés en temps par rapport au film, pas par
 * rapport à la vidéo (comme tous les temps normalement)
 */
resetBeyond(from_time, to_time){
  var ti, id, my = this
  this.forEachEventNode(function(o){
    ti  = parseFloat(o.getAttribute(STRdata_time))
    id  = parseInt(o.getAttribute(STRdata_id),10)
    if ( ti < from_time || ti > to_time){my.analyse.ids[id].hide()}
  })
}

/**
  Ajout d'un event dans le reader

  L'event est placé au bon endroit par rapport à son temps

  @param {FAEvent(typé)} ev Event qu'il faut insérer
**/
append(ev){
  let my = this
    , div = ev.div

  if(!div.id.startsWith('reader-')){
    log.warn(`L'identifiant de l'élément suivant devrait commencer par 'reader-' (${div.id}):`, div)
    div.id = `reader-${div.id}`
  }

  // On cherche à placer l'event au meilleur endroit temporel
  var hasBeenInserted = false
  this.forEachEventNode(function(ne){
    if(parseFloat(ne.getAttribute(STRdata_time)) > ev.time){
      hasBeenInserted = true
      my.reader.insertBefore(div, ne)
      return false // pour interrompre la boucle
    }
  })
  hasBeenInserted || this.reader.append(div)

  // Pour observer l'event dans le reader
  ev.observe()
}

/**
  Exécuter une boucle sur les noeuds d'event du reader
  en exécutant la méthode +fn+ qui peut retourner false
  pour interrompre la boucle.

  @param {Function} fn  La méthode à utiliser pour boucler
                        Son premier argument est le node
**/
forEachEventNode(fn){
  let my = this
    , eventNodes  = this.eventNodes
    , nb_nodes    = eventNodes.length
    , i = 0
  for(;i<nb_nodes;++i){if(isFalse(fn(eventNodes[i]))) break}
}

/**
  Boucle sur chaque noeud du reader, mais en tant qu'event
  contrairement à la méthode précédente.
**/
forEachEvent(fn){
  let my = this
    , eNodes    = this.eventNodes
    , nb_nodes  = eNodes.length
    , i = 0
    , no, ev
  for(;i<nb_nodes;++i){
    no = eNodes[i]
    ev = this.a.ids[parseInt(no.getAttribute(STRdata_id),10)]
    if(isUndefined(ev)){
      console.error("[Dans FAReader#forEachEvent], l'event d'id suivant est inconnu :", no.getAttribute(STRdata_id))
    } else {
      if(isFalse(fn(ev))) break
    }
  }
}

get eventNodes(){
  // return $('#reader > div.event')
  // ERREUR CI-DESSOUS CAR D'AUTRES ÉLÉMENTS, DANS LES ÉLÉMENTS, PORTENT
  // LA CLASSE .event. DANS L'IDÉAL, IL FAUT QUE LES ÉLÉMENTS DE PREMIER
  // NIVEAU PORTENT UNE CLASSE VRAIMENT UNIQUE (p.e. reader-event)
  return this.reader.find('.reader-event')
}
/**
 * Méthode qui permet d'afficher tous les events d'un coup
 */
displayAll(){
  this.a.forEachEvent(function(ev){ev.show()})
}

// ---------------------------------------------------------------------
//  DOM ELEMENTS
get fwindow(){
  return this._fwindow || defP(this,'_fwindow', new FWindow(this, {id:'reader', name:ReaderFWindowName, draggable:false, container:UI.sectionReader, x:0, y:0}))
}
get reader(){return this._reader || defP(this,'_reader', this.fwindow.jqObj)}

}
