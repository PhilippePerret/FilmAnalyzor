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
const ASSOCIATES  = 2048
const DISSOCIABLE = 4096  // pour ajouter un lien pour dissocier l'élément
