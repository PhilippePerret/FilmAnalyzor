'use strict'

module.exports = {
/**
  On cherche la place en hauteur du div de l'élément (event)
  Pour procéder on passe en revue tous les events (affichés) et on cherche
  une rangée où l'élément puisse être placé.
**/
defineTopDiv(element){
  var kel, el, row, rowsOccuped = []
  for(kel in this.items){
    el = this.items[kel]
    // On exclut les éléments qui sont avant ou après l'élément courant
    if(el.right < element.left) continue
    if(el.left > element.right) continue
    // On prend les rangées sur lesquelles sont placés les éléments
    // superposés
    rowsOccuped.push(el.row)
  }

  rowsOccuped.sort()
  // console.log("rowsOccuped:", rowsOccuped)

  for(var i=0;i<this.MAX_ROWS;++i){
    if(parseInt(i,10) != rowsOccuped[i]) {
      element.row = parseInt(i,10)
      break
    }
  }
  if(isUndefined(element.row)){
    element.row = 1
  }
  return this.FIRST_TOP_ELEMENT + element.row * 20
}// /defineTopDiv

}
