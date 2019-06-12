'use strict'

const PanelFonds = {
  toggle(){ this.fwindow.toggle() }

, build(){
    return [
      DCreate(DIV, {class: STRheader, append:[
          DCreate(BUTTON, {type:STRbutton, class:'btn-close'})
        , DCreate(H3, {inner: `Fondamentales`})
        ]})
    , DCreate(DIV, {class:STRbody, append: [
          DCreate(DIV, {inner:"ICI LA LISTE DES FONDAMENTALES"})
        ]})
    , DCreate(DIV, {class:STRfooter, append:[
          DCreate(BUTTON, {type:STRbutton, inner: OK, class: 'btn-ok'})
        ]})
    ]
  }

, observe(){
    this.fwindow.jqObj.find('.btn-ok').on(STRclick, this.fwindow.toggle.bind(this.fwindow))
  }

}
Object.defineProperties(PanelFonds, {
  fwindow:{
    get(){return this._fwindow||defP(this,'_fwindow', new FWindow(this,{class:'fwindow-listing-type fondamentales', x:10, y:10}))}
  }
})
module.exports = PanelFonds
