'use strict'

/**
  Pour les flags décrivant les exports et formatages
  Cf. par exemple la méthode `FAEscene.as`
**/
const TLINED_UP = 1   // Ajouter mini-timeline au-dessus
const TLINED_DW = 2   // Ajouter mini-timeline en dessous
const LINKED    = 4
const DUREE     = 8
const TIME      = 16
const FORMATED  = 32
const NUMERO    = 64
const NUM       = 128
const LABELLED  = 256 // pour mettre le type et l'id devant
const EDITABLE  = 512 // L'élément est lié à son édition
// pour escaper les guillemets, supprimer les balises <...>
// et les retours chariot. C'est la version qui doit être
// utilisée comme flag quand on doit placer le texte, par
// exemple, dans l'attribut `title` d'une balise.
const ESCAPED   = 1024

/**
  Données communes pour dropper les events, documents et times
  @usage
    <set jquery>.droppable(
      Object.assign({),DATA_DROPPABLE, {drop: function(i,o){...}})
    )
**/
const DATA_DROPPABLE = {
  accept: '.event, .doc, .dropped-time, .brin'
, tolerance: 'intersect'
, drop: null
, classes: {'ui-droppable-hover': 'survoled'}
}
