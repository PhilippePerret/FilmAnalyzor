'use strict'

const PanelStatistiques = {
  toggle(){ this.fwindow.toggle() }

, build(){
    return [
      DCreate('DIV', {class: 'header', append:[
          DCreate('BUTTON', {type:'button', class:'btn-close'})
        , DCreate('H3', {inner: `Statistiques`})
        ]})
    , DCreate('DIV', {class:'body', append: [DCreate('DIV', {inner:"Ici, bientôt, les statistiques"})]})
    , DCreate('DIV', {class:'footer', append:[
        DCreate('BUTTON', {type:'button', inner: 'OK', class: 'btn-ok'})
      ]})
    ]
  }

, observe(){
    this.fwindow.jqObj.find('.btn-ok').on('click', this.fwindow.toggle.bind(this.fwindow))
  }

}
Object.defineProperties(PanelStatistiques, {
  fwindow:{
    get(){return this._fwindow||defP(this,'_fwindow', new FWindow(this,{class:'fwindow-listing-type personnages', x:10, y:10}))}
  }
})
module.exports = PanelStatistiques
