'use strict'


class FAImage extends FAElement {
// ---------------------------------------------------------------------
//  CLASS

static get PROPS(){return ['id','legend','time','path','fname','associates']}

static get(img_id){
  if(undefined === this._images) this.getAllPictures()
  return this._images[img_id]
}

static show(image_id){
  this.a.togglePanneauImages(true/*ouvert*/)
  this.listing.select(image_id)
}

static fname2id(fname){
  return fname.replace(/[\.\-]/g,'')
}

static add(image_fname){
  let img_id = this.fname2id(image_fname)
  let newimage = new FAImage(img_id, image_fname)
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
    arr.push(this.get(img.id))
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
  this.pickupImagesInFoler()
}
/**
  @param {Object} data Données des images, enregistrées dans le fichier JSON
**/
static decomposeData(data){
  log.info(`-> FAImage::decomposeData(${JSON.stringify(data||{})})`)
  // console.log("data:", data)
  let my = this
  var imgid, img
  this._images  = {}
  this._byTimes = []
  if(data){
    for(var imgid in data){
      img = new FAImage(imgid)
      img.dispatch(data[imgid])
      if (fs.existsSync(img.path)) {
        my._images[img.id] = img
        my._byTimes.push({time: my._images[img.id].otime.seconds, id:img.id, fname:img.fname})
      } else {
        log.warn(`Impossible de trouver l'image "${img.path}". Je la retire des données.`)
      }
    }
  }
  log.info(`   valeur de _byTimes après décomposition : ${my._byTimes}`)
  log.info('<- FAImage::decomposeData')
}

/**
  Méthode qui s'assure que toutes les images du dossier des pictures aient
  été chargées dans la donnée. Les ajoute à la donnée générale le cas échéant.
**/
static pickupImagesInFoler(){
  let my = this
  log.info('-> FAImage::pickupImagesInFoler')
  glob.sync(`${this.a.folderPictures}/*.*`).forEach(function(file){
    var fname = path.basename(file)
      , imgid = my.fname2id(fname)
    if(undefined === my._images[imgid]){
      my._images[imgid] = new FAImage(imgid, fname)
      my._byTimes.push({time: my._images[imgid].otime.seconds, id:imgid, fname: fname})
      log.info(`   ADD Image "${fname}" (#${imgid}) qui n'était pas dans le fichier des data images.`)
    }
  })
  log.info('<- FAImage::pickupImagesInFoler')
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
constructor(imgid, fname){
  super()
  this.a = this.analyse = current_analyse
  this.id = imgid
  if(undefined !== fname) this._fname = fname
  this.type   = 'image'
}

toString(){return `Image à ${this.otime.horloge_simple}`}

get id(){return this._id} // pour associés
set id(v){this._id = v}
get legend(){return this._legend}
get fname(){return this._fname}
get f_legend(){return DFormater(this.legend||`Légende de ${this.fname}`)}
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
