'use strict'

Object.assign(DataEditor.prototype,{
  // Pour éditer l'item à éditer, s'il est défini dans les données envoyées
  // (par current_id)
  editCurrent(item_id){
    if(this.isNotCurrentWindow()) return
    isDefined(item_id) || ( item_id = this.data.current )
    this.menuItems.val(item_id)
    this.editElement()
  }

, removeCurrentItem(){
    if(isUndefined(this.currentItem)) return
    if(this.isNotCurrentWindow()) return
    confirm({
        message: `Es-tu certain de vouloir détruire à tout jamais l'élément ${this.currentItemRef}?`
      , buttons: ['Renoncer', 'Détruire']
      , defaultButtonIndex:0
      , cancelButtonIndex:0
      , okButtonIndex:1
      , methodOnOK: this.execRemovingCurrentItem.bind(this)
    })
  }
/**
  Méthode appelée après confirmation de la suppression de l'item
**/
, execRemovingCurrentItem(){
    if(this.mainClass.DERemoveItem(this.currentItem)){
      // Supprimer dans les items
      this.data.items.splice(this.currentItemIndex,1)
      // Supprimer dans le menu
      this.menuItems.find(`option:nth-child(${this.currentItemIndex + 2})`).remove()
      // Remettre le menu au début
      this.menuItems[0].selectedIndex = 0
      // Plus d'élément courant
      delete this.currentItem
      // Resetter les champs
      this.resetFormValues()
    }
  }

, updateCurrentItem(formData){
    log.info(`-> DataEditor#updateCurrentItem(data=${JSON.stringify(formData)})`)
    let nitem = this.mainClass.DEUpdateItem(formData)
    nitem || raise("La méthode DEUpdateItem doit impérativement retourner l'élément actualisé")
    this.data.items[this.currentItemIndex] = nitem

    // On actualise l'objet grâce à sa méthode onUpdate qui va répercuter les
    // changement sur tous les éléments affichés de l'élément
    if(isFunction(this.currentItem.onUpdate)){
      this.currentItem.onUpdate()
    } else {
      F.notify(`Si les éléments de class ${this.mainClass.name} possédait la méthode 'onUpdate', il pourrait être corrigés partout immédiatement.`)
    }

    F.notify(`Élément ${this.currentItemRef} actualisé.`)
    log.info('<- DataEditor#updateCurrentItem')
  }

})
Object.defineProperties(DataEditor.prototype,{

/**
  À propos de l'item courant
**/
  currentItem:{
    get(){
      if(this.currentItemIndex < 0) return // pas de courant
      // return this.mainClass.get(this.menuItems.val())
      return this.data.items[this.currentItemIndex]
    }
  }
, currentItemIndex:{
    get(){return this.menuItems[0].selectedIndex - 1}// premier menu = -1
  }
, currentItemRef:{
    get(){
      var rf = `« ${this.currentItem[this.data.titleProp]} »`
      if(undefined !== this.currentItem.id) rf += ` (#${this.currentItem.id})`
      return rf
    }
  }
})
