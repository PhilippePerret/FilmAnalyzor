'use strict'

Object.assign(DataEditor.prototype,{
  build(){
    let my = this
    var divs = []
      , divsForm = []

    // Les champs du formulaire
    if (this.dataPanels){
      // Il y a des panneaux (comme pour les fondamentales)
      // => Une bande d'onglets + un contenu des panneaux

      // Il faut compter le nombre d'onglets pour pouvoir les répartir
      let nombre_onglets = this.dataPanels.length
      let width_onglet = `${Math.round(100/nombre_onglets)-1}%`
      divsForm = {onglets: [], panels: []}
      this.dataPanels.map(dpanel => {
        divsForm.onglets.push(dpanel.onglet(width_onglet))
        divsForm.panels.push(dpanel.panel)
      })
      // On finalise divsForm en mettant vraiment des objets DOM
      divsForm = [
        DCreate('DIV', {class:'dataeditor-onglets', append: divsForm.onglets})
      , DCreate('FORM', {id: my.idFor('form_item'), class:'dataeditor-form_item dataeditor-panels', append: divsForm.panels})
      ]
    } else {
      // Il n'y a pas de panneau, c'est un affichage simple
      this.dataFields.map(dfield => divsForm.push(dfield.formDiv))
      var divsForm = [DCreate('FORM', {id: my.idFor('form_item'), class: 'dataeditor-form_item', append: divsForm})]
    }

    divs.push(DCreate('DIV',{class:'header', append:[
        DCreate('BUTTON', {type:'button', class:'btn-close'})
      , DCreate('BUTTON', {type:'button', class:'btn-add', id:my.idFor('btn-add'), inner: '+'})
      , DCreate('BUTTON', {type:'button', class:'btn-del', id:my.idFor('btn-del'), inner: '–'})
      , DCreate('H3', {id:my.idFor('main-title'), inner: this.data.title})
      ]}))
    divs.push(DCreate('DIV',{class:'body', append:[
        DCreate('SELECT',{id:my.idFor('menu_items'), class:'menu-items'})
      , ...divsForm
      ]}))
    divs.push(DCreate('DIV',{class:'footer', append:[
        DCreate('BUTTON', {id:my.idFor('btn-save'), type:'button', class:'btn-save small main-button', inner:"Enregistrer"})
      ]}))
    return divs
  }

, afterBuilding(){
    this.peupleItems()

    // Si l'interface est composée de panneaux, il faut activer le premier
    if(this.dataPanels){
      this.dataPanels[0].activate()
    }
  }

, idFor(suf){ return `${this.id}-${suf}`}

, observe(){
    this.jqObj.find(`#${this.id}-btn-add`).on('click', this.addElement.bind(this))
    this.jqObj.find(`#${this.id}-btn-del`).on('click', this.removeCurrentItem.bind(this))
    this.jqObj.find(`#${this.id}-menu_items`).on('change', this.editElement.bind(this))
    this.saveBtn.on('click', this.saveElement.bind(this))

    // Les champs d'édition répondent au cmd-enter pour soumettre le
    // formulaire (enfin… façon de parler)
    this.jqObj.find('textarea, input[type="text"], input[type="checkbox"], select').on('keydown', this.onKeyDownOnTextFields.bind(this))

    // S'il y a un bouton pour updater les valeurs d'un select, il faut
    // pouvoir actualiser ou ouvrir le fichier
    this.dataFields.map(dfield => dfield.observeIfNecessary())

    // Si l'interface est composée de panneaux, on met un observer
    // sur chaque onglet
    if(this.dataPanels){
      this.dataPanels.map(panel => panel.DOMOnglet.on('click', panel.activate.bind(panel)))
    }

  }
})
