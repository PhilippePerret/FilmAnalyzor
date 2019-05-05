'use strict'

Object.assign(DataEditor.prototype,{

// Mettre l'élément choisi en édition
  editElement(){
    this.setFormValues()
  }

// Sauver l'élément édité
, saveElement(){
    var errors
      , formData = this.getFormValues()
    // On doit valider les données
    if(errors = this.checkFormValues(formData)){
      return this.traiteErrors(errors)
    }

    // console.log("On peut enregistrer les données :", formData)
    // console.log("this.currentItem:", this.currentItem)

    if(this.currentItem){
      // Modification
      this.updateCurrentItem(formData)
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
    let nitem = this.mainClass.DECreateItem(data)
    // Ajout au menu (inutile de le sélectionner, ça le fera avec
    // la méthode d'édition)
    this.menuItems.append(DCreate('OPTION',{value: data.id, inner: DFormater(nitem[this.titleProp])}))
  }

// Méthode appelée par le bouton "+"
, addElement(){
    // Vider les champs (on reconstruit le formulaire)
    this.resetFormValues()
    // Remettre le menu au premier item
    this.menuItems[0].selectedIndex = 0
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
