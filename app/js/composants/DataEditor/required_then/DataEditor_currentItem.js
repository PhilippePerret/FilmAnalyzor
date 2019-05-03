'use strict'

Object.defineProperties(DataEditor,{

/**
  À propos de l'item courant
**/
  currentItem:{
    get(){return this.mainClass.get(this.menuItems.val())}
  }
, currentItemRef:{
    get(){return `« ${this.currentItem[this.data.title_prop]} » (#${this.currentItem.id})`}
  }
})
