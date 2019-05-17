'use strict'

Object.assign(FABuildingScript,{

/**
  Construction de la fenêtre, avec FWindow
**/
  build(){

    let divsHeader = [
        DCreate(BUTTON,{type:STRbutton, class:'btn-close'})
      , DCreate(H3,{inner:'SCRIPT D’ASSEMBLAGE DE L’ANALYSE'})
      ]

    // Tous les steps d'assemblage que l'on peut déplacer
    let stepsIn = [], stepsOut = []
    var step, dstep, dAstep

    // On commence par mettre dans l'ordre de choix la liste des étapes
    // dans la liste IN
    this.data.map(dstep => {
      dAstep = BUILDING_SCRIPT_DATA[dstep.id]
      // console.log("dAstep:", dAstep)
      dAstep.in = true // pour ne pas l'ajouter à droite
      dAstep.id = dstep.id
      stepsIn.push(this.divStepFor(dAstep, {checked: dstep.checked}))
    })

    for(step in BUILDING_SCRIPT_DATA){
      dAstep = BUILDING_SCRIPT_DATA[step]
      if(dAstep.in) continue // déjà mise
      dAstep.id = step
      if(isNotNullish(dAstep.hname)){
        stepsOut.push(this.divStepFor(dAstep))
      } else {
        // C'est une liste dynamique d'étape, comme par exemple pour les
        // documents propres à l'analyse
        (dAstep.items_method)().map(ds => stepsOut.push(this.divStepFor(ds)))
      }
    }

    let divsBody = [
        DCreate(DIV,{id:'bse-left-column', append:[
            DCreate(DIV,{id:'bse-steps-list', append:stepsIn})
          ]})
      , DCreate(DIV,{id:'bse-right-column', append:[
            DCreate(DIV,{id:'bse-steps-outlist', append:stepsOut})
          ]})
      ]

    let divsFooter = [
        DCreate(BUTTON,{type:STRbutton, class:'btn-ok main-button small', inner:OK})
      ]

    return [
      DCreate(DIV,{class:STRheader, append: divsHeader})
    , DCreate(DIV,{class:`${STRbody} plain`, append:divsBody})
    , DCreate(DIV,{class:STRfooter, append:divsFooter})
    ]
  }

/**
  Retourne le DIV de l'étape qui comporte les données +dstep+
**/
, divStepFor(dstep, opts){
    var cbattrs = {}
    opts && opts.checked && ( cbattrs.checked = 'CHECKED' )
    var divs = [
        DCreate(INPUT,{type:STRcheckbox, attrs:cbattrs})
      , DCreate(SPAN,{class:'name', inner:dstep.hname})
    ]
    isNotNullish(dstep.explication) && (
      divs.unshift(DCreate(IMG,{src:'img/picto_info_dark.png',
        attrs:{'id-explication':dstep.id}
      }))
    )
    return DCreate(DIV,{class:'step', append:divs, attrs:{'data-id':dstep.id}})
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
    , cursor:'move'
    }
    // On doit pouvoir classer dans la liste des steps
    this.stepsListObj
      .sortable(dataSort)
      .droppable(Object.assign({drop:this.addStep.bind(this)},dataDrop))

    this.stepsOutListObj
      .droppable(Object.assign({drop:this.supStep.bind(this)},dataDrop))
      .sortable({
          items:'> div'
        , cursor:'move'
      })

    this.jqObj.find('.step').draggable({
      connectToSortable: '#bse-steps-list'
    , containment:this.jqObj
    , revert:true
    })

    // On observe toutes les images permettant d'obtenir des informations
    this.jqObj.find('img[id-explication]').on(STRclick, this.showStepExplaination.bind(this))

    // On observe le bouton pour enregistrer
    this.jqObj.find('.btn-ok').on(STRclick, this.save.bind(this))
  }


}) // /Object.assign
