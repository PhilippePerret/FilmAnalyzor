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
static get TIME_AROUND(){ return 5*60 }

static reset(){
  $('section#section-reader').html('')
}

// ---------------------------------------------------------------------
//  INSTANCE

constructor(analyse){
  this.analyse = this.a = analyse
}

/**
 * Initialisation de l'instance FAReader
 */
init(){
  // Rien pour le moment
}
show(){this.fwindow.show()}
hide(){this.fwindow.hide()}
build(){
  return DCreate('DIV', {inner: 'LECTEUR', class: 'fw-title'})
}
afterBuilding(){
  // Peut-être supprimer le div ci-dessus avec READER dedans
}

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
reset(){ this.container.innerHTML = ''}

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
    ti  = parseFloat(o.getAttribute('data-time'))
    id  = parseInt(o.getAttribute('data-id'),10)
    if ( ti < from_time || ti > to_time){my.analyse.ids[id].hide()}
  })
}

/**
  Ajout d'un event dans le reader

  L'event est placé au bon endroit par rapport à son temps

  @param {FAEvent(typé)} ev Event qu'il faut insérer
**/
append(ev){
  var my = this
    , hasBeenInserted = false
  this.forEachEventNode(function(ne){
    if(parseFloat(ne.getAttribute('data-time')) > ev.time){
      hasBeenInserted = true
      my.container.insertBefore(ev.div, ne)
      return false // pour interrompre la boucle
    }
  })
  hasBeenInserted || this.container.append(ev.div)
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
  for(;i<nb_nodes;++i){if(false === fn(eventNodes[i])) break}
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
    ev = this.a.ids[parseInt(no.getAttribute('data-id'),10)]
    if(undefined === ev){
      console.error("[Dans FAReader#forEachEvent], l'event d'id suivant est inconnu :", no.getAttribute('data-id'))
    } else {
      if(false === fn(ev)) break
    }
  }
}

get eventNodes(){
  // return $('#reader > div.event')
  // ERREUR CI-DESSOUS CAR D'AUTRES ÉLÉMENTS, DANS LES ÉLÉMENTS, PORTENT
  // LA CLASSE .event. DANS L'IDÉAL, IL FAUT QUE LES ÉLÉMENTS DE PREMIER
  // NIVEAU PORTENT UNE CLASSE VRAIMENT UNIQUE (p.e. reader-event)
  return this.container.querySelectorAll('.reader-event')
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
  return this._fwindow || defP(this,'_fwindow', new FWindow(this, {id: 'reader', container: this.section, x: ScreenWidth - 650, y: 4}))
}
get container(){
  return this._container || defP(this,'_container', DGet('reader'))
}
get section(){
  return this._section || defP(this,'_section', DGet('section-reader'))
}
}
