'use strict'
/**
  Helpers pour les noeuds dramatiques
**/

Object.assign(FAEstt.prototype,{

  // Par exemple pour le reader
  asFull(options){
    var divs = []
    divs.push(...this.asShort(options))
    return divs
  }

, asShort(options){
    var divs = [], divsDescription = []
    divs.push(DCreate(DIV,{inner:`${this.sttNode.hname}`}))
    // Dans tous les cas on met les spans pour le titre et la description,
    // qui pourraient être définis plus tard.
    divs.push(DCreate(DIV,{class:'node-description',append:[
        DCreate(SPAN,{class:`stt-${this.id}-title`
          , inner:this.title && DFormater(this.title)})
      , DCreate(SPAN,{class:`stt-${this.id}-description`
          , inner:this.description && DFormater(this.description)})
    ]}))
    return divs
  }

})
