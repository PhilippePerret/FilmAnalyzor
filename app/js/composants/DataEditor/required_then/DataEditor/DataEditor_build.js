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
        DCreate(DIV, {class:'dataeditor-onglets', append: divsForm.onglets})
      , DCreate(FORM, {id: my.idFor('form_item'), class:'dataeditor-form_item dataeditor-panels', append: divsForm.panels})
      ]
    } else {
      // Il n'y a pas de panneau, c'est un affichage simple
      this.dataFields.map(dfield => divsForm.push(dfield.formDiv))
      var divsForm = [DCreate(FORM, {id: my.idFor('form_item'), class: 'dataeditor-form_item', append: divsForm})]
    }

    var divsHeader = []
    divsHeader.push(DCreate(BUTTON, {type:STRbutton, class:'btn-close'}))
    if(!this.data.no_new_item){
      divsHeader.push(DCreate(BUTTON, {type:STRbutton, class:'btn-add', id:my.idFor('btn-add'), inner: '+'}))
    }
    if(!this.data.no_del_item){
      divsHeader.push(DCreate(BUTTON, {type:STRbutton, class:'btn-del', id:my.idFor('btn-del'), inner: '–'}))
    }
    divsHeader.push(DCreate(H3, {id:my.idFor('main-title'), inner: this.data.title}))
    divs.push()

    // divs.push()

    // Le bouton "enregistrer" n'est visible que si un élément est choisi
    var divsFooter = []
    let visuBtns = this.data.no_new_item ? STRhidden : STRvisible
    if(this.data.checkOnDemand){
      divsFooter.push(DCreate(BUTTON, {id:my.idFor('btn-check'), type:STRbutton, class:'btn-check small', inner:"Check now!"}))
    }
    divsFooter.push(...[
        DCreate(SPAN,{class:STRsmall,append:[
            DCreate(INPUT,{type:STRcheckbox, id:my.idFor('btn-close-after-save'), attrs:{checked:'CHECKED'}})
          , DCreate(LABEL,{inner:'Fermer après save', attrs:{for:my.idFor('btn-close-after-save')}})
          ]})
      , DCreate(BUTTON, {id:my.idFor('btn-save'), type:STRbutton, class:'btn-save small main-button', inner:"Enregistrer", style:`visibility:${visuBtns};`})
      ])

    return [
        DCreate(DIV,{class:STRheader, append:divsHeader})
      , DCreate(DIV,{class:`body${this.dataPanels?' plain':''}`, append:[
            DCreate(SELECT,{id:my.idFor('menu_items'), class:'menu-items main'})
          , ...divsForm
          ]})
      , DCreate(DIV,{class:STRfooter, append:divsFooter})
      ]
  }

, afterBuilding(){
    this.peupleItems()

    // Si l'interface est composée de panneaux, il faut activer le premier
    if(this.dataPanels){
      this.dataPanels[0].activate()
    }

    if(this.data.items.length === 1 && this.data.no_new_item){
      this.menuItems[0].disabled = true
    }

  }

, idFor(suf){ return `${this.id}-${suf}`}

, observe(){
    this.jqObj.find(`#${this.id}-btn-add`).on(STRclick, this.addElement.bind(this))
    this.jqObj.find(`#${this.id}-btn-del`).on(STRclick, this.removeCurrentItem.bind(this))
    this.menuItems.on('change', this.editElement.bind(this))

    if(this.data.checkOnDemand){
      this.checkBtn.on(STRclick, this.onCheckOnDemand.bind(this))
    }

    this.saveBtn.on(STRclick, this.saveElement.bind(this))

    // Les champs d'édition répondent au cmd-enter pour soumettre le
    // formulaire (enfin… façon de parler)
    this.jqObj.find('textarea, input[type="text"], input[type="checkbox"], select').on('keydown', this.onKeyDownOnTextFields.bind(this))

    // S'il y a un bouton pour updater les valeurs d'un select, il faut
    // pouvoir actualiser ou ouvrir le fichier
    this.dataFields.map(dfield => dfield.observeIfNecessary())

    // Si l'interface est composée de panneaux, on met un observer
    // sur chaque onglet
    if(this.dataPanels){
      this.dataPanels.map(panel => panel.DOMOnglet.on(STRclick, panel.activate.bind(panel)))
    }

    // On rend les champs d'édition sensible au drop d'event, de temps
    UI.setDroppable(this.jqObj, {elements: 'all'})

    // S'il y a un item courant, on le met en édition
    if(this.data.current){
      this.editCurrent(this.data.current)
    }

  }
})
