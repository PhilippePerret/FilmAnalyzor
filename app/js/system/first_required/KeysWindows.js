'use strict'


class KWindow {
constructor(owner, args){
  this.owner = owner
  this.id = args.id // obligatoire si on veut pour détruire les éléments
  this.indexSelected = args.selected || 0
  this.title = args.title
  this.functionOnChooseItem = args.onChoose
  this.functionOnChooseNone = args.onCancel
  this.functionOnRemoveItem = args.onRemove
  this.items = new Map()
  for ( var i = 0, len = args.items.length ; i < len ; ++ i){
    this.items.set(i, new KWindowItem(this, args.items[i]))
  }
}
show(){ this.fwindow.show() }
onShow(){ this.observeWindow() }
hide(){ this.fwindow.hide() }
onHide(){this.unobserveWindow()}
// Alias
close(){return this.hide()}

/**
  Retourne l'itemp d'index +idx+
**/
item(idx){
  return this.items.get(idx)
}
/**
  Retourne l'instance KWindowItem de l'item actuellement sélectionné
**/
get selectedItem(){ return this.item(this.indexSelected) }

/**
  Quand on choisit un item (avec la touche entrée)
**/
chooseItem(){
  isFunction(this.functionOnChooseItem) || raise(T('kwindow-func-after-choose-required'))
  this.functionOnChooseItem(this.selectedItem.value, this.selectedItem.selection === 'right'/* si double*/)
  this.close()
}
/**
  Appelée quand on ne choisit aucun item (cancel) avec la touche Escape
**/
chooseNone(){
  if ( isFunction(this.functionOnChooseNone) ) this.functionOnChooseNone.call()
  this.close()
}
/**
  Appelée quand on clique sur la touche Erase pour détruire un élément
  de la liste.
  Note qu'il n'y a rien d'autre à faire qu'à appeler la fonction de destruction,
  car c'est cette fonction qui devra se charger de détruire cette fenêtre et
  de la reconstruire.
**/
onRemove(){
  if ( isFunction(this.functionOnRemoveItem) ){
    confirm({
        message: `Es-tu certain de vouloir détruire l’item « ${this.selectedItem.title} » ?`
      , buttons:['Renoncer', 'Le détruire']
      , defaultButtonIndex:0
      , cancelButtonIndex: 0
      , okButtonIndex: 1
      , methodOnOK: this.execRemoveItem.bind(this)
    })
  } else {
    F.notify(T('kwindow-no-remove-function'))
  }
}
execRemoveItem(){
  this.functionOnRemoveItem(this.selectedItem.value)
  this.fwindow.remove() // pour forcer sa reconstruction
}

build(){
  this.listingBuilt = true
  return [
      DCreate(DIV,{class:STRheader, inner: this.title})
    , DCreate(DIV,{class:STRbody, append:this.itemsAsLIList()})
    , DCreate(DIV,{class:STRfooter})
  ]
}
afterBuilding(){
  this.item(this.indexSelected).select()
}


itemsAsLIList(){
  var arr = []
  this.items.forEach( item => arr.push(item.li))
  return arr
}

/**
  On observe la fenêtre, c'est-à-dire qu'on détourne les keyup et keydown
  pour qu'ils répondent à cette fenêtre.
**/
observeWindow(){
  window.onkeyup    = this.onKeyUp.bind(this)
  window.onkeydown  = this.onKeyDown.bind(this)
  UI.markShortcuts.html('KEYWINDOW')
}

selectPrevItem(){ this.selectAroundItem(this.indexSelected - 1) }
selectNextItem(){ this.selectAroundItem(this.indexSelected + 1) }
selectAroundItem(indexNext){
  this.item(this.indexSelected).deselect()
  if ( indexNext < 0 /* => prev */ ) indexNext = this.countItems - 1
  else if ( indexNext > this.countItems - 1 /* => next */) indexNext = 0
  this.item(indexNext).select()
  this.indexSelected = indexNext
}

get countItems(){ return this.items.size }

onKeyUp(e){
  // console.log("e.key (STRErase)", e.key, STRErase)
  switch (e.key) {
    // Note : les flèches haut/bas sont gérées par onKeyDown pour pouvoir
    // tenir compte des répétitions avec touche tenue pressée.
    // case STRArrowUp:
    //   this.selectPrevItem()
    //   break
    // case STRArrowDown:
    //   this.selectNextItem()
    //   break
    case STRArrowRight:
      if ( this.selectedItem.isDouble) {
        // Il faut sélectionner l'item droite
        this.selectedItem.selectRight()
      }
      break
    case STRArrowLeft:
      if ( this.selectedItem.isDouble) {
        // Il faut sélectionner l'item gauche
        this.selectedItem.selectLeft()
      }
      break
    case ENTER:
      this.chooseItem()
      break
    case ESCAPE:
      this.chooseNone()
      break
    case DELETE: // fn+backspace
    case BACKSPACE:
      this.onRemove()
      break
    default:

  }
  return stopEvent(e)
}
onKeyDown(e){
  switch (e.key) {
    case STRArrowUp:
      this.selectPrevItem()
      break
    case STRArrowDown:
      this.selectNextItem()
      break
  }
  return stopEvent(e)
}
/**
  À la fermeture, on remet les anciens observateurs
**/
unobserveWindow(){
  UI.toggleKeyUpAndDown(/* out-text-field = */ true)
}

get fwindow(){return this._fwindow || defP(this,'_fwindow', new FWindow(this, {id: this.id, class:'keywindow', x:400, y:100}))}
}

