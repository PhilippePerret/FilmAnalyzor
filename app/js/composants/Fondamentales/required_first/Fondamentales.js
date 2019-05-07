'use strict'

/**
  Class Fondamentales
  -------------------
  Pour une instance contenant toutes les fondamentales

**/

class Fondamentales {
static get(fonds_id){
  console.log("fonds_id:", fonds_id)
}
static get a(){return current_analyse}

/**
  Instanciation d'un groupe de fondamentales (il peut y en avoir plusieurs
  par film)
**/
constructor(path){
  this.analyse = this.a = this.constructor.a
  this._path = path
  this.init()
}

init(analyse){
  this.loaded = false
  if ( this.exists() ) this.load()
  else this.loaded = true // pas de fondamentales
}

save(options){
  this.saving = true
  if(undefined === options)options = {}
  if(undefined === options.after) options.after = this.afterSave.bind(this)
  this.iofile.save(options)
}
afterSave(){
  this.saving = false
}
/**
  Méthode qui charge les fondamentales si
  elles existent.
**/
load(){
  this.iofile.load({after: this.afterLoading.bind(this)})
}

afterLoading(ydata){
  this.yaml_data = ydata
  this.loaded = true
}

/**
  Méthode principale qui retourne le code pour
  l'export des Fondamentales, i.e. le code qui sera
  inscrit dans l'eBook
**/
export(options){
  let str = ''
  for(var fid in this.fds){
    str += this.fds[fid].export()
  }
  return str
}

// Retourne true si le fichier existe
exists(){return fs.existsSync(this.path)}

/**
  Retourne les cinq fondamentales
  C'est une table avec en clé :
    fd1, fd2, etc.
**/
get fds(){
  if(undefined === this._fds){
    this._fds = {
      fd1: new PersonnageFondamental(this, this.yaml_data.fd1)
    , fd2: new QuestionDramatiqueFondamentale(this, this.yaml_data.fd2)
    , fd3: new OppositionFondamentale(this, this.yaml_data.fd3)
    , fd4: new ReponseDramatiqueFondamentale(this, this.yaml_data.fd4)
    , fd5: new ConceptFondamental(this, this.yaml_data.fd5)
    }
  }
  return this._fds
}

get iofile(){return this._iofile||defP(this,'_iofile', new IOFile(this))}
// Path au fichier des fondamentales
get path(){return this._path}
// Affixe
get affixe(){return this._affixe||defP(this,'_affixe',path.basename(this.path,path.extname(this.path)))}
// Titre pour le data-editor
get title(){return this._title||defP(this,'_title', this.defineTitle())}
defineTitle(){
  return this.affixe.replace(/_/,' ').titleize()
}
}
