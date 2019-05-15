'use strict'
/**
  Class FAPersonnage
  ------------------
  Gestion des personnages
**/

class FAPersonnage extends FAElement {
// ---------------------------------------------------------------------
//  CLASS

static get modified(){return this._modified}
static set modified(v){
  this._modified = v
}

static show(perso_id){
  this.a.togglePanneauPersonnages(true/*ouvert*/)
  this.listing.select(perso_id)
}

static destroy(perso_id){
  delete this.data[perso_id]
  this.reset()
  if(this.listing){
    this.listing._items = this.personnages
    this.listing.update()
  }
  this.modified = true
}

/**
  Boucle la fonction +fn+ sur chaque personnage
  Si la fonction retourne exactement false, on breake.
**/
static forEachPersonnage(fn){
  for(var personnage of this.personnages){
    if(false === fn(personnage)) break
  }
}

static init(){
  if(this.exists()){
    try {
      this._data = YAML.safeLoad(fs.readFileSync(this.path,'utf8'))
    } catch (e) {
      F.error(`Une erreur est survenue en chargeant les données personnages (${this.path})${RC+RC}Lig. ${e.mark.line} : ${e.message}.${RC+RC}Consulter le log pour de plus amples détails.${RC}<span class="small">(il est vivement conseillé de ne pas modifier les données en dehors de l'application, au risque de produire ce genre d'erreur)</span>`)
      console.error(e)
    }
  }
}

/**
Réinitialisation totale de la donnée. Comme par exemple après une modification
du fichier de données.
**/
static resetAll(){
  delete this._data
  this.reset()
  return this // chainage
}

static reset(){
  delete this._diminutifs
  delete this._personnages
  delete this._hpersonnages
  delete this._count
  delete this._path
  return this // chainage
}

/**
  Récupère les diminutifs dans données des personnages et les
  renvoie (souvent pour les diminutifs eux-mêmes)
**/
static get diminutifs(){
  if(!this.exists()) return {}
  if(undefined === this._diminutifs){
    this._diminutifs = {}
    for(var pseudo in this.data){
      if(this.data[pseudo].dim){
        // this._diminutifs[this.data[pseudo].dim] = this.data[pseudo].pseudo
        this._diminutifs[this.data[pseudo].dim] = this.data[pseudo]
      }
    }
  }
  return this._diminutifs
}

// Retourne le personnage de pseudo +pseudo+ (instance FAPersonnage)
// NON, personnages est un array. Si on a besoin de cette méthode,
// utiliser un hash.
static get(pseudo){
  return this.hpersonnages[pseudo]
}

static get personnages(){
  if(undefined === this._personnages){
    var ipersonnage
    this._personnages = []
    this._hpersonnages = {}
    for(var pid in this.data){
      this.data[pid].id = pid
      ipersonnage = new FAPersonnage(current_analyse, this.data[pid])
      this._personnages.push(ipersonnage)
      this._hpersonnages[pid] = ipersonnage
    }
  }
  return this._personnages
}

static get hpersonnages(){
  if(undefined === this._hpersonnages) this.personnages
  return this._hpersonnages
}

static saveIfModify(){
  if(!this.modified) return
  // On doit reconstituer this._data
  var hdata = {}
  this.forEachPersonnage(perso => hdata[perso.id] = perso.getData())
  this._data = hdata
  hdata = null
  this.DESave()
}

/**
  Méthode utilitaire (utilisée pour les statistiques pour le moment) qui
  retourne sous forme d'instance la liste des personnages qu'on peut trouver
  dans le texte +str+.

  @return {Array of FAPersonnage|Undefined} La liste des personnages trouvés par
  leur diminutif (@X) ou undefined si aucun

**/
static get REG_DIM_PERSO(){return this._regdimperso||defP(this,'_regdimperso', new RegExp('@([a-zA-Z0-9_]+)', 'g'))}
static getPersonnagesIn(str){
  if(!str.match(/\@/)) return
  // Note : puis REG_DIM_PERSO est défini avec 'g', tous les résultats
  // trouvés se trouvent dans `dims` qui est une simple liste des diminutifs
  var dims = str.match(this.REG_DIM_PERSO)
  if(dims.length == 0) return
  return dims.map(dim => this.get(this.diminutifs[dim.substring(1,dim.length)].id))
}

// Retourne le nombre de personnages
static get count(){return this._count||defP(this,'_count', Object.keys(this.data).length)}

static get data(){return this._data || {}}
static exists(){return fs.existsSync(this.path)}
static get path(){return this._path||defP(this,'_path',this.a.filePathOf('dpersonnages.yaml'))}
static get a(){return current_analyse}

// ---------------------------------------------------------------------
//  INSTANCE
constructor(analyse, data){
  super(data)
  this.analyse = this.a = analyse
  this.type = 'personnage' // utile pour les associations
}

toString(){return `${this.pseudo} (#${this.id})`}

/**
  Retourne les données du personnage pour enregistrement
**/
getData(){
  var hdata = {}, v
  this.constructor.PROPS.map(p => {
    v = this[p]
    if(undefined === v || null === v ) return
    if (Array.isArray(v) && v.length==0) return
    if ('object' === typeof(v) && Object.keys(v).length == 0) return
    hdata[p] = v
  })
  hdata.associates = this.associatesEpured()
  if(!hdata.associates) delete hdata.associates
  return hdata
}

static get PROPS(){
  if(undefined === this._props){
    this._props = ['id','pseudo','dim','prenom','nom','dimensions','ages','description','fonctions','associates']
  }
  return this._props
}

set modified(v){
  this._modified = v
  this.constructor.modified = v
  if(v) this.onUpdate()
  if(PanelPersos.opened) PanelPersos.btnOK.html(v ? 'Enregistrer' : 'OK')
}

get pseudo(){return this._pseudo}
get id(){return this._id}
get prenom(){return this._prenom}
get nom(){return this._nom}
get dim(){return this._dim}
get ages(){return this._ages}
get fonctions(){return this._fonctions}
get dimensions(){return this._dimensions}
get description(){return this._description}
}
