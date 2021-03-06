'use strict'

Object.assign(DataEditor.prototype,{

// Mettre l'élément choisi en édition
  editElement(){
    this.resetFormValues() // enlève aussi l'erreur
    if(this.currentItem){
      this.setFormValues()
      if(this.data.no_new_item){
        this.saveBtn.css('visibility', STRvisible)
        this.checkBtn.css('visibility', STRvisible)
      }
    } else {
      // Quand on choisit le premier menu
      if(this.data.no_new_item){
        this.saveBtn.css('visibility', STRhidden)
        this.checkBtn.css('visibility', STRhidden)
      }
    }
  }

// Sauver l'élément édité
, saveElement(){
    log.info('-> DataEditor#saveElement')
    if(this.isNotCurrentWindow()) return
    var errors
      , formData = this.getFormValues()
    // On doit valider les données
    if(errors = this.checkFormValues()){
      log.info('   Errors dans les données', errors)
      return this.traiteErrors(errors)
    }

    // Le tableau formData, ici, ne contient qu'un arbre à un niveau, même
    // si les données sont en panneau. Il faut le retransformer en arbre à
    // trois dimension.
    formData = this.redimFormData(formData)

    // console.log("Les données à enregistrer :", formData)
    // console.log("this.currentItem:", this.currentItem)

    if(this.currentItem){
      // Modification
      this.updateCurrentItem(formData)
    } else {
      // Nouvel item
      this.createNewItem(formData)
      this.editCurrent(formData.id)
    }

    // Doit-on terminer tout de suite ?
    this.cbCloseAfterSave.checked && this.close()

    log.info('<- DataEditor#saveElement')
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
    // On l'ajoute à la liste des items
    this.data.items.push(nitem)
    // Ajout au menu (inutile de le sélectionner, ça le fera avec
    // la méthode d'édition)
    this.menuItems.append(DCreate(OPTION,{value: data.id, inner: DFormater(nitem[this.titleProp])}))
  }

// Méthode appelée par le bouton "+"
/**
  Demande de création d'un nouvel item

  Si la fenêtre n'est pas la fenêtre courante, on renonce (c'est un
  click depuis "devant" pour ramener la fenêtre au premier plan)
**/
, addElement(){
    log.info("-> DataEditor.addElement")
    if(this.isNotCurrentWindow()) return
    // Vider les champs (on reconstruit le formulaire)
    this.resetFormValues()
    // Remettre le menu au premier item
    this.menuItems[0].selectedIndex = 0
    log.info("<- DataEditor.addElement")
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
