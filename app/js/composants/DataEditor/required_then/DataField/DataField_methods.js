'use strict'

Object.assign(DataField.prototype,{

  updateSelectValues(){
    this.field.html('')
    this.optionsSelect().map(o => this.field.append(o))
    F.notify('Menu actualisé.')
  }

// Ouvre le document contenant les valeurs absolues pour ce champ
, openValues(e){
    if(e) stopEvent(e) // cf. Note N0001
    this.dataEditor.mainClass.DEOpenDoc(this.prop)
  }

/**
  Méthodes appelées quand les propriétés `showLink` et/ou `editLink`
  sont à true et que l'on peut cliquer à côté d'un petit picto pour
  éditer ou montrer l'élément correspondant à la valeur courante [1] du champs

  [1] Même si ce n'est pas la valeur enregistrée de l'item courant.

**/
, execShowLink(){
    this.showLink(this.getFieldValueOrNull()/* valeur du champ */)
  }
, execEditLink(){
    // On prend la valeur dans le champ concerné
    this.editLink(this.getFieldValueOrNull()/* valeur du champ */)
  }
})
