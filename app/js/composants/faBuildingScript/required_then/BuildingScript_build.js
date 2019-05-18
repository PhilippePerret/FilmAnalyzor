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
    var elemsDyn = {}

    // On commence par mettre dans l'ordre de choix la liste des étapes
    // dans la liste IN
    this.data.map(dstep => {

      dAstep = BUILDING_SCRIPT_DATA[dstep.id]
      // Noter que dAstep sera indéfini pour les éléments dynamiques, comme
      // les documents customisés. On alimentera alors ElemDyn qui servira
      // plus bas à choisir la bonne liste.

      if(isDefined(dAstep)){
        // console.log("dAstep:", dAstep)
        dAstep.in = true // pour ne pas l'ajouter à droite
        dAstep.id = dstep.id
      } else {
        elemsDyn[dstep.id] = dstep
        dAstep = dstep // dstep ne connait pas :hname
      }
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
        (dAstep.items_method)().map(ds => {
          if (isDefined(elemsDyn[ds.id])) return
          stepsOut.push(this.divStepFor(ds))
        })
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
    log.info("-> divStepFor(dstep)", dstep)
    var divClass = ''   // class final du div principal
      , spanAttrs = {}  // attributs pour le span du nom humain
      , cbattrs = {}    // attributs pour la case à cocher

    opts && Object.assign(dstep,opts) // j'essaie

    if (dstep.onclick){
      // Quand une donnée possède la propriété 'onclick', c'est qu'elle ne
      // se déplace pas dans la liste, mais sert plutôt d'aide, comme pour
      // les images ou les brins, qui s'ajoutent depuis leurs listings
      // respectif
      spanAttrs.onclick = dstep.onclick
    } else {
      // Sinon, on lui donne la classe .step pour qu'il puisse être
      // draggué
      divClass = STRstep
    }

    dstep.checked && ( cbattrs.checked = 'CHECKED' )
    var divs = []
    isNotNullish(dstep.explication) && (
      divs.push(DCreate(IMG,{src:'img/picto_info_dark.png', attrs:{'id-explication':dstep.id}}))
    )
    divs.push(...[
        DCreate(BUTTON,{type:STRbutton,class:'btn-sup', inner:'–'})
      , DCreate(INPUT,{type:STRcheckbox, attrs:cbattrs})
      , DCreate(SPAN,{class:STRname, inner:dstep.hname, attrs:spanAttrs})
    ])

    return DCreate(DIV,{class:divClass, append:divs, attrs:{'data-type':(dstep.type||STRstep), 'data-id':dstep.id, 'data-hname':dstep.hname}})
  }
/**
  Observation de la fenêtre
**/
, observe(){

    let dataDrop = {
      accept:'.step, .brin, .image'
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

    // On rend tous les div.step draggable
    this.jqObj.find('.step').draggable({
      connectToSortable: '#bse-steps-list'
    , containment:this.jqObj
    , revert:true
    })

    // On observe tous les "-" qui permettent de retirer les éléments
    this.jqObj.find('.btn-sup').on(STRclick,this.wantSupStep.bind(this))

    // On observe toutes les "?" permettant d'obtenir des informations
    this.jqObj.find('img[id-explication]').on(STRclick, this.showStepExplaination.bind(this))

    // On observe le bouton pour enregistrer
    this.jqObj.find('.btn-ok').on(STRclick, this.save.bind(this))
  }

/**
  Reçoit un div d'étape à observer dans le script d'assemblage
  Elle est appelée à la création d'étape personnalisées comme les
  images ou les brins, par exemple.
**/
, observeDiv(odiv){
    // Le bouton "-" pour le supprimer
    $(odiv).find('.btn-sup').on(STRclick,this.wantSupStep.bind(this))
  }

}) // /Object.assign
