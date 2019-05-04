'use strict'

Object.assign(DataEditor.prototype,{
init(){
  this.peupleItems()
  this.build()
}
/**
  Méthode qui met les items dans le menu des items
  Rappel : ce menu reste toujours dans la fenêtre, il n'est pas construit
  par la méthode build ci-dessous qui construit le formulaire pour le type
  d'élément
**/
, peupleItems(){
    let my = this
    this.menuItems.html('<option value="">Éditer l’élément…</option>')
    this.items.map(item => this.menuItems.append(DCreate('OPTION',{value:item.id, inner: DFormater(item[my.titleProp])})))
  }

})
Object.defineProperties(DataEditor.prototype,{

})
