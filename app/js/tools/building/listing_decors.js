'use strict'


Object.defineProperty(FADecor,'DataFAListing',{get(){return {
  items: Object.values(this.data)
  // items:[]
, asListItem(decor, opts){
    // console.log("Traitement de item : ", item)
    // Ici, l'item est un décor (FADecor)

    // les scènes qui n'appartiennent pas à des sous-décors
    // On commence par faire la liste des scènes qui appartiennent aux
    // sous-décors du décor, pour ne pas avoir à les prendre
    var scenesSousDecors = {}
    decor.forEachSousDecor(function(sousdec){
      sousdec.forEachScene(scene => scenesSousDecors[scene.numero] = true)
    })
    // Maintenant que la liste des toutes les scènes qui appartiennent à
    // des sous-décors du décor est établie, on peut traiter les scènes qui
    // n'appartienne qu'au décor, pas à un sous-décor.
    var divsScenesMain = []
    decor.forEachScene(function(scene){
      if (undefined === scenesSousDecors[scene.numero]){
        divsScenesMain.push(DCreate(DIV, {inner: scene.as('pitch', EDITABLE)}))
      }
    })
    // Les sous-décors
    var divsSousDecors = []
    decor.forEachSousDecor(function(sousdec){
      var divsScenes = []
      sousdec.forEachScene(function(scene){
        divsScenes.push(DCreate(DIV, {inner: scene.as('pitch', LINKED|EDITABLE)}))
      })
      divsSousDecors.push(DCreate(DIV, {class:'sous-decor', inner: DFormater(sousdec.name)}))
      divsSousDecors.push(DCreate(DIV, {class:'scenes', append:divsScenes}))
    })

    return DCreate(LI,{append:[
      DCreate(DIV, {class:'decor', inner: DFormater(decor.name).toLowerCase()})
    , DCreate(DIV, {class: 'scenes', append: divsScenesMain})
    , DCreate(DIV, {class:'sous-decors', append:divsSousDecors})
    ]})
  }
, explication: 'La liste des décors est seulement en consultation. Pour les modifier, modifier les intitulés de scène.'
, editable:     false
, creatable:    false
, associable:   true
, removable:    false
, associates:   false
, statistiques: true
, collapsable:  true
}}})


if (NONE === typeof(FAListing)) window.FAListing = require('../../system/FA_Listing')
FAListing.extend(FADecor)
