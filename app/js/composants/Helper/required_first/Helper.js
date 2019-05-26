'use strict'
/**
  class Helper
  ------------
**/
class Helper {

constructor(type){
  this.id = type // p.e. 'new-element'
}
open(){
  this.ready = false
  this.fwindow.show()
}
close(){
  this.fwindow.hide()
  UI.toggleKeyUpAndDown(/* hors champ */ true)
}

onKeyDown(e){
  if(isFalse(this.ready)) return stopEvent(e)
  isFunction(this.data.onKeyDown) && this.data.onKeyDown(e)
  return stopEvent(e)
}
onKeyUp(e){
  if(isFalse(this.ready)) return stopEvent(e)
  if(e.key === 'Escape' || e.key === 'Return'){
    stopEvent(e)
    return this.close()
  }
  isFunction(this.data.onKeyUp) && this.data.onKeyUp(e)
  return stopEvent(e)
}

build(){
  return [
    DCreate(DIV, {class:STRheader, append: [
      DCreate(H3, {inner:this.data.title})
    ]})
  , DCreate(DIV, {class:STRbody, append: this.data.body()})
  , DCreate(DIV, {class:STRfooter, append:[
      DCreate(SPAN, {class:'small', inner:"Fermer : Escape ou Entrée"})
    ]})
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
    // console.log("Pose des observers de touches.")
    window.onkeyup    = this.onKeyUp.bind(this)
    window.onkeydown  = this.onKeyDown.bind(this)
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

}

/**
  Pour requérir les données contenus dans le fichier Helper/helpers/<id>.js
**/
requiredData(){
  return require(`./js/composants/Helper/Helpers/${this.id}.js`)
}

get data(){ return this._data || defP(this,'_data', this.requiredData()) }

get jqObj(){ return this.fwindow.jqObj }
get fwindow(){return this._window || defP(this,'_window', new FWindow(this, {class:'helper-window', id:`helper-window-${this.id}`, draggable:false, x:400, y:40}))}

}
