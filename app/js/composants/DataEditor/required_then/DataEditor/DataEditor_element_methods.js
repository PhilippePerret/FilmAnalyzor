'use strict'

Object.assign(DataEditor.prototype,{
  editElement(){
    this.setFormValues()
  }
, saveElement(){
    var errors
      , formData = this.getFormValues()
    // On doit valider les données
    if(errors = this.checkFormValues(formData)){
      return this.traiteErrors(errors)
    }
    console.log("On peut enregistrer les données :", formData)

    if(this.currentItem){

    } else {
      // Nouvel item
      this.createNewItem(formData)
      this.editCurrent(formData.id)
    }

  }

/**

  Méthode pour créer le nouvel élément de données +data+
  Cette création doit entrainer :
  - la modification des données générales de la mainClass
  - l'enregistrement du fichier de données
  - l'ajout de l'item à la liste des items
  - sa mise en item courant

**/
, createNewItem(data){
    console.log("Création du nouveau item avec ", data)
    nitem = data // pour le moment (après : nouvel item pour la mainClass)
    // Ajout au menu (inutile de le sélectionner, ça le fera avec
    // la méthode d'édition)
    this.menuItems.append(DCreate('OPTION',{value: data.id, inner: DFormater(nitem[my.titleProp])}))
  }
  
// Méthode appelée par le bouton "+"
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
    var res
    for(var idx in this.items){
      var el = this.items[idx]
      el.DEditorIndex = parseInt(idx,10)
      res = fn(el)
      delete el.DEditorIndex
      if(false === res) break
    }
  }
})
