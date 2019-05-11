'use strict'


class FAImage extends FAElement {
// ---------------------------------------------------------------------
//  CLASS

static get PROPS(){return ['id','legend','time','path', 'fname', 'associates']}

static get(img_fname){
  if(undefined === this._images) this.getAllPictures()
  if(undefined === this._images[img_fname]) this._images[img_fname] = new FAImage(img_fname)
  return this._images[img_fname]
}

static show(image_id){
  this.a.togglePanneauImages(true/*ouvert*/)
  this.listing.select(image_id)
}

static add(image_fname){
  let newimage = new FAImage(image_fname)
  this.images[newimage.id] = newimage
  this.decomposeData(Object.assign({},this.images))
  this.updateListingIfNecessary()
  this.modified = true
}

static destroy(image_id){
  if(false == confirm(`Veux-tu vraiment détruire DÉFINITIVEMENT l'image « ${image_id} » (donnée + fichier image) ?`)) return
  let img = this.get(image_id)
  if(fs.existsSync(img.path)) fs.unlinkSync(img.path)
  delete this.images[image_id]
  this.modified = true
  this.decomposeData(Object.assign({},this.images))
  this.updateListingIfNecessary()
}

static init(){
  this.getAllPictures()
}


static updateListingIfNecessary(){
  if(undefined === this.listing) return
  this.listing.items = Object.values(this.images)
  this.listing.update()
}

/**
  Retourne la liste des images qui se trouvent
**/
static imagesAt(time){
  var arr = []
  this.forEachByTime(img => {
    if(img.time < time - 10) return true
    if(img.time > time + 10) return false // pour arrêter
    arr.push(this.get(img.fname))
  })
  return arr
}

static forEachImage(fn){
  for(var imgid in this.images){
    if(false === fn(this.images[imgid])) break
  }
}

static forEachByTime(fn){
  for(var duo of this.byTimes){// duo = {time: temps, fname: nom fichier}
    if(false === fn(duo)) break
  }
}

static get images() { return this._images }
static get byTimes(){ return this._byTimes }

static getAllPictures(){
  let my = this
  this._images  = {}
  this._byTimes = []
  if(fs.existsSync(this.path)){
    this.decomposeData(this.iofile.loadSync())
  }
}
/**
  @param {Object} data Données des images, enregistrées dans le fichier JSON
**/
static decomposeData(data){
  // console.log("data:", data)
  let my = this
  var imgid, img
  this._images  = {}
  this._byTimes = []
  if(data){
    for(var imgid in data){
      img = new FAImage(imgid)
      if (fs.existsSync(img.path)) {
        my._images[img.id] = img
        my._byTimes.push({time: my._images[img.id].otime.seconds, fname: img.id})
      } else {
        log.warn(`Impossible de trouver l'image "${img.path}". Je la retire des données.`)
      }
    }
  }
  // Par mesure de prudence, on regarde s'il y a de nouvelles images dans
  // le dossier
  glob.sync(`${this.a.folderPictures}/*.*`).forEach(function(file){
    var fname = path.basename(file)
    if(undefined === my._images[fname]){
      my._images[fname] = new FAImage(fname)
      my._byTimes.push({time: my._images[fname].otime.seconds, fname: fname})
      log.info(`   Ajout de l'image "${fname}" qui n'était pas dans les données images`)
    }
  })
}

static getData(){
  var h = {}
  this.forEachImage(img => h[img.id] = img.dataEpured())
  return h
}
// static get iofile(){return this._iofile || defP(this,'_iofile', new IOFile(this))}
static get path(){return this._path || defP(this,'_path', path.join(this.a.folder,'images_data.json'))}
// ---------------------------------------------------------------------
//  INSTANCE

// On instancie avec le nom (complet) du fichier
constructor(fname){
  super()
  this.a = this.analyse = current_analyse
  this.fname  = fname
  this.type   = 'image'
}

toString(){return `Image à ${this.otime.horloge_simple}`}

get id(){return this.fname} // pour associés
get legend(){return this._legend}
get f_legend(){return DFormater(this.legend||`Légende de ${this.id}`)}
get path(){return this._path || defP(this,'_path',path.join(current_analyse.folderPictures,this.fname))}
get affixe(){return this._affixe || defP(this,'_affixe',path.basename(this.fname,path.extname(this.fname)))}

get otime(){return this._otime || defP(this,'_otime',this.getImgTimeFromName())}
get time(){return this._time || defP(this,'_time', this.otime.vtime)}

getImgTimeFromName(){
  var l = this.affixe.length
    , t = this.affixe.substring(3, l) // tant que le nom est "at-HMMSS.jpeg"
    , horloge = t.match(/^([0-9])([0-9][0-9])([0-9][0-9])$/).splice(1,4).join(':')
  // let [hrs, mns, secs] = t.match(/^([0-9])([0-9][0-9])([0-9][0-9])$/).splice(1,4).map(n => parseInt(n,10))
  return new OTime(horloge)
}

}
