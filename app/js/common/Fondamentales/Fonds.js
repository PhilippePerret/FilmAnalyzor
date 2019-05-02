'use strict'
/**
  Class Fonds
  -----------
  Pour les fondamentales
**/

class Fonds {
// ---------------------------------------------------------------------
//  CLASSE
static init(analyse){
  this.analyse = this.a = analyse
  this.loaded = false
  if ( this.exists() ) this.load()
  else this.loaded = true // pas de fondamentales
}

/**
  Méthode qui charge les fondamentales si
  elles existent.
**/
static load(){
  this.iofile.load({after: this.afterLoading.bind(this)})
}
static afterLoading(ydata){
  this.yaml_data = ydata
  this.loaded = true
}

/**
  Méthode principale qui retourne le code pour
  l'export des Fondamentales, i.e. le code qui sera
  inscrit dans l'eBook
**/
static export(options){
  let str = ''
  for(var fid in this.fds){
    str += this.fds[fid].export()
  }
  return str
}

// Retourne true si le fichier existe
static exists(){return fs.existsSync(this.path)}

/**
  Retourne les cinq fondamentales
  C'est une table avec en clé :
    fd1, fd2, etc.
**/
static get fds(){
  if(undefined === this._fds){
    this._fds = {
      fd1: new PersonnageFondamental(this.a, this.yaml_data.fd1)
    , fd2: new QuestionDramatiqueFondamentale(this.a, this.yaml_data.fd2)
    , fd3: new OppositionFondamentale(this.a, this.yaml_data.fd3)
    , fd4: new ReponseDramatiqueFondamentale(this.a, this.yaml_data.fd4)
    , fd5: new ConceptFondamental(this.a, this.yaml_data.fd5)
    }
  }
  return this._fds
}

static get iofile(){return this._iofile||defP(this,'_iofile', new IOFile(this))}
// Path au fichier des fondamentales
static get path(){return this._path||defP(this,'_path', this.a.fondsFilePath)}

// ---------------------------------------------------------------------
//  INSTANCES
//  Une Fondamentale
constructor(analyse){
  this.analyse = this.a = analyse
}

/**
  La méthode d'export commune à toutes les fondamentales

  +Options+
    :as     Pour déterminer si le retour doit être sous forme
            de string (défaut) ou sous forme de DOMElement ('dom')
            à append au document.
**/
export(options){
  let appends = [
    DCreate('H2', {class:'title', inner: this.hname})
  ]
  appends = this.addElementsTo(appends)
  this.facteurO_formated  && appends.push(this.divFacteurO)
  this.facteurU_formated  && appends.push(this.divFacteurU)
  this.scenes_formated    && appends.push(this.divScenes)

  let div = DCreate('DIV', {id: `fond${this.id}`, append: appends})
  if(options && options.as === 'dom'){
    return div
  } else {
    return div.outerHTML
  }
}

// ---------------------------------------------------------------------
// Méthodes d'Helper

/**
  Pour construire un DIV avec un LABEL et un SPAN.value

  +prop+      Propriété de l'instance (par exemple 'pseudo' ou 'question')
  +libelle+   Libellé gauche à afficher. Si non fourni, on titleize la
              propriété. P.e. 'description' => 'Description'
  +options+   Inutilisé mais permettra par exemple de changer la classe.
**/
libvalDiv(prop, libelle, options){
  let ghostProp = `_div${prop}`
  if(undefined === this[ghostProp] && this[prop]){
    if(undefined === libelle) libelle = prop.titleize()
    this[ghostProp] = DCreate('DIV', {class: 'libval normal', append:[
        DCreate('LABEL', {inner: libelle})
      , DCreate('SPAN', {class:'value', inner: this.formater(this[prop])})
    ]})
  }
  return this[ghostProp]
}

get formater(){
  if(undefined === this._formater){
    let fatexte = new FATexte('')
    this._formater = fatexte.formate.bind(fatexte)
  }
  return this._formater
}

// ---------------------------------------------------------------------
//  Méthodes d'helpers communes
get divDescription(){return this.libvalDiv('description')}
get divFacteurO(){return this.libvalDiv('facteurO_formated', 'Facteur O')}
get divFacteurU(){return this.libvalDiv('facteurU_formated', 'Facteur U')}
get divScenes(){return this.libvalDiv('scenes_formated', 'Scènes associées')}

// ---------------------------------------------------------------------
//  Données communes

get description(){return this.ydata.description}
get facteurO_formated(){
  if(undefined === this._facteurO_formated && (this.facteurO || this.description_factO)){
    let fa = this.facteurO
      , df = this.descFacteurO
    this._facteurO_formated = `${fa?fa + ' ': ''}${df?(fa?'. ':'')+df:''}`.trim()
  }
  return this._facteurO_formated
}
get facteurU_formated(){
  if(undefined === this._facteurU_formated && (this.facteurU || this.description_factU)){
    let fa = this.facteurU
      , df = this.descFacteurU
    this._facteurU_formated = `${fa?fa + ' ': ''}${df?(fa?'. ':'')+df:''}`.trim()
  }
  return this._facteurU_formated
}

get scenes_formated(){
  if(undefined === this._scenes_formated && this.scenes.length){
    let arr = []
    this.scenes.forEach(scene_id => arr.push(`{{scene:${scene_id}}}`))
    this._scenes_formated = arr.join(', ')
  }
  return this._scenes_formated
}
// ---------------------------------------------------------------------
//  Méthodes/données
get facteurO(){
  if(undefined === this._facteurO){
    if(this.ydata.facteurO === 'x/5') this._facteurO = null
    else this._facteurO = this.ydata.facteurO
  }
  return this._facteurO
}
get facteurU(){
  if(undefined === this._facteurU){
    if(this.ydata.facteurU === 'x/5') this._facteurU = null
    else this._facteurU = this.ydata.facteurU
  }
  return this._facteurU
}
get descFacteurO(){return this.ydata.description_factO}
get descFacteurU(){return this.ydata.description_factU}
get scenes(){return this.ydata.scenes || []}
get events(){return this.ydata.events || []}

get ydata(){return this._ydata}
// Le nom humain de la fondamentale, d'après sont 'type'
get hname(){return this._hname||defP(this,'_hname',this.type.titleize())}
}





