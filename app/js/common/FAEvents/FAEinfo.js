'use strict'

class FAEinfo extends FAEvent {
// ---------------------------------------------------------------------
//  CLASSE

// Propriétés propres aux informations
static get OWN_PROPS(){return ['infoType']}

// ---------------------------------------------------------------------
//  INSTANCE
constructor(analyse, data){
  super(analyse, data)
}

get isValid(){
  var errors = []

  // Définir ici les validité
  this.content || errors.push({msg: "Le contenu de l'information est requis.", prop: 'longtext1'})

  if(errors.length){super.onErrors(this, errors)}
  return errors.length == 0
}

}
