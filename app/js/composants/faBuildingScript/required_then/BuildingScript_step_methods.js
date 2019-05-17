'use strict'

Object.assign(FABuildingScript,{

/**
  Méthode appelée quand on dépose une étape sur la liste "in". Donc
  pour ajouter une étape.
  On la coche est on règle son draggable pour pouvoir la remettre après
  dans la liste.
**/
  addStep(e, ui){
    let target = $(e.target)
      , dropped = $(ui.helper)
      , drop_id = dropped.data('id')

    // console.log("-> addStep, target, dropped, drop_id", target, dropped, drop_id)
    dropped.find('input[type="checkbox"]')[0].checked = true
    dropped.draggable(STRoption, 'connectToSortable','#bse-steps-outlist')
  }

/**
  Méthode appelée quand on supprime une étape en la déposant sur la liste "ou"
**/
, supStep(e, ui){
    let target = $(e.target)
      , dropped = $(ui.helper)
      , drop_id = dropped.data('id')
    // console.log("-> supStep, target, dropped, drop_id", target, dropped, drop_id)
    dropped.draggable(STRoption, 'connectToSortable','#bse-steps-list')
  }
})
