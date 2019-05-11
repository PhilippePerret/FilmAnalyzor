'use strict'


Object.defineProperty(FAImage,'DataFAListing',{get(){return {
// FAImage.DataFAListing = { // on ne peut pas utiliser 'this'
  items: Object.values(this.images)
  // items:[]
, asListItem(item, opts){
    // console.log("Traitement de item : ", item)
    return DCreate(LI,{append:[
        DCreate(IMG,{src:item.path, class:'fleft vignette'})
      , DCreate(DIV,{class:'',append:[
          DCreate(DIV,{class:'image-time small', append:[
            DCreate(LABEL,{inner:'Temps'})
          , item.otime.asAssociate({as:'string'})
          ]})
        , DCreate(DIV,{class:'image-legend small', append:[
            DCreate(LABEL,{inner:'Légende'})
          , DCreate(SPAN, {class: item.domC('legend'), inner: item.f_legend})
          ]})
        ]})
      ]})
  }
, editable:   true
, associable: true
, removable: true
}}})


if (NONE === typeof(FAListing)) window.FAListing = require('../../system/FA_Listing')
FAListing.extend(FAImage)
