'use strict'

Object.assign(DataEditor.prototype,{
  // Pour éditer l'item à éditer, s'il est défini dans les données envoyées
  // (par current_id)
  editCurrent(){
    this.menuItems.val(this.data.current)
    this.editElement()
  }
})
Object.defineProperties(DataEditor.prototype,{

/**
  À propos de l'item courant
**/
  currentItem:{
    get(){return this.mainClass.get(this.menuItems.val())}
  }
, currentItemIndex:{
    get(){return this.menuItems[0].selectedIndex}
  }
, currentItemRef:{
    get(){return `« ${this.currentItem[this.data.titleProp]} » (#${this.currentItem.id})`}
  }
})
