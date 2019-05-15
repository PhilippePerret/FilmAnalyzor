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
          , DCreate(LABEL,{inner:'Taille'})
          , DCreate(SPAN,{class:`${item.domC('size')}`, inner:item.f_size})
          ]})
        , DCreate(DIV,{class:'image-legend small', append:[
            DCreate(LABEL,{inner:'Légende'})
          , DCreate(SPAN, {class: item.domC('legend'), inner: item.f_legend})
          ]})
        ]})
      ]})
  }
, explication: T('explication-images-listing')
, editable:     true
, creatable:    false
, associable:   true
, removable:    true
, associates:   true
, statistiques: false // pas besoin
, collapsable:  true
, collapsed:    true
}}})

FAListing.extend(FAImage)
