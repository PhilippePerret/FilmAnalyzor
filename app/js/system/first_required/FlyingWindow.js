'use strict'
/**
* Pour gérer toutes les fenêtres

USAGE
=====

var fwindow = new FWindow(<owner>, <data>)

Avec <data> qui doit contenir au moins :
  container   L'élément DOM/jQuery devant contenir la flying-window
  Valeurs optionnelles
  --------------------
  id          Pour définir un ID précis. Sinon, c'est "fwindow-<X>" qui sera
              utilisé, en incrémentant <X> au nombre de fenêtres à peu près.
  class       La classe CSS à appliquer
  x           Position horizontale (en pixels)
  y           Position verticale (en pixels)
  name        Nom de la fenêtre, simplement utilisée pour le débuggage

Au minimum, le propriétaire, un objet, doit définir les méthodes :
  - `build`   doit retourner l'élément DOM à insérer dans la f-window


Méthodes particulières
----------------------
`observe`
--------
Méthode plaçant les observateurs d'évènements.

`afterBuilding`
--------------
Si on doit procéder à une opération après la construction, par exemple
le peuplement de menu, on peut utiliser la méthode `afterBuilding` dans
le propriétaire, qui sera appelée avant la méthode `observe`.

`onShow`, `onHide`
-----------------
Ces deux méthodes propriétaires sont appelées à la fin de `show` et
de `hide` si elles existent. Elles permettent de faire un traitement particulier
après la fermeture ou l'ouverture de la flying-window.

**/

