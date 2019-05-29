'use strict'
/**
  class Helper
  ------------
**/
class Helper {

constructor(type){
  this.id = type // p.e. 'new-element', 'go-to'
  this.requiredOwnData()
}
open(){
  this.ready = false
  isFunction(this.init) && this.init.bind(this).call()
  this.fwindow.show()
}
close(){
  this.fwindow.hide()
  UI.toggleKeyUpAndDown(/* hors champ */ true)
}

onExecKeyDown(e){
  if(isFalse(this.ready)) return stopEvent(e)
  isFunction(this.onKeyDown) && this.onKeyDown.bind(this)(e)
  return stopEvent(e)
}
onExecKeyUp(e){
  if(isFalse(this.ready)) return stopEvent(e)
  if(e.key === STREscape || e.key === STRReturn){
    stopEvent(e)
    return this.close()
  }
  isFunction(this.onKeyUp) && this.onKeyUp.bind(this)(e)
  return stopEvent(e)
}

build(){
  var divsFooter = []
  // Si une méthode footer est définie, elle renvoie des DOMElements
  // à ajouter
  if ( isFunction(this.footer) ){
    divsFooter.push(...this.footer.bind(this).call())
  } else {
    divsFooter.push(DCreate(SPAN, {class:'small', inner:"Fermer : Escape ou Entrée"}))
  }

  return [
    DCreate(DIV, {class:STRheader, append: [
      DCreate(H3, {inner:this.title})
    ]})
  , DCreate(DIV, {class:STRbody, append: this.body()})
  , DCreate(DIV, {class:STRfooter, append:divsFooter})
  ]
}

onShow(){
  this.onFocus()
}

// Appelée par FWindow quand la fenêtre redevient la fenêtre courante
onFocus(){
  // Pour les remettre chaque fois qu'on ouvre la fenêtre ou qu'on focusse
  // dessus
  setTimeout(() => {
    window.onkeyup    = this.onExecKeyUp.bind(this)
    window.onkeydown  = this.onExecKeyDown.bind(this)
    UI.markShortcuts.html('MODAL WINDOW')
    this.ready = true
  }, 300)
}
// Appelée par FWindow quand la fenêtre n'est plus la fenêtre courante
onBlur(){
  UI.toggleKeyUpAndDown(/* hors champ */ true)
}

observe(){
  // Note : ce n'est pas ici qu'il faut affecter les obersers de touche
  // pressées car il faut les remettre chaque fois qu'on ouvre la fenêtre.
  // Cf. ci-dessus `onShow`
  isFunction(this.observeSup) && this.observeSup.bind(this).call()
}

/**
  Pour requérir les données contenus dans le fichier Helper/helpers/<id>.js
**/
requiredOwnData(){
  let my = this
  Object.assign(my, require(`./js/composants/Helper/Helpers/${my.id}.js`))
  isFunction(my.onKeyUp) && ( my.onKeyUp  = my.onKeyUp.bind(my) )
  isFunction(my.onKeyDown) && ( my.onKeyDown  = my.onKeyDown.bind(my) )
  isFunction(my.body) && ( my.body = my.body.bind(my) )
}

get jqObj(){ return this.fwindow.jqObj }
get fwindow(){return this._window || defP(this,'_window', new FWindow(this, {class:'helper-window', id:`helper-window-${this.id}`, draggable:false, x:400, y:40}))}
get a(){return current_analyse}
}
