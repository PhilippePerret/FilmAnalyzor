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

/**
  Méthode qui traite les erreurs après le check raté des données de
  formulaire.
  @param {Array}  errors    Liste des erreurs
                  Chaque élément est un object qui contient error: l'erreur
                  string à afficher et prop: la propriété erronée, pour mettre
                  en exergue le champ.
**/
, traiteErrors(errors){
    // console.log("errors:", errors)
    var msgs = []
    errors.map( derr => {
      this.jqObj.find(`#${this.id}-item-${derr.prop}`).addClass('error')
      msgs.push(derr.error)
    })
    return F.error(msgs.join("\n"))
  }

})
