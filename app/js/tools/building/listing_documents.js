'use strict'


Object.defineProperty(FADocument,'DataFAListing',{get(){return {
  items: PorteDocuments.listableDocuments
  // items:[]
, mainTitle: 'Documents'
, mainProp: 'title'
, asListItem(item, opts){
    return DCreate(LI,{append:[
        DCreate(DIV,{class:'bar-title', append:[
          , DCreate(DIV, {class: `title document-title`, inner: `Document « ${item.f_title} »`})
          , DCreate(DIV, {class:'small', append:[
              DCreate(LABEL,{inner:STRid})
            , DCreate(SPAN,{inner:item.id})
            , DCreate(LABEL,{inner:STRtype})
            , DCreate(SPAN,{class:'document-dtype', inner:item.dType})
            ]})
          ]})
    ]})
  }
, editable:     true
, creatable:    true
, associable:   true
, removable:    true
, associates:   true
, statistiques: false
, collapsable:  true
}}})

FAListing.extend(FADocument)
