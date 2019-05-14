'use strict'

Object.assign(FAEvent,{
  FAlistingEvents(etype){
    console.log("Je dois afficher les events de type", etype)
    this._dataType = EVENTS_TYPES_DATA[etype]
    this.DataFAListing.items = (new EventsFilter(this,{filter:{eventTypes:[etype]}})).items
    console.log("Items à lister :", this.DataFAListing.items)
    this.listing = new FAListing(this)
    this.listing.toggle(true)
  }
, save(item_id){
    /* pour les listing */
  }
, destroy(item_id){
    /* pour les listing */
  }
})

Object.defineProperty(FAEvent,'DataFAListing',{get(){return {
// FAEvent.DataFAListing = { // on ne peut pas utiliser 'this'
  items: []//doit être défini par la méthode générale listEvents(type)
  // items:[]
, asListItem(item, opts){
    // console.log("Traitement de item : ", item)
    return item.asFull(opts)
  }
, editable:     true
, creatable:    true
, associable:   true
, removable:    true
, associates:   true
, statistiques: false // pas besoin
, collapsable:  true
, collapsed:    true
}}})


if (NONE === typeof(FAListing)) window.FAListing = require('./js/system/FA_Listing')
FAListing.extend(FAEvent)
