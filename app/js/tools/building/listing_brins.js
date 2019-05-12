'use strict'


Object.defineProperty(FABrin,'DataFAListing',{get(){return {
  items: Object.values(this.brins)
  // items:[]
, asListItem(item, opts){
    // console.log("Traitement de item : ", item)
    return DCreate(LI,{append:[
        DCreate(DIV,{class:'bar-title', append:[
          , DCreate(DIV, {class: `title ${item.domC('title')}`, inner: `Brin « ${item.f_title} »`})
          , item.miniTimeline
          , DCreate(DIV, {class:'small', append:[
              DCreate(LABEL,{inner:'id'})
            , DCreate(SPAN,{inner:item.id})
            , DCreate(LABEL,{inner:'type'})
            , DCreate(SPAN,{class:`${item.domC('type')}`, inner:item.f_type})
            ]})
          ]})
    ]})
  }
, editable:     true
, associable:   true
, removable:    true
, associates:   true
, statistiques: true
, collapsable:  true
}}})


if (NONE === typeof(FAListing)) window.FAListing = require('../../system/FA_Listing')
FAListing.extend(FABrin)
