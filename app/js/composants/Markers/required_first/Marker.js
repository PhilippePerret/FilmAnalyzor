'use strict'
/**
  Classe Marker
  Instance d'un marker
**/

class Marker {
  constructor(analyse, data){
    this.a = analyse
    this.id     = this.constructor.newId()
    this.time   = data.time
    this.title  = data.title || `Marqueur #${this.id}`
  }

build(){
  F.notify("Je dois construire le marqueur " + this.title)
}
edit(){
  F.notify("Je dois éditer le marker")
}

select(){
  F.notify("On doit sélectionner le marqueur")
}

remove(){
  F.notify("Je dois détruire le marqueur")
  // Le détruire de la liste des markers, et l'enregistrer
  // TODO
}

observe(){
  this.jqObj
    // On peut déplacer ce marker sur l'axe horizontal
    .draggable({axis:'x'})
    // On peut éditer ce marker en double-cliquant dessus
    .on('dblclick', this.edit.bind(this))
    // On peut le sélectionner pour le détruire
    .on(STRclick, this.select.bind(this))
}


} // /Class Marker