class KWindowItem {
constructor(owner, paire){
  this.owner = owner
  this.value = paire[0]
  this.title = paire[1]
  this.title_alt = paire[2] // if any
  this.isDouble = isDefined(this.title_alt)
  // Par défaut, si c'est une rangée double, la sélection est l'item gauche
  this.isDouble && ( this.selection = 'left' )
}
selectRight(){
  if (this.selection === 'right') {
    this.selectLeft()
  } else {
    this.jqItemRight.addClass('selected')
    this.jqItemLeft.removeClass('selected')
    this.selection = 'right'
  }
}
selectLeft(){
  if ( this.selection === 'left') {
    this.selectRight()
  } else {
    this.jqItemRight.removeClass('selected')
    this.jqItemLeft.addClass('selected')
    this.selection = 'left'
  }
}
get jqItemRight(){return this.jqObj.find('span.subitem-right')}
get jqItemLeft(){return this.jqObj.find('span.subitem-left')}
select(){
  this.jqObj.addClass('selected')
  // On s'assure qu'il soit toujours visible
  let o = this.jqObj
    , parent        = o.parent()
    , top           = o.position().top // par rapport au parent
    , height        = o.outerHeight()
    , bottom        = top + height
    , offsetStart   = parent.scrollTop()
    , offsetEnd     = offsetStart + parent.innerHeight()

  if ( top < offsetStart || bottom > offsetEnd) {
    parent.scrollTop(top - 20)
  }
}
deselect(){
  this.jqObj.removeClass('selected')
}
get li(){
  let obj = DCreate(LI,{class:`item${this.title_alt?' double':''}`,append:this.spanItems})
  this._jqobj = $(obj)
  return obj
}
/**
  Retourne le ou les spans de la rangée
  Cf. le manuel de développement, sur les KWindows
**/
get spanItems(){
  let arr = []
  this.title_alt && arr.push(DCreate(SPAN,{class:'subitem subitem-right', inner:this.title_alt}))
  arr.push(DCreate(SPAN,{class:'subitem subitem-left selected', inner:this.title}))
  // Noter que le 'selected', ci-dessus, ne concerne que la rangée, il signifie
  // que si c'est une rangée à double valeur, c'est celle de gauche qui est
  // sélectionnée.
  return arr
}
get jqObj(){return this._jqobj}
}

module.exports = KWindow
