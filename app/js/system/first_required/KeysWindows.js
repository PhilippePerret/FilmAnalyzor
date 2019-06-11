'use strict'


class KWindow {
constructor(owner, args){
  this.owner = owner
  this.id = args.id // obligatoire si on veut pour détruire les éléments
  console.log("Instanciation de fenêtre ", this.id)
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
  this.functionOnChooseItem(this.selectedItem.value)
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

selectPrevItem(){
  if ( this.indexSelected < 1 ) return
  this.item(this.indexSelected).deselect()
  this.item(--this.indexSelected).select()
}
selectNextItem(){
  if ( this.indexSelected == this.countItems - 1 ) return
  this.item(this.indexSelected).deselect()
  this.item(++this.indexSelected).select()
}

get countItems(){ return this.items.size }

onKeyUp(e){
  // console.log("e.key (STRErase)", e.key, STRErase)
  switch (e.key) {
    case STRArrowUp:
      this.selectPrevItem()
      break
    case STRArrowDown:
      this.selectNextItem()
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
}
select(){
  this.jqObj.addClass('selected')
}
deselect(){
  this.jqObj.removeClass('selected')
}
get li(){
  let obj = DCreate(LI,{class:'item',inner:this.title})
  this._jqobj = $(obj)
  return obj
}
get jqObj(){return this._jqobj}
}

module.exports = KWindow
