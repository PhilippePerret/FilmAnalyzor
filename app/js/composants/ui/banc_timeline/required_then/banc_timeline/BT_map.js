'use strict'

Object.assign(BancTimeline,{
  /**
    Définition de la "map" du banc timeline. L'idée est de faire une carte
    qui contienne les positions des éléments sur le banc, pour un placement
    plus efficace des éléments. Au lieu de parcourir tous les éléments dans le
    DOM, on parcourera une Map.

    On profite aussi de cette boucle pour placer les items sur des rows sans
    chevauchement.
  **/
  defineMap(){
    var row
    this.map = new Map()

    // Pour connaitre les rangées occupées à un moment de la boucle sur tous
    // les éléments, on tient à jour cette collection busyRows où les clés
    // sont les indices de rangée (de 1 à SCENE_ROW) et la valeur est true (si
    // la rangée est libre) ou false (si la rangée est occupée)
    let busyRows = new Map()
    let indexSceneRow = BancTimelineElement.SCENE_ROW
    var i = indexSceneRow
    while ( --i > 0 ) busyRows.set(indexSceneRow - i, null)

    // On peut boucler sur chaque items ({BancTimelineElement})
    for (var item of this.items) {

      // Déterminer la rangée sur laquelle poser l'élément courant +item+
      var row = undefined

      if ( item.event.isScene ) {
        // Si c'est une scène, la rangée SCENE_ROW est réservée à son
        // placement.
        row = indexSceneRow
      } else {
        for ( var [irow, drow] of busyRows) {
          if ( isNull(drow) ) {
            // Dans le cas où la rangée analysée est vide, on prend simplement
            // son indice pour l'appliquer à la rangée de l'item et on définit
            // la fin de l'utilisation de cette rangée.
            row = irow
            break
          } else {
            // La rangée d'indice +irow+ est utilisée. Deux cas peuvent se
            // produire ici :
            // CAS 1: le temps de l'élément à placer est inférieur au temps
            //        de fin d'utilisation de la rangée => Il faut essayer
            //        avec la suivante
            // CAS 2: le temps de l'élément à placer est supérieur au temps
            //        de fin d'utilisation de la rangée => on peut placer
            //        l'élément dessus est définir le temps d'utilisation de
            //        fin de l'élément
            if ( item.event.startAt > drow.end ) { // CAS 2
              row = irow
              break
            } else { // CAS 1
              // On doit essayer avec le suivant
            }
          }
        }
      }

      if ( row ) {
        busyRows.set(row, { end: item.event.endAt } )
        item.row = row
        // console.log("Rangée pour item:", item, row)
      } else {
        log.error(`Impossible de trouver une rangée libre pour ${item}`)
      }

    } // fin de boucle sur tous les éléments à placer (items)

  }

})
