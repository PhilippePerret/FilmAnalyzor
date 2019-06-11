'use strict'
/**
  Pour construire le listing des markers

  NOTE Je me sers de cette construction pour mettre en place les fenêtres qui
  doivent permettre de choisir des éléments avec les flèches ou les touches
**/
Object.assign(Markers.prototype,{
  showListing(){
    isTrue(this.listingBuilt) || this.buildListing()
    this.kwindow.show()
  }
, buildListing(){
    if (isNotEmpty($('#markers-list'))) $('#markers-list').remove()
    let items = this.arrayItems.map( marker => [marker.id, marker.toString()])
    this.kwindow = new KWindow(this, {
        id: 'markers-list'
      , items: items
      , title:'Se rendre au marqueur…'
      , onChoose: this.onChooseItem.bind(this)
      , onRemove: this.onRemoveItem.bind(this)
    })
    this.listingBuilt = true
  }
, onChooseItem(kmarker){
    if ( isDefined(this.items[kmarker]) ) {
      this.items[kmarker].selectAndGo()
    } else {
      log.error("Marker inexistant avec l'id", kmarker)
      F.notify(`Bizarrement, impossible d'obtenir le marker #${kmarker}… Voir la liste des items dans la console.`, {error: true})
      console.error("Marker inexistant:", kmarker)
      console.error("Markers.items:", this.items)
    }
  }
, onRemoveItem(kmarker){
    let marker = this.items[kmarker]
    // Destruction du marqueur (dans la liste, sur le banc-timeline, dans le
    this.remove(marker)
    // Actualisation de la liste si elle est affichée
    if ( isNotEmpty($('#markers-list')) ) {
      $('#markers-list').remove()
      this.listingBuilt = false
      this.showListing()
    }
  }

})
