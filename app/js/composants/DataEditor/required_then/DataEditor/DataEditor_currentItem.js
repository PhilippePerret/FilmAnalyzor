'use strict'

Object.assign(DataEditor.prototype,{
  // Pour éditer l'item à éditer, s'il est défini dans les données envoyées
  // (par current_id)
  editCurrent(item_id){
    if(undefined === item_id) item_id = this.data.current
    this.menuItems.val(item_id)
    this.editElement()
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
