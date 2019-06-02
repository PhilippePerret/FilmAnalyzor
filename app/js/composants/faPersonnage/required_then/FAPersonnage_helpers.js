'use strict'
/**
  Class FAPersonnage
  ------------------
  Méthodes d'helper
**/
Object.defineProperties(FAPersonnage.prototype,{

  f_pseudo:{get(){return this.pseudo}}

, f_references:{get(){
    return DCreate('DIV',{append:[
              DCreate('LABEL',{inner:'ID'})
            , DCreate(SPAN,{class:`id ${this.domC('id')}`, inner: this.id})
            , DCreate('LABEL',{inner:'Dim'})
            , DCreate(SPAN,{class:`dim ${this.domC('dim')}`, inner: this.dim})
            ]}).innerHTML
  }}
, f_ages:{get(){
    let a = Array.isArray(this.ages) ? this.ages : [this.ages]
    return a.map(n => `${n} ans`).join(', ')
  }}

, f_description:{get(){
    return DFormater(this.description)
  }}

, f_fonctions:{get(){
    var divs = []
    divs.push(DCreate('H3',{inner:'Fonctions'}))
    this.fonctions.split(RC).map(f => {
      divs.push(DCreate(SPAN,{class:'fonction', inner:f}))
    })
    return DFormater(DCreate('DIV',{append:divs}).innerHTML)
  }}

, f_dimensions:{get(){
    if(!this.dimensions) return ''
    var tDim
      , dDim
      , divsDim = []

    divsDim.push(DCreate('H3',{inner:'Dimensions'}).outerHTML)
    for(tDim in this.dimensions){
      divsDim.push(this.f_dimension(tDim, this.dimensions[tDim]))
    }

    return divsDim.join('')
  }}

, f_associates:{get(){
    var divs = []
    divs.push(DCreate('H3',{inner:'Éléments associés'}))
    divs.push(...this.divsAssociates({as:'dom'}))
    return DCreate('DIV',{append:divs}).innerHTML
  }}

})

Object.assign(FAPersonnage.prototype,{
  premiere(){/* pour la virgule*/}

/**
  Pour correspond aux méthodes d'event et autres
**/
, as(format, flag, options){
    if(undefined === options) options = {}

    var divs = []
    switch (format) {
      case STRassociate:
        divs.push(DCreate(SPAN,{inner:this.toString()}))
        break;
      default:

    }

    (flag & DISSOCIABLE) && divs.push(this.dissociateLink(options)) 

    divs = DCreate('DIV',{class:`${this.type}`, append:divs})

    if(options.as === 'dom') return divs

    let str = divs.innerHTML

    return str
  }

// Pour formater une ligne de dimension
, f_dimension(tDim, dDim){
    return DCreate('DIV', {class:`dimension`, append:[
      DCreate('LABEL',{class:'dimension-name', inner:`Dimension ${tDim}`})
    , DCreate(SPAN,{class:'dimension-description', inner:DFormater(dDim)})
  ]}).outerHTML
  }

})
