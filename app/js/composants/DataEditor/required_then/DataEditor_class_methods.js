'use strict'

Object.assign(DataEditor,{
  editElement(){
    F.notify(`Je dois éditer l'élément #${this.currentItem.id}`)
  }
, saveElement(){
    F.notify(`On doit enregistrement l'élément #${this.currentItem.id}`)
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
})
