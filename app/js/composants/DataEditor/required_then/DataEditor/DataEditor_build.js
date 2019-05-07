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

    var divsHeader = []
    divsHeader.push(DCreate('BUTTON', {type:'button', class:'btn-close'}))
    if(!this.data.no_new_item){
      divsHeader.push(DCreate('BUTTON', {type:'button', class:'btn-add', id:my.idFor('btn-add'), inner: '+'}))
    }
    if(!this.data.no_del_item){
      divsHeader.push(DCreate('BUTTON', {type:'button', class:'btn-del', id:my.idFor('btn-del'), inner: '–'}))
    }
    divsHeader.push(DCreate('H3', {id:my.idFor('main-title'), inner: this.data.title}))
    divs.push(DCreate('DIV',{class:'header', append:divsHeader}))

    let classBody = ['body']
    if(this.dataPanels) classBody.push('plain')
    divs.push(DCreate('DIV',{class:classBody.join(' '), append:[
        DCreate('SELECT',{id:my.idFor('menu_items'), class:'menu-items'})
      , ...divsForm
      ]}))

    // Le bouton "enregistrer" n'est visible que si un élément est choisi
    var footerDivs = []
    let visuBtns = this.data.no_new_item ? 'hidden' : 'visible'
    if(this.data.checkOnDemand){
      footerDivs.push(DCreate('BUTTON', {id:my.idFor('btn-check'), type:'button', class:'btn-check small', inner:"Check now!", style:`visibility:${visuBtns};`}))
    }
    footerDivs.push(DCreate('BUTTON', {id:my.idFor('btn-save'), type:'button', class:'btn-save small main-button', inner:"Enregistrer", style:`visibility:${visuBtns};`}))
    divs.push(DCreate('DIV',{class:'footer', append:footerDivs}))
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

    if(this.data.checkOnDemand){
      this.checkBtn.on('click', this.onCheckOnDemand.bind(this))
    }

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

    // S'il y a un item courant, on le met en édition
    if(this.data.current){
      this.editCurrent(this.data.current)
    }

  }
})
