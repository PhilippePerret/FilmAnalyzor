'use strict'


Object.defineProperty(FAPersonnage,'DataFAListing',{get(){return {
// FAPersonnage.DataFAListing = { // on ne peut pas utiliser 'this'
  items: Object.values(this.personnages)
  // items:[]
, asListItem(item, opts){
    var divs = [
      DCreate(SPAN, {class:`pseudo ${item.domC('pseudo')}`, inner: this.pseudo})
    , DCreate(DIV,  {class:`references`, inner:item.f_references /* id et DIM */})
    ]
    if(item.prenom || item.nom){
      divs.push(DCreate(DIV, {class:'patronyme', append:[
        DCreate(SPAN, {class:`prenom ${item.domC('prenom')}`, inner: item.prenom})
      , DCreate(SPAN, {class:`nom ${item.domC('nom')}`, inner: item.nom})
      ]}))
    }
    item.ages && divs.push(DCreate(DIV,{class:`ages ${item.domC('ages')}`, inner: item.f_ages}))

    divs.push(DCreate(DIV,{class:`description ${item.domC('description')}`, inner:item.f_description}))

    item.fonctions && divs.push(DCreate(DIV,{class:`fonctions ${item.domC('fonctions')}`, inner:item.f_fonctions}))

    item.dimensions && divs.push(DCreate(DIV,{class:`dimensions ${item.domC('dimensions')}`, inner:item.f_dimensions}))

    return DCreate(LI,{append:divs})
  }
, editable:     true
, creatable:    true
, associable:   true
, associates:   true
, collapsable:  true
, collapsed:    true
, removable:    true
}}})


if (NONE === typeof(FAListing)) window.FAListing = require('../../system/FA_Listing')
FAListing.extend(FAPersonnage)
