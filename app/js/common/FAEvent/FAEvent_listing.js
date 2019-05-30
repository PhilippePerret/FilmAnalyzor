'use strict'

Object.assign(FAEvent,{

/**
  Méthode qui affiche dans les fenêtres FAListing les events du type
  particulier +etype+

  @param {String} etype Le type de l'event (p.e. 'note' ou 'stt')
**/
  FAlistingEvents(etype){
    // console.log("Je dois afficher les events de type", etype)
    let FAClasse = eval(`FAE${etype}`)
    this._dataType = EVENTS_TYPES_DATA[etype]
    let filtereds_items = (new EventsFilter(this,{filter:{eventTypes:[etype]}})).items
    // console.log("this.DataFAListing:", this.DataFAListing)
    Object.assign(this.DataFAListing,{
      items: filtereds_items
    , type:  FAClasse.type
    })
    // console.log("Items à lister :", this.DataFAListing.items)
    // console.log("this.DataFAListing:", this.DataFAListing)
    this.listing = new FAListing(FAClasse)
    this.listing.toggle(true)
    filtereds_items = null
  }
, save(item_id){
    /* pour les listing, inusité pour le moment */
  }
, destroy(item_id){
    /* pour les listing */
  }
})

Object.defineProperty(FAEvent,'DataFAListing',{
get(){
  if(isUndefined(this._datafalisting)){
    this._datafalisting = {
      // FAEvent.DataFAListing = { // on ne peut pas utiliser 'this'
        items: []//doit être défini par la méthode générale listEvents(type)
        // items:[]
      , asListItem(item, opts){
          // console.log("Traitement de item : ", item)
          return DCreate(LI,{append:item.asFull(Object.assign(opts,{as:'dom'}))})
        }
      , editable:     true
      , creatable:    true
      , associable:   true
      , removable:    true
      , associates:   true
      , statistiques: false // pas besoin
      , collapsable:  true
      , collapsed:    true
    }// fin de table
  }// fin de if undefined
  return this._datafalisting
}// /get

})// /defineProperty

FAListing.extend(FAEvent)
