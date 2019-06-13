'use strict'
/**
  Pour construire le listing des markers

  NOTE Je me sers de cette construction pour mettre en place les fenêtres qui
  doivent permettre de choisir des éléments avec les flèches ou les touches
**/
Object.assign(Markers.prototype,{
  showListing(){
    (this.kwindow || this.buildListing()).show()
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
    return this.kwindow
  }
, onChooseItem(kmarker){
    if ( isDefined(this.items[kmarker]) ) {
      this.items[kmarker].selectAndGo()
    } else {
      log.error("Marker inexistant avec l'id", kmarker)
      F.notify(`Bizarrement, impossible d'obtenir le marker #${kmarker}… Voir la liste des items dans la console.`, {error: true})
      log.error("Marker inexistant:", kmarker)
      log.error("Markers.items:", this.items)
    }
  }
, onRemoveItem(kmarker){
    console.log("kmarker = ", kmarker)
    let marker = this.items[kmarker]
    if ( isUndefined(marker) ) {
      F.notify("Impossible de trouver le marker " + kmarker + 'dans la liste…',{error:true})
      console.log("Liste des markers (Markers.items)", this.items)
      console.log("ID marker :", kmarker)
      return false
    }
    // Destruction du marqueur (dans la liste, sur le banc-timeline)
    return this.remove(marker)
  }

})