class FWindow {

// ---------------------------------------------------------------------
//  CLASSES

/**
* Retourne un ID unique (pour la session)
**/
static newId(){
  if (undefined === this.lastId) this.lastId = 0
  return ++this.lastId
}

static newUUID(){
  if(isUndefined(this.lastUUID)) this.lastUUID = 0
  return `FWND${`${++this.lastUUID}`.padStart(6,'0')}`
}

/**
* Gestion de la fenêtre courante, c'est-à-dire
* la fenêtre au premier plan
**/
// Méthode mettant la fenêtre +wf+ en fenêtre au premier plan
static setCurrent(wf, e){
  log.info(`-> FWindow.setCurrent(fwindow ${wf.UUID})`)
  if(wf.isCurrent()){
    log.info(`    ${wf.UUID} est déjà la fenêtre courante`)
  } else {
    log.info(`    ${wf.UUID} doit être mis en fenêtre courante.`)
    if(isDefined(this.current)){
      this.current.bringToBack()
      log.info(`    ${this.current.UUID} en arrière plan.`)
    }
    this.current = wf
    this.current.bringToFront()
    this.stack(wf)
  }
  // console.log("Fenêtre courante = ", wf.UUID)
  // Lire la note N0002 du manuel du développeru
  log.info(`<- FWindow.setCurrent(fwindow #${wf.UUID})`)
}

/**
  stack et unstack, les deux méthodes pour tenir à jour la liste des
  fenêtre ouverte, et pouvoir remettre une fenêtre courante quand on
  supprime une fenêtre.
**/
// Enregistrer une nouvelle fenêtre (à son ouverture, et à son activation,
// donc il faut vérifier si elle est déjà dans le stack)
static stack(fwindow){
  if(this.isReaderOrEventBtns(fwindow)) return
  if(isUndefined(this._stack)) this._stack = []
  this.destack(fwindow)
  this._stack.unshift(fwindow)
  // console.log("_stack dans FWindow::stack", this._stack.map(fw => fw.UUID))
}
// Retirer une fenêtre, à sa fermeture
static unstack(fwindow){
  if(this.isReaderOrEventBtns(fwindow)) return
  this.destack(fwindow)
  isNotEmpty(this._stack) && this.setCurrent(this._stack[0])
  // console.log("_stack dans FWindow::unstack", this._stack.map(fw => fw.UUID))
}

// Retire simplement la fwindow du stack des fenêtres
static destack(fwindow){
  this._stack = this._stack.filter(fw => fw.UUID != fwindow.UUID)
}

static isReaderOrEventBtns(fwindow){
  return fwindow && (fwindow.name === ReaderFWindowName || fwindow.name === BtnsEventFWindowName)
}
/**
* Méthode qui vérifie que la flying-window +wf+ ne soit pas placée
* sur une autre.
**/
static checkOverlaps(wf){
  var {top: refTop, left: refLeft} = wf.jqObj.offset()
  refTop  = Math.round(refTop)
  refLeft = Math.round(refLeft)
  // console.log("refTop/refLeft initiaux:", refTop, refLeft)
  var moveIt = false
  $('.fwindow').each(function(i,w){
    if(w.id == wf.domId) return // c'est la fenêtre qu'on checke
    if(moveIt === true) return  // On sait qu'on doit la bouger
    var {top, left} = $(w).offset()
    top   = Math.round(top)
    left  = Math.round(left)
    if(refTop.isCloseTo(top, 8) || refLeft.isCloseTo(left, 8)){
      // console.log(`Trop près de #${w.id}, refLeft: ${refLeft}`)
      refTop  += 16
      refLeft += 16
      moveIt  = true
    }
  })
  // console.log(`Doit être mise à ${refLeft}px à gauche pour être bien`)
  // Peut-être qu'on l'a déplacée sur une autre
  // => Recommencer jusqu'à ce que ce soit bon
  if(moveIt === true){
    var {top: topParent, left: leftParent} = wf.jqObj.parent().offset()
    refLeft -= Math.round(leftParent)
    refTop -=  Math.round(topParent)
    // console.log("refTop/refLeft corrigés (en fonction des parents) :", refTop, refLeft)
    wf.jqObj.css({left:`${refLeft}px`, top:`${refTop}px`})
    return this.checkOverlaps(wf)
  } else {
    return true
  }
}
static unsetCurrent(wf){
  if(!wf || !this.current) return
  if(this.current.id !== wf.id) return
  this.current.bringToBack()
  delete this.current
}

/**
  Méthode appelée par la touche Escape pour fermer la fenêtre
  courante, si elle existe.
**/
static closeCurrent(){
  if(this.isReaderOrEventBtns(this.current)) return false
  isDefined(this.current) && this.current.hide()
  return true
}

static get current()  {return this._current}
static set current(w) {this._current = w}

// ---------------------------------------------------------------------
//  INSTANCES

/**
* Instanciation d'une nouvelle Flying Window.

  +data+ doit contenir :
    - container     Le container jQuery qui va recevoir la
                    flying window.
    - class         La classe CSS à appliquer à la fwindow
**/
constructor(owner, data){
  try {
    owner || raise('fwindow-required-owner')
    isFunction(owner.build) || raise('fwindow-owner-has-build-function')
    data || raise('fwindow-required-data')
    if(isUndefined(data.container)) data.container = $('body')
    data.container || raise('fwindow-required-container')
    data.container = $(data.container)
    data.container.length || raise('fwindow-invalid-container')
    // owner.FWcontents || data.contents || raise('fwindow-contents-required')
  } catch (e) { throw(T(e)) }

  this.owner = owner
  for(var k in data){this[`_${k}`] = data[k]}
  this.id = data.id || this.constructor.newId()
  this.UUID = this.constructor.newUUID()
  if(data.id) this._domId = data.id
  if(data.name) this.name = data.name
  this.built = false

}

toggle(){
  this[this.visible?'hide':'show']()
}
show(){
  log.info(`-> ${this.ref}.show() [built:${this.built}, visible:${this.visible}]`)
  if(!this.built) this.build().observe()
  isFunction(this.owner.beforeShow) && this.owner.beforeShow()
  this.jqObj.show()
  this.visible = true
  FWindow.setCurrent(this)
  FWindow.checkOverlaps(this)
  isFunction(this.owner.onShow) && this.owner.onShow()
  log.info(`<- ${this.ref}.show() [built:${this.built}, visible:${this.visible}]`)
}
hide(){
  if(isFunction(this.owner.beforeHide)){
    if(this.owner.beforeHide() === false) return // abandon
  }
  this.constructor.unsetCurrent(this)
  // Dans tous les cas, il faut retirer cette fenêtre de la liste des
  // fenêtres
  this.constructor.unstack(this)
  this.jqObj.hide()
  this.visible = false
  isFunction(this.owner.onHide) && this.owner.onHide()
}

/**
  Actualisation demandée de la fenêtre

  On récupère sa position actuelle pour pouvoir la remettre
**/
update(){
  if(!this.built) return
  this.position = this.jqObj.position()
  this.remove()
}
// Pour détruire la fenêtre
remove(){
  log.info(`-> ${this.ref}.remove()`)
  this.constructor.unsetCurrent(this)
  this.jqObj.remove()
  this.reset()
  this.constructor.unstack(this)
  log.info(`<- ${this.ref}.remove()`)
}
// Pour réinitialiser
reset(){
  this.built    = false
  this.visible  = false
  delete this._jqObj
}
// Pour mettre la Flying window en premier plan
// Ne pas appeler ces méthodes directement, appeler la méthode
// de classe setCurrent
bringToFront(){
  log.info(`-> ${this.ref}.bringToFront`)
  this.jqObj.css('z-index', 100)
  this.current = true
  log.info(`<- ${this.ref}.bringToFront`)
}
// Pour remettre la Flying window en arrière plan
bringToBack(){
  log.info(`-> ${this.ref}.bringToBack`)
  this.jqObj.css('z-index', 50)
  this.current = false
  log.info(`<- ${this.ref}.bringToBack`)
}

isCurrent(){return true === this.current}

build(){
  log.info(`-> ${this.ref}.build()`)
  // Si c'est une actualisation de la fenêtre, on a mémorisé sa
  // position dans `this.position`
  if(undefined === this.position) this.position = {}
  // console.log("position:", this.position)
  // console.log("Construction de la FWindow ", this.domId)
  var div = DCreate(DIV, {
    id: this.domId
  , class: `fwindow ${this.class || ''}`.trim()
  , append: this.owner.build()
  , style: `top:${this.position.top||this._y||0}px;left:${this.position.left||this._x||0}px;`
  })
  $(this.container).append(div)
  // Si le propriétaire possède une méthode d'après construction,
  // on l'appelle.
  isFunction(this.owner.afterBuilding) && this.owner.afterBuilding()
  // Si le propriétaire possède une méthode qui place des observers
  // d'évènements, on la place
  isFunction(this.owner.observe) && this.owner.observe()

  this.built = true
  log.info(`<- ${this.ref}.build()`)
  return this // chainage
}

// Méthode appelée quand on clique sur le bouton 'btn-close'
onBtnClose(){
  if(isFunction(this.owner.cancel)){
    this.owner.cancel.bind(this.owner)()
  } else {
    this.hide()
  }
}

observe(){
  // Une flying window est déplaçable par essence
  // console.log("this.jqObj:", this.jqObj)
  this.jqObj.draggable({
    containment: STRdocument
  })
  // Une flying window est cliquable par essence
  // this.jqObj.find('header, body').on('click', FWindow.setCurrent.bind(FWindow, this))
  this.jqObj.on('click', FWindow.setCurrent.bind(FWindow, this))

  // Si la boite contient un bouton close, on le surveille pour
  // fermer la fenêtre
  this.jqObj.find('button[type="button"].btn-close').on('click', this.onBtnClose.bind(this))
}

// ---------------------------------------------------------------------
//  Propriétés

get jqObj(){ return this._jqObj || defP(this,'_jqObj', $(`#${this.domId}`))}
get domId(){ return this._domId || defP(this,'_domId', `fwindow-${this.id}`)}
get container(){return this._container}
// class CSS fourni éventuellement par le propriétaire
get class(){return this._class}
// Position x/y de la fenêtre
get x(){return this._x || 100}
get y(){return this._y || 100}
// Référence pour logs
get ref(){
  if(undefined === this._ref){this._ref = `<<fwindow ${this.name || '#'+this.id}>>` }
  return this._ref
}

}

module.exports = FWindow