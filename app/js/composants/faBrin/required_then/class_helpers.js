'use strict'
/**
  Helpers de classe pour les brins
**/
Object.assign(FABrin,{

display(){
  this.fwindow.show()
}
,
build(){
  var divbrins = []
  this.forEachBrin(brin => divbrins.push(brin.asDiv()))
  return [
    DCreate('DIV', {class:'header', append:[
        DCreate('BUTTON',{type:'button', class:'btn-close'})
      , DCreate('H3', {inner: 'Brins du film'})
    ]})
  , DCreate('DIV', {class:'body', append:[
        DCreate('DIV', {class:'explication small', inner: "(glissez les events/documents/times sur le cadre du brin à lier)"})
      , DCreate('DIV', {class:'div-brins', append:divbrins})
    ]})
  , DCreate('DIV', {class:'footer right', append:[
        DCreate('BUTTON', {type:'button', class:'update', id:'btn-update-listing-brins', inner:'<img src="img/update-2.png" class="update" />'})
      , DCreate('BUTTON', {type:'button', id:'btn-open-data-brins', inner:'Éditer les brins'})
    ]})
  ]
}
,
observe(){
  // Tous les brins doivent réagir au drop avec des events,
  // des documents et tout le tralala
  // Ils peuvent aussi être glissé sur d'autres éléments
  this.fwindow.jqObj.find('.brin')
    .droppable(
      Object.assign({}, DATA_DROPPABLE, {drop: this.onDrop.bind(this)})
    )
    .draggable({revert:true, helper:'clone'})

  this.fwindow.jqObj.find('#btn-open-data-brins').on('click',this.openDocData.bind(this))
  this.fwindow.jqObj.find('#btn-update-listing-brins').on('click',this.updateListing.bind(this))
  BtnToggleNext.observe(this.fwindow.jqObj)
}
,
updateListing(e){
  log.info('-> FABrin#updateListing')
  this.fwindow.update.bind(this.fwindow)()
  this.display()
  log.info('<- FABrin#updateListing')
}
,
onDrop(e, ui){
  let b = $(e.target)
    , brin = this.brins[b.attr('data-id')]
  this.a.associateDropped(brin, ui.helper)
}

})
Object.defineProperties(FABrin,{
  fwindow:{get(){return this._fwindow||defP(this,'_fwindow',new FWindow(this,{id:'fwindow-brins', class:'fwindow-listing-type'}))}}
})
