'use strict'
/**
  Helpers de classe pour les brins
**/
Object.assign(FABrin,{

  toggle(){
    log.info("-> FABrin::toggle()")
    if(!this.loaded) return log.warn('Impossible d’afficher la liste des brins. Ils ne sont pas encore chargés.')
    this.fwindow.toggle()
  }

, display(){
    this.fwindow.show()
  }

, build(){
    log.info("-> FABrin::build")
    var divbrins = []
    this.forEachBrin(brin => divbrins.push(brin.asDiv()))
    let divs = [
      DCreate('DIV', {class:'header', append:[
          DCreate('BUTTON',{type:'button', class:'btn-close'})
        , DCreate('H3', {inner: 'Brins du film'})
      ]})
    , DCreate('DIV', {class:'body', append:[
        , DCreate('DIV', {class:'div-brins', append:divbrins})
      ]})
    , DCreate('DIV', {class:'footer right', append:[
          DCreate('IMG', {src:'img/update-2.png', class:'update fleft', id:'btn-update-listing-brins'})
        , DCreate('BUTTON', {type:'button', id:'btn-open-data-brins', inner:'Éditer les brins'})
      ]})
    ]
    log.info("<- FABrin::build")
    return divs
  }

, observe(){
    log.info("-> FABrin::observe")
    // Tous les brins doivent réagir au drop avec des events,
    // des documents et tout le tralala
    // Ils peuvent aussi être glissé sur d'autres éléments
    this.fwindow.jqObj.find('.brin')
      .droppable(DATA_DROPPABLE)
      .draggable(DATA_ASSOCIATES_DRAGGABLE)

    this.fwindow.jqObj.find('#btn-open-data-brins').on('click',this.openDocData.bind(this))
    this.fwindow.jqObj.find('#btn-update-listing-brins').on('click',this.updateListing.bind(this))
    BtnToggleContainer.observe(this.fwindow.jqObj)
    log.info("<- FABrin::observe")
  }

, updateListing(e){
    log.info('-> FABrin#updateListing')
    this.fwindow.update.bind(this.fwindow)()
    this.display()
    log.info('<- FABrin#updateListing')
  }

})
Object.defineProperties(FABrin,{
  fwindow:{get(){return this._fwindow||defP(this,'_fwindow',new FWindow(this,{id:'fwindow-brins', class:'fwindow-listing-type'}))}}
})
