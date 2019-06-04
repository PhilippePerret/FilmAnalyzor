'use strict'
/**
    Extension du porte-documents
 */

Object.assign(PorteDocuments, {
  // what:'Extension de PorteDocuments pour la construction du writer'

// Rappel : appelé par la FWindow
  build(){
    var lab, sel

    var attrs = {'title': "Pour glisser et déposer le document sur un event ou un texte."}
    attrs[STRdata_type] = STRdocument

    var header = DCreate(DIV,{class:STRheader, append:[
        DCreate(BUTTON, {id:'btn-close-writer', class:'btn-close', type:STRbutton})
      , DCreate(DIV,{id:'writer-doc-title', append:[
          DCreate(SELECT, {id: 'document-type', class: 'main'})
        , DCreate(SPAN, {class:'writer-btn-drop document', attrs:attrs, inner:' ⎆'})
        ]})
      , DCreate(DIV,{class:'div-modeles right', append:[
            DCreate(LABEL, {class: 'small', inner: 'MODÈLES '})
          , DCreate(SELECT, {id: 'modeles-doc'})
        ]})
      , DCreate(BUTTON,{id:'writer-btn-new-doc', inner:'+', type:STRbutton})
    ]})

    var body = DCreate(DIV, {
      class: STRbody
    , append: [DCreate(TEXTAREA, {id: 'document-contents', attrs:{autofocus: true}})]
    })

    var opts = []
    var themes = {'': 'Thème…', 'real-theme': 'Normal', 'data-theme':'Données', 'musical-theme':'Musical'}
    for(var theme in themes){ opts.push(DCreate(OPTION, {value: theme, inner: themes[theme]}))}
    var selThemes = DCreate(SELECT, {
      id: 'writer-theme'
    , append: opts
    })

    var footer = DCreate(DIV, {
      class: STRfooter,
      append: [
        DCreate(BUTTON, {id: 'btn-save-doc', class:'fright small main-button', inner: 'Enregistrer', type: STRbutton})
      , DCreate('SPACE') // juste pour éviter le BUTTON + SPAN
      , DCreate(SPAN, {id: 'writer-message', inner: '...'})
      , selThemes
      , DCreate(LABEL, {inner: 'Taille du texte'})
      , DCreate(SPAN,  {id: 'text-size', inner: '...'})
      , DCreate(LABEL, {inner: 'Visualiser', attrs:{for: 'cb-auto-visualize'}})
      , DCreate(INPUT, {id: 'cb-auto-visualize', attrs: {type: STRcheckbox}})
      , DCreate(LABEL, {inner: 'Auto-save', attrs:{for: 'cb-save-auto-doc'}})
      , DCreate(INPUT, {id: 'cb-save-auto-doc', attrs: {type: STRcheckbox}})
      ]
    })

    return [header, body, footer]
}
// Appelé par la FWindow
, afterBuilding(){
  // Peupler la liste des types de document
  var m = this.menuDocuments, dOpt
  for(var did in DATA_DOCUMENTS){
    var ddoc = DATA_DOCUMENTS[did]
    if(ddoc.menu === false) continue
    if(ddoc === 'separator') dOpt = {class: 'separator', disabled: true}
    else dOpt = {value: `${ddoc.id}`, inner: ddoc.hname}
    m.append(DCreate(OPTION, dOpt))
  }
  // Pour séparer les documents propres à cette analyse
  m.append(DCreate(OPTION, {class: 'separator', disabled: true}))
  // La liste des documents propres à cette analyse
  this.forEachCustomDocument(function(wdoc){
    m.append(DCreate(OPTION, {value: wdoc.id, inner: wdoc.title}))
  })
}
// Appelé par la FWindow
, observe(){
    var my = this
    // On observe le menu de choix d'un document
    my.menuDocuments.on(STRchange, my.onChooseDocument.bind(my))
    // On observe le menu de choix d'un modèle de document
    my.menuModeles.on(STRchange,  my.onChooseModeleDoc.bind(my))
    // On observe le menu qui choisit le thème
    my.menuThemes.on(STRchange,   my.onChooseTheme.bind(my))

    // On observe le champ de texte
    my.docField
      .on(STRchange,  my.onContentsChange.bind(my))

    // Méthode communes d'extension
    this.setTextFieldsAssociableIn(my.section)

    // Le bouton pour sauver le document courant
    my.btnSave.on(STRclick,my.saveCurrentDoc.bind(my))
    // On observe la case à cocher qui permet de sauvegarder automatiquement
    // le document
    $('input#cb-save-auto-doc').on(STRclick, my.setAutoSave.bind(my))
    // // On observe la case à cocher pour visualiser régulièrement le document
    $(this.cbVisualize).on(STRchange, my.setAutoVisualize.bind(my))

    // On observe le bouton pour créer un nouveau document
    $('button#writer-btn-new-doc').on(STRclick, FADocument.new.bind(FADocument))

    // On rend le petit bouton pour drag-dropper le document courant
    // draggable
    my.btnDrop.draggable({
      revert: true
    , zIndex: 5000
    })

    my.ready = true
  }

})