class PersonnageFondamental extends Fonds {
constructor(analyse, ydata){
  super(analyse)
  this._ydata = ydata
}

// ---------------------------------------------------------------------
//  Méthodes d'export

/**
  Pour ajouter les éléments DOM à la méthode `export` principale
**/
addElementsTo(els){
  els.push(this.divPseudo)
  this.divDescription && els.push(this.divDescription)
  return els
}

// ---------------------------------------------------------------------
// Méthodes d'Helpers
get divPseudo(){return this.libvalDiv('pseudo')}

// ---------------------------------------------------------------------
// Données propres
get pseudo(){return this.ydata.pseudo}
// ---------------------------------------------------------------------
// Données générales
get type(){return 'personnage fondamental'}
get id(){return 1}
}



class QuestionDramatiqueFondamentale extends Fonds {
  constructor(analyse, ydata){
    super(analyse)
    this._ydata = ydata
  }

// ---------------------------------------------------------------------
//  Méthodes d'export

/**
  Pour ajouter les éléments DOM à la méthode `export` principale
**/
addElementsTo(els){
  this.divQuestion && els.push(this.divQuestion)
  this.divDescription && els.push(this.divDescription)
  this.objectif && els.push(this.divObjectif)

  return els
}
// ---------------------------------------------------------------------
//  Méthodes d'Helpers
get divQuestion(){return this.libvalDiv('question')}
get divObjectif(){return this.libvalDiv('objectif')}

// ---------------------------------------------------------------------
// Données propres
get question(){return this._question||defP(this,'_question', this.ydata.question)}
get objectif(){return this._objectif||defP(this,'_objectif', this.ydata.objectif)}
// ---------------------------------------------------------------------
// Données générales
get type(){return 'question dramatique fondamentale'}
get id(){return 2}
}







class OppositionFondamentale extends Fonds {
  constructor(analyse, ydata){
    super(analyse)
    this._ydata = ydata
  }
// ---------------------------------------------------------------------
//  Méthodes d'export

/**
  Pour ajouter les éléments DOM à la méthode `export` principale
**/
addElementsTo(els){
  this.opposition   && els.push(this.divOpposition)
  this.description  && els.push(this.divDescription)
  this.antagoniste  && els.push(this.divAntagoniste)
  this.antagonisme  && els.push(this.divAntagonisme)
  return els
}

// ---------------------------------------------------------------------
// Méthodes d'helper
get divOpposition(){return this.libvalDiv('opposition')}
get divAntagoniste(){return this.libvalDiv('antagoniste')}
get divAntagonisme(){return this.libvalDiv('antagonisme')}

// ---------------------------------------------------------------------
// Données propres
get opposition(){return this._opposition||defP(this,'_opposition', this.ydata.opposition)}
get antagoniste(){return this._antagoniste||defP(this,'_antagoniste', this.ydata.antagoniste)}
get antagonisme(){return this._antagonisme||defP(this,'_antagonisme', this.ydata.antagonisme)}

// ---------------------------------------------------------------------
// Données générales
get type(){return 'opposition fondamentale'}
get id(){return 3}
}






class ReponseDramatiqueFondamentale extends Fonds {
  constructor(analyse, ydata){
    super(analyse)
    this._ydata = ydata
  }
// ---------------------------------------------------------------------
//  Méthodes d'export

/**
  Pour ajouter les éléments DOM à la méthode `export` principale
**/
addElementsTo(els){
  this.reponse && els.push(this.divReponse)
  this.typeR && els.push(this.divTypeR)
  this.divDescription && els.push(this.divDescription)
  this.signification && els.push(this.divSignification)
  return els
}
// ---------------------------------------------------------------------
get divReponse(){return this.libvalDiv('reponse', 'Réponse')}
get divSignification(){return this.libvalDiv('signification')}
get divTypeR(){return this.libvalDiv('typeR_formated', 'Type')}

// ---------------------------------------------------------------------
// Données propres
get reponse() {return this.ydata.reponse}
get typeR_formated(){
  if(undefined === this._typeR_formated){
    this._typeR_formated = this.typeR
    if(this.typeR.match(/MAIS/)) this._typeR_formated += ' (paradoxale)'
  }
  return this._typeR_formated
}
get typeR()   {return this.ydata.typeR}
get signification(){return this.ydata.signification}

// ---------------------------------------------------------------------
// Données générales
get type(){return 'réponse dramatique fondamentale'}
get id(){return 4}
}






class ConceptFondamental extends Fonds {
constructor(analyse, ydata){
  super(analyse)
  this._ydata = ydata
}
// ---------------------------------------------------------------------
//  Méthodes d'export

/**
  Pour ajouter les éléments DOM à la méthode `export` principale
**/
addElementsTo(els){

  this.divDescription && els.push(this.divDescription)
  return els
}

// ---------------------------------------------------------------------
// Données propres

// ---------------------------------------------------------------------
// Données générales
get type(){return 'concept fondamental'}
get id(){return 5}
}


module.exports = Fonds
