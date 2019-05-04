'use strict'

Object.assign(DataEditor.prototype,{
  editElement(){
    this.setFormValues()
  }
, saveElement(){
    F.notify(`On doit enregistrement l'élément #${this.currentItem.id}`)
    var formData = this.getFormValues()
    console.log("formdata:", formData)
    // On doit valider les données

  }
, addElement(){
    console.log("-> addElement")
    F.notify("Je vais ajouter un élément du type édité")
  }
, removeElement(){
    if(!this.currentItem) return
    if(!confirm(`Es-tu certain de vouloir détruire à tout jamais l'élément ${this.currentItemRef}?`)) return
    F.notify("Je vais supprimer l'élément édité")
  }

, forEachElement(fn){
    for(var idx in this.items){
      var el = this.items[idx]
      el.DEditorIndex = parseInt(idx,10)
      res = fn(el)
      delete el.DEditorIndex
      if(false === res) break
    }
  }
})
