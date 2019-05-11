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

, onOK(){
    if(this.modified) this.save()
    else this.fwindow.hide()
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
        , DCreate('IMG', {src:'img/btn-edit.png', class:'fleft', id:'btn-open-data-brins', attrs:{title:'Éditer les brins'}})
        , DCreate('BUTTON', {type:'button', class:'main-button small btn-ok', inner:'OK'})
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
      .droppable(DATA_ASSOCIATES_DROPPABLE)
      .draggable(DATA_ASSOCIATES_DRAGGABLE)

    // Le bouton OK soit pour fermer soit pour enregistrer
    this.btnOK.on('click', this.onOK.bind(this))

    this.jqObj.find('.footer #btn-open-data-brins').on('click',this.openDocData.bind(this))
    this.jqObj.find('.footer #btn-update-listing-brins').on('click',this.updateListing.bind(this))


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
  btnOK:{get(){return this._bntok||defP(this,'_bntok',this.jqObj.find('.footer .btn-ok'))}}
  // Raccourci
, jqObj:{get(){return this._jqobj||defP(this,'_jqobj',this.fwindow.jqObj)}}

, fwindow:{get(){return this._fwindow||defP(this,'_fwindow',new FWindow(this,{id:'fwindow-brins', class:'fwindow-listing-type'}))}}
})
