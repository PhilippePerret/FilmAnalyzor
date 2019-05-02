'use strict'
/**
  Les boutons ToggleNext permettent d'ouvrir (expand) ou fermer (collapse)
  le div qui les suit, avec une marque commune

  @usage

  Si le conteneur à ouvrir fermer est le node suivant, on met simplement :
    <button class="toggle-next"></button>
  Si on veut ouvrir un container qui se trouve autre part :
    <button class="toggle-next" container="#idContainer"></button>
  Note : ne pas oublier le '#' ou le '.'

  CONTAINER OUVERT AU DÉPART
  --------------------------
  Si on veut que le container soit ouvert au départ, il suffit d'ajouter la
  propriété 'data-state="opened"' à la balise button.

**/

class BtnToggleNext {
// ---------------------------------------------------------------------
//  CLASS

static observe(container){
  $(container).find('button.toggle-next').each(function(i, o){
    new BtnToggleNext(o)
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
toggle(){
  let newState = this.isOpened() ? 'closed' : 'opened'
  this.container.toggle()
  this.domImg.src = `img/folder_${newState}.png`
  this.jqBtn.attr('data-state', newState)
}

isOpened(){return this.state() === 'opened'}
state(){return this.jqBtn.attr('data-state')}

/**
  Construction du bouton
**/
build(){
  let jqb = this.jqBtn
    , curState = jqb.attr('data-state') || 'closed'
  if (curState === 'opened'){
    // Ouvrir le container
  } else {
    jqb.attr('data-state', curState)
  }
  jqb.append(DCreate('IMG', {attrs:{src: `img/folder_${curState}.png`}}))
  jqb = null
}

observe(){
  this.jqBtn.on('click', this.toggle.bind(this))
}

// Le bouton (jQuery)
get jqBtn(){return this._jqBtn}
// L'image (DOMElement)
get domImg(){return this._domImg||defP(this,'_domImg',this.jqBtn.find('img')[0])}
// Le container (jQuery)
get container(){
  if(undefined===this._container){
    if(this.jqBtn.attr('container')){
      this._container = $(this.jqBtn.attr('container'))
    } else {
      this._container = this.jqBtn.next()
    }
  }
  return this._container
}

}// /fin classe
