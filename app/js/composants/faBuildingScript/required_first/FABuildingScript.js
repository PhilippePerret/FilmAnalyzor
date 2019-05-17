'use strict'
/**
  FABuildingScript est une constante qui permet de construire de façon
  assistée le script d'assemblage de l'analyse.
**/

const FABuildingScript = {
  class: 'FABuildingScript'

, toggle(){ this.fwindow.toggle() }
/**
  Définition des données assemblables
**/
  /**
    // TODO case a cocher pour introduire le texte sur la version originale
  **/

/**
  Construction de la fenêtre, avec FWindow
**/
, build(){
    let divsHeader = [
        DCreate(BUTTON,{type:STRbutton, class:'btn-close'})
      , DCreate(H3,{inner:'SCRIPT D’ASSEMBLAGE DE L’ANALYSE'})
      ]

    // Tous les steps d'assemblage que l'on peut déplacer
    let movableElements = [
        DCreate(DIV,{class:'step', inner:'Note film en langue originale'})
      , DCreate(DIV,{class:'step', inner:'Introduction générale'})
      ]
    let divsBody = [
        DCreate(DIV,{id:'bse-left-column', append:[
            DCreate(DIV,{id:'bse-steps-list'})
          ]})
      , DCreate(DIV,{id:'bse-right-column', append:[
            DCreate(DIV,{id:'bse-steps-outlist', append:movableElements})
          ]})
      ]
    return [
      DCreate(DIV,{class:STRheader, append: divsHeader})
    , DCreate(DIV,{class:`${STRbody} plain`, append:divsBody})
    , DCreate(DIV,{class:STRfooter})
    ]
  }

/**
  Observation de la fenêtre
**/
, observe(){

    let dataDrop = {
      accept:'.step'
    }
    let dataSort = {
      connectWith:'#bse-steps-outlist'
    , items:'> div'
    }
    // On doit pouvoir classer dans la liste des steps
    this.stepsListObj
      .sortable(dataSort)
      .droppable(dataDrop)

    this.stepsOutListObj
      .sortable({items:'> div'})

    this.jqObj.find('.step').draggable({
      connectToSortable: '#bse-steps-list'
    , helper:'clone'
    , containment:this.jqObj
    })
  }

} ; /* /FABuildingScript */
Object.defineProperties(FABuildingScript,{

  stepsListObj:{get(){
    if(isUndefined(this._stepslistobj)){
      this._stepslistobj = this.fwindow.jqObj.find('.body #bse-left-column #bse-steps-list')
      if(isEmpty(this._stepslistobj)) delete this._stepslistobj
    }
    return this._stepslistobj
  }}
, stepsOutListObj:{get(){
    if(isUndefined(this._stepsOutlistobj)){
      this._stepsOutlistobj = this.fwindow.jqObj.find('.body #bse-right-column #bse-steps-outlist')
      if(isEmpty(this._stepsOutlistobj)) delete this._stepsOutlistobj
    }
    return this._stepsOutlistobj
  }}
, jqObj:{get(){return this.fwindow.jqObj}}
, fwindow:{get(){
    return this._fwindow||defP(this,'_fwindow',new FWindow(this,{class:'large-edition', name:'Building-script-editor', x:400}))
  }}
})
