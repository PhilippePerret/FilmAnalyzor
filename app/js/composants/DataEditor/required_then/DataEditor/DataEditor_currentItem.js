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
    /**
      Si le data-editor fonctionne par panneau à onglets, il faut recomposer
      une vrai données.
      Par exemple, quand l'identifiant du champ sera `...fd1-perso_id`, où
      `fd1` est l'identifiant du panneau, la table formData devra posséder
      une clé `fd1` qui sera un object définissant 'perso_id'
    **/
    if(this.dataPanels){
      var h = {}
      this.dataPanels.map(dpanel => {
        h[dpanel.id] = {}
        dpanel.dataFields.map(dfield => {
          h[dpanel.id][dfield.prop] = formData[`${dpanel.id}-${dfield.prop}`]
        })
      })
      formData = h
      h = null
    }
    let nitem = this.mainClass.DEUpdateItem(formData)
    nitem || raise("La méthode DEUpdateItem doit impérativement retourner l'élément actualisé")
    this.data.items[this.currentItemIndex] = nitem
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
