'use strict'

const PanelPersos = {
  toggle(){ this.fwindow.toggle() }

, build(){
    return [
      DCreate('DIV', {class: 'header', append:[
          DCreate('BUTTON', {type:'button', class:'btn-close'})
        , DCreate('H3', {inner: `Personnages`})
        ]})
    , DCreate('DIV', {class:'body', append: [DCreate('DIV', {inner:"ICI LA LISTE DES PERSONNAGES"})]})
    , DCreate('DIV', {class:'footer', append:[
        DCreate('BUTTON', {type:'button', inner: 'OK', class: 'btn-ok'})
      ]})
    ]
  }

, observe(){
    this.fwindow.jqObj.find('.btn-ok').on('click', this.fwindow.toggle.bind(this.fwindow))
  }

}
Object.defineProperties(PanelPersos, {
  fwindow:{
    get(){return this._fwindow||defP(this,'_fwindow', new FWindow(this,{class:'fwindow-listing-type personnages', x:10, y:10}))}
  }
})
module.exports = PanelPersos
