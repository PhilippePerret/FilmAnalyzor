'use strict'

class FAEaction extends FAEvent {
// ---------------------------------------------------------------------
//  CLASSE

// Propriétés propres
static get OWN_PROPS(){ return ['actionType'] }

// ---------------------------------------------------------------------
//  INSTANCE
constructor(analyse, data){
  super(analyse, data)
}

get isValid(){
  var errors = []

  // Définir ici les validité
  this.content || errors.push({msg: "La description de l'action est indispensable.", prop: 'longtext1'})

  if(errors.length){super.onErrors(this, errors)}
  return errors.length == 0
}

}
