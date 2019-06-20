'use strict'


Object.defineProperty(FABrin,'DataFAListing',{get(){return {
  items: Object.values(this.brins)
  // items:[]
, asListItem(item, opts){
    return DCreate(LI,{append:[
        DCreate(DIV,{class:'bar-title', append:[
          , DCreate(DIV, {class: `title ${item.domC('title')}`, inner: `Brin « ${item.f_title} »`})
          , item.miniTimeline
          , DCreate(DIV, {class:'small', append:[
              DCreate(LABEL,{inner:STRid})
            , DCreate(SPAN,{inner:item.id})
            , DCreate(LABEL,{inner:STRtype})
            , DCreate(SPAN,{class:`${item.domC('type')}`, inner:item.f_type})
            ]})
          ]})
    ]})
  }
, editable:     true
, creatable:    true
, associable:   true
, removable:    true
, associates:   true
, statistiques: true
, collapsable:  true
}}})

FAListing.extend(FABrin)
