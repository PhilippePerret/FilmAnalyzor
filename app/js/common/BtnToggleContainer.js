'use strict'
/**
  Les boutons ToggleNext et ToggleContainer permettent d'ouvrir (expand)
  ou de fermer (collapse) le div spécifié ou le div qui les suit, avec une
  marque commune

  @usage

  Si le conteneur à ouvrir fermer est le node suivant, on met simplement :
    <img class="toggle-next"></button>
  Si on veut ouvrir un container qui se trouve autre part :
    <img class="toggle-container" data-container-id="<#idContainer>"></button>
  Note : ne pas oublier le '#' ou le '.'

  CONTAINER OUVERT AU DÉPART
  --------------------------
  Si on veut que le container soit ouvert au départ, il suffit d'ajouter la
  propriété 'data-state="opened"' à la balise button.

**/

class BtnToggleContainer {
// ---------------------------------------------------------------------
//  CLASS

static observe(container){
  $(container).find('img.toggle-next, img.toggle-container').each(function(i, o){
    new BtnToggleContainer(o)
  })
}

static openAll(container){
  this.toggleAll(container, true)
}
static closeAll(container){
  this.toggleAll(container, false)
}
static toggleAll(container, force_opened){
  $(container).find('img.toggle-next, img.toggle-container').each(function(i, o){
    new BtnToggleContainer(o).toggle(null, force_opened)
  })
}

// ---------------------------------------------------------------------
//  INSTANCE

constructor(domButton){
  this.domObj = domButton
  this._jqBtn  = $(domButton)
  // On le construit aussitôt qu'il est instancié
  this.build()
  this.observe()
}
toggle(e, force_opened){
  let newState
  if(undefined === force_opened){
    newState = this.isOpened() ? 'closed' : 'opened'
  } else {
    newState = force_opened ? 'opened' : 'closed'
  }
  newState != this.state() && this.container.toggle()
  this.domBtn.src = `img/folder_${newState}.png`
  this.jqBtn.attr('data-state', newState)
}

isOpened(){return this.state() === 'opened'}
state(){return this.jqBtn.attr('data-state')}

/**
  Construction du bouton
**/
build(){
  let jqb = this.jqBtn
    , curState = this.jqBtn.attr('data-state') || 'closed'
  if (curState === 'opened'){
    // Ouvrir le container
  } else {
    this.jqBtn.attr('data-state', curState)
  }
  this.domBtn.src = `img/folder_${curState}.png`
}

observe(){
  this.jqBtn.on('click', this.toggle.bind(this))
}

// Le bouton (jQuery)
get jqBtn(){return this._jqBtn}
// L'image (DOMElement)
get domBtn(){return this._domBtn||defP(this,'_domBtn',this.jqBtn[0])}
// Le container (jQuery)
get container(){
  if(undefined===this._container){
    if(this.jqBtn.attr('data-container-id')){
      var id = this.jqBtn.attr('data-container-id')
      if(!(id.startsWith('.') ||id.startsWith('#'))) id = `#${id}`
      this._container = $(id)
    } else {
      this._container = this.jqBtn.next()
    }
  }
  return this._container
}

}// /fin classe
