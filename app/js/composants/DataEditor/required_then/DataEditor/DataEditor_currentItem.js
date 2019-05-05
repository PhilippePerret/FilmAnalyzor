'use strict'

Object.assign(DataEditor.prototype,{
  // Pour éditer l'item à éditer, s'il est défini dans les données envoyées
  // (par current_id)
  editCurrent(item_id){
    if(undefined === item_id) item_id = this.data.current
    this.menuItems.val(item_id)
    this.editElement()
  }

, removeCurrentItem(){
    if(!this.currentItem) return
    if(!confirm(`Es-tu certain de vouloir détruire à tout jamais l'élément ${this.currentItemRef}?`)) return
    if(this.mainClass.DERemoveItem(this.currentItem)){
      // Supprimer dans le menu
      this.menuItems.find(`option:nth-child(${this.currentItemIndex + 2})`).remove()
      // Remettre le menu au début
      this.menuItems[0].selectedIndex = 0
      // Resetter les champs
      this.resetFormValues()
    }
  }

, updateCurrentItem(formData){
    this.mainClass.DEUpdateItem(formData)
    F.notify(`Élément ${this.currentItemRef} actualisé.`)
  }

})
Object.defineProperties(DataEditor.prototype,{

/**
  À propos de l'item courant
**/
  currentItem:{
    get(){
      if(this.currentItemIndex < 0) return // pas de courant
      return this.mainClass.get(this.menuItems.val())
    }
  }
, currentItemIndex:{
    get(){return this.menuItems[0].selectedIndex - 1}// premier menu = -1
  }
, currentItemRef:{
    get(){return `« ${this.currentItem[this.data.titleProp]} » (#${this.currentItem.id})`}
  }
})
