'use strict'
/**
 * Ce module du FAWriter est le module minimum chargé tout le temps, qui
 * contient les données minimum à connaitre.
 */

Object.assign(FAWriter, {
  // what:'Extension de FAWriter pour la construction du writer'

// Rappel : appelé par la FWindow
  build(){
    var spa, lab, sel

    var btnClose = DCreate('BUTTON', {
      id: 'btn-close-writer'
    , class: 'btn-close'
    , type: 'button'
    })
    spa = DCreate('SPAN', {
      class: 'writer-btn-drop document'
    , attrs: {'data-type': 'document', 'title': "Pour glisser et déposer le document sur un event ou un texte."}
    , inner: ' ⎆'
    })
    var doctitle = DCreate('DIV',{
      id: 'writer-doc-title'
    , append: [
      DCreate('SELECT', {id: 'document-type', class: 'main'})
      , spa
    ]
    })

    var divmodeles = DCreate('DIV', {
      class: 'div-modeles right'
    , append: [
        DCreate('LABEL', {class: 'small', inner: 'MODÈLES '})
      , DCreate('SELECT', {id: 'modeles-doc'})]
    })

    var btnNew = DCreate('BUTTON', {
      id: 'writer-btn-new-doc'
    , inner: '+'
    , type: 'button'
    })

    var header = DCreate('DIV',{
      class: 'header'
    , append: [btnClose, doctitle, divmodeles, btnNew]
    })

    var body = DCreate('DIV', {
      class: 'body'
    , append: [DCreate('TEXTAREA', {id: 'document-contents', attrs:{autofocus: true}})]
    })

    var opts = []
    var themes = {'': 'Thème…', 'real-theme': 'Normal', 'data-theme':'Données', 'musical-theme':'Musical'}
    for(var theme in themes){ opts.push(DCreate('OPTION', {value: theme, inner: themes[theme]}))}
    var selThemes = DCreate('SELECT', {
      id: 'writer-theme'
    , class: 'fleft'
    , append: opts
    })

    var footer = DCreate('DIV', {
      class: 'footer',
      append: [
        DCreate('LABEL', {id: 'writer-message', inner: '...'})
      , selThemes
      , DCreate('LABEL', {class:'fleft', inner: 'Taille du texte : '})
      , DCreate('SPAN', {id: 'text-size', class:'fleft', inner: '...'})
      , DCreate('LABEL', {inner: 'Visualiser', attrs:{for: 'cb-auto-visualize'}})
      , DCreate('INPUT', {id: 'cb-auto-visualize', attrs: {type: 'checkbox'}})
      , DCreate('LABEL', {inner: 'Auto-save', attrs:{for: 'cb-save-auto-doc'}})
      , DCreate('INPUT', {id: 'cb-save-auto-doc', attrs: {type: 'checkbox'}})
      , DCreate('BUTTON', {id: 'btn-save-doc', inner: 'Enregistrer', type: 'button'})
      ]
    })

    return [header, body, footer]
}
// Appelé par la FWindow
, afterBuilding(){
  // Peupler la liste des types de document
  var m = this.menuTypeDoc, dOpt
  for(var did in DATA_DOCUMENTS){
    var ddoc = DATA_DOCUMENTS[did]
    if(ddoc.menu === false) continue
    if(ddoc === 'separator') dOpt = {class: 'separator', disabled: true}
    else dOpt = {value: `regular^^^${did}`, inner: ddoc.hname}
    m.append(DCreate('OPTION', dOpt))
  }
  // Pour séparer les documents propres à cette analyse
  m.append(DCreate('OPTION', {class: 'separator', disabled: true}))
  // La liste des documents propres à cette analyse
  this.forEachUserDocument(function(wdoc){
    m.append(DCreate('OPTION', {value: `custom^^^${wdoc.id}`, inner: wdoc.title}))
  })
}
// Appelé par la FWindow
, observe(){
    var my = this
    // On observe le menu de choix d'un document
    my.menuTypeDoc.on('change', my.onChooseTypeDoc.bind(my))
    // On observe le menu de choix d'un modèle de document
    my.menuModeles.on('change', my.onChooseModeleDoc.bind(my))
    // On observe le menu qui choisit le thème
    my.menuThemes.on('change', my.onChooseTheme.bind(my))

    // On observe le champ de texte
    my.docField
      .on('change',    my.onContentsChange.bind(my))
      .on('focus',     my.onFocusContents.bind(my))
      .on('blur',      my.onBlurContents.bind(my))
      .on('keydown',   my.onKeyDown.bind(my))
      .on('keyup',     my.onKeyUp.bind(my))

    // Méthode communes d'extension
    this.setTextFieldsAssociableIn(my.section)

    // Le bouton pour sauver le document courant
    my.btnSave.on('click',my.saveCurrentDoc.bind(my))
    // On observe la case à cocher qui permet de sauvegarder automatiquement
    // le document
    $('input#cb-save-auto-doc').on('click', my.setAutoSave.bind(my))
    // // On observe la case à cocher pour visualiser régulièrement le document
    $('input#cb-auto-visualize').on('change', my.setAutoVisualize.bind(my))

    // On observe le bouton pour créer un nouveau document
    $('button#writer-btn-new-doc').on('click', FADocument.new.bind(FADocument))

    // On rend le petit bouton pour drag-dropper le document courant
    // draggable
    my.btnDrop.draggable({
      revert: true
    , zIndex: 5000
    })

    // Mettre la taille : non, ça doit se régler à chaque ouverture

    my.ready = true
  }

})
