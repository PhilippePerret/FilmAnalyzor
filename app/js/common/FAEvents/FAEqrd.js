'use strict'

class FAEqrd extends FAEvent {
// ---------------------------------------------------------------------
//  CLASSE

static get OWN_PROPS(){return [[STRquestion, 'shorttext1'], [STRreponse, 'shorttext2'], 'tps_reponse',[STRexploit, 'longtext3']]}
static get OWN_TEXT_PROPS(){ return [STRquestion, STRreponse, STRexploitation]}
static get TEXT_PROPERTIES(){return this._tprops||defP(this,'_tprops',FAEvent.tProps(this.OWN_TEXT_PROPS))}


/**
  Initialise les QRDs
**/
static init(){

}

/**
  Réinitialisation, par exemple quand on crée une nouvelle analyse ou
  lorsqu'on en charge une autre.
**/
static reset(){
  delete this._qrds
  delete this._sorted
  return this // chainage
}

static get section(){return $('section#section-qrd-pp')}

/**
  Répète la méthode +fn+ sur toutes les QRD du film

  @param {Function} fn La méthode à utiliser, qui doit recevoir l'event
                        en premier argument.
**/
static forEachQRD(fn){
  for(var qrd of this.qrds){
    if ( isFalse(fn(qrd)) ) break // pour interrompre
  }
}
static forEachSortedQRD(fn){
  for(var qrd of this.sortedQrds){
    if ( isFalse(fn(qrd)) ) break // pour interrompre
  }
}

static get qrds(){return this._qrds||defP(this,'_qrds',this.defineLists().qrds)}
static get sortedQrds(){return this._sorted||defP(this,'_sorted',this.defineLists().sorted)}

static defineLists(){
  var qrds    = []
    , sorteds = []

  current_analyse.forEachEvent(function(ev){
    if(ev.type === STRqrd) qrds.push(ev)
  })
  sorteds = Object.assign([], qrds)
  sorteds.sort((a, b) => {return a.time - b.time})

  return {qrds: qrds, sorted: sorteds}
}

// ---------------------------------------------------------------------
//  INSTANCE
constructor(analyse, data){
  super(analyse, data)
  // Après la création de la qrd, on vérifie toujours pour savoir s'il
  // faut l'inscrire dans la "warning-section" des procédés sans résolution
  // NON : IL FAUT LE FAIRE UNE FOIS QUE TOUT EST CHARGÉ
  // this.checkResolution()
}

get isValid(){
  var errors = []

  // Définir ici les validité
  this.question || errors.push({msg: "La Question Dramatique est requise.", prop: 'inputtext1'})
  this.content  || errors.push({msg: "La description de cette QRD est requise.", prop: 'longtext1'})
  if(this.reponse){
    this.tps_reponse || errors.push({msg: "Le temps de la réponse est requis.", prop: 'tps_reponse'})
    isNumber(this.tps_reponse) || errors.push({msg: "Le temps de réponse devrait être un nombre", prop: 'tps_reponse'})
  }

  if(errors.length){super.onErrors(this, errors)}
  return errors.length == 0
}

/**
  Méthode qui vérifie que la qrd possède bien une réponse et,
  le cas échéant, l'inscrit dans la "warning-section"
**/
checkResolution(){
  if ( isDefined(this.reponse) && isNotEmpty(this.reponse) ) return
  UI.warningSection.append(DCreate(DIV, {inner: this.as(STRshort, EDITABLE|LABELLED)}))
}

/**
  @return {Boolean} true si les informations minimales sont fournies pour
  construire la QRD, à savoir :
    - la question
    - la réponse
    - le temps de la réponse
**/
isComplete(){
  return !!(this.question && this.question.length > 0
      && this.reponse  && this.reponse.length > 0
      && this.tps_reponse)
}

/**
  @return {Number} Le numéro de la scène à laquelle appartient
                   la QUESTION dramatique
**/
get sceneQ(){
  isDefined(this._sceneQ) || ( this._sceneQ = FAEscene.at(this.time) )
  return this._sceneQ
}

get sceneR(){
  if(!this.tps_reponse) return
  isDefined(this._sceneR) || ( this._sceneR = FAEscene.at(this.tps_reponse) )
  return this._sceneR
}

}
