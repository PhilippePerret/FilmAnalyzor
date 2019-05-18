'use strict'

Object.assign(FABuildingScript,{

/**
  Méthode appelée quand on dépose une étape sur la liste "in". Donc
  pour ajouter une étape.
  On la coche est on règle son draggable pour pouvoir la remettre après
  dans la liste.
**/
  addStep(e, ui){
    let target  = $(e.target)
      , dropped = $(ui.helper)
      , drop_id = dropped.data('id')
      , drop_type = dropped.data('type')

    // console.log("-> addStep, target, dropped, drop_id", target, dropped, drop_id)
    let droppedIsImage  = drop_type === STRimage
      , droppedIsBrin   = drop_type === STRbrin
      , droppedIsStep   = !(droppedIsImage||droppedIsBrin)

    if ( droppedIsStep ) {
      dropped.find('input[type="checkbox"]')[0].checked = true
      dropped.draggable(STRoption, 'connectToSortable','#bse-steps-outlist')
    } else {
      let inst = this.a.instanceOfElement({type:drop_type, id:dropped.data(STRid)})
        , odiv = this.divStepFor({hname:`${inst.title}`, type:drop_type, id:`${inst.id}`, checked:true})
      target.append(odiv)
      this.observeDiv(odiv)
    }
    // TODO Il faut construire un "-" pour retirer tout élément

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

/**
  Méthode appelée quand on click sur un bouton "-" dans la liste du script
  d'assemblage, pour le retirer.
**/
, wantSupStep(e){
    $(e.target).parent().remove()
    this.modified = true
  }
})
