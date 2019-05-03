'use strict'
/**
  Class FAPersonnage
  ------------------
  Gestion des personnages
**/

class FAPersonnage {
// ---------------------------------------------------------------------
//  CLASS

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
Réinitialiser la donnée. Comme par exemple après une modification
du fichier de données.
**/
static reset(){
  delete this._data
  delete this._diminutifs
  delete this._personnages
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
        this._diminutifs[this.data[pseudo].dim] = this.data[pseudo].pseudo
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

// Retourne le nombre de personnages
static get count(){return this._count||defP(this,'_count', Object.keys(this.data).length)}

static get data(){return this._data || {}}
static exists(){return fs.existsSync(this.path)}
static get path(){return this._path||defP(this,'_path',this.a.filePathOf('dpersonnages.yaml'))}
static get a(){return current_analyse}

// ---------------------------------------------------------------------
//  INSTANCE
constructor(analyse, data){
  this.analyse = this.a = analyse
  for(var prop in data){this[`_${prop}`] = data[prop]}
}

get pseudo(){return this._pseudo}
get id(){return this._id}
get dim(){return this._dim}
get dimensions(){return this._dimensions}
get description(){return this._description}
}
