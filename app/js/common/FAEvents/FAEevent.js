'use strict'


// Pour la compatibilité avec les autres types
class FAEevent extends FAEvent {

static get OWN_PROPS(){return []}
static get OWN_TEXT_PROPS(){ return []}
static get TEXT_PROPERTIES(){return this._tprops||defP(this,'_tprops',FAEvent.tProps(this.OWN_TEXT_PROPS))}

constructor(analyse, data){
  super(analyse, data)
}

get isValid(){
  var errors = []

  // Définir ici les validité
  this.content  || errors.push({msg: 'Le contenu de l’event est absolument requis', prop: 'longtext1'})

  if(errors.length){super.onErrors(this, errors)}
  return errors.length == 0
}


}
