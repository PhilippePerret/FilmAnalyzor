'use strict'

class FAEnote extends FAEvent {
// ---------------------------------------------------------------------
//  CLASSE

// Propriétés propres aux notes
static get OWN_PROPS(){return ['noteType']}

// ---------------------------------------------------------------------
//  INSTANCE
constructor(analyse, data){
  super(analyse, data)
}

get isValid(){
  var errors = []

  // Définir ici les validité
  this.content || errors.push({msg: "Le contenu de la note est requis.", prop: 'longtext1'})

  if(errors.length){super.onErrors(this, errors)}
  return errors.length == 0
}

}
