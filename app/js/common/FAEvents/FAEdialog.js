'use strict'

class FAEdialog extends FAEvent {
// ---------------------------------------------------------------------
//  CLASSE

// Propriétés propres au dialogue
static get OWN_PROPS(){return ['dialogType', ['quote', 'longtext2']]}

// ---------------------------------------------------------------------
//  INSTANCE
constructor(analyse, data){
  super(analyse, data)
}


get isValid(){
  var errors = []

  // Définir ici les validité
  this.quote      || errors.push({msg: "Il faut donner le dialogue dont il est question", prop: 'longtext2'})
  this.content    || errors.push({msg: "La description du dialogue est indispensable.", prop: 'longtext1'})
  this.dialogType || errors.push({msg: "Le type de dialogue est à définir.", prop: 'dialogType'})
  // TODO: Le type (dialogType) est-il vraiment indispensable ?

  if(errors.length){super.onErrors(this, errors)}
  return errors.length == 0
}

}
