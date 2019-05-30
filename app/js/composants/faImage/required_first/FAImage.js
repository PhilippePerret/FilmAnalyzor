'use strict'


class FAImage extends FAElement {
// ---------------------------------------------------------------------
//  CLASS

static get PROPS(){return [STRid,'legend','size','position',STRtime,'path','fname','associates']}

static get positionsValues(){
  if(undefined === this._positionsvalues){
    this._positionsvalues = {
      '':'Mettre…'
    , 'float-left': 'Flottant à gauche'
    , 'float-right': 'Flottant à droite'
    , 'above': 'Au-dessus'
    , 'below': 'En dessous (inusité)'
    }
  }
  return this._positionsvalues
}
/**
  Retourne l'image d'identifiant +img_id+ (instance {FAImage})
**/
static get(img_id){
  if(undefined === this._images) this.getAllPictures()
  return this._images[img_id]
}

static show(image_id){
  this.a.togglePanneauImages(true/*ouvert*/)
  this.listing.select(image_id)
}

/**
  Méthode qui prend un instantané de l'image courante ou du temps +time+
  @param {OTime|Number} time  Le temps à prendre ou le temps courant par défaut
**/
static shotFrame(time, options){
  if(undefined === time) time = this.a.locator.currentTime
  this.takeAShot(time, options)
  // TODO Une méthode qui remplace la source de cette image par la valeur,
  // pour forcer son chargement
}
static get takeAShot(){return this._takeashot||defP(this,'_takeashot', App.loadTool('shot_picture').bind(this))}

static fname2id(fname){
  return fname.replace(/[\.\-]/g,'')
}

/**
  Ajouter aux données l'image de nom +image_fname+
**/
static add(image_fname){
  let img_id = this.fname2id(image_fname)
  let newimage = new FAImage(img_id, image_fname)
  this.images[img_id] = newimage
  this.updateByTimes()
  this.updateListingIfNecessary()
  this.modified = true
  this.save()
}

static destroy(image_id){
  if(false == confirm()) return
  confirm({
      message:`Veux-tu vraiment détruire DÉFINITIVEMENT l'image « ${image_id} » (donnée + fichier image) ?`
    , buttons:['Renoncer','Détruire l’image']
    , defaultButtonIndex:0
    , cancelButtonIndex:0
    , okButtonIndex:1
    , methodOnOK:this.execDestroyImage.bind(this, image_id)
  })
}
static execDestroyImage(image_id){
  let img = this.get(image_id)
  if(fs.existsSync(img.path)) fs.unlinkSync(img.path)
  delete this.images[image_id]
  this.updateByTimes()
  this.updateListingIfNecessary()
  this.modified = true
  this.save()
}

static init(){
  this.getAllPictures()
}

/**
  Méthode qui actualise la donnée _byTimes qui présente les images classées
  par leur temps.
  Quand cette méthode est appelée, this.images est déjà défini.
**/
static updateByTimes(){
  let my = this
  this._byTimes = Object.values(this.images).map(faimg => my.dataByTimesFor(faimg))
  this._byTimes.sort((a,b) => {return a.time - b.time})
  my = null
  return this._byTimes
}

static updateListingIfNecessary(){
  if(undefined === this.listing) return
  this.listing.items = Object.values(this.images)
  this.listing.update()
}

/**
  Retourne la liste des images qui se trouvent proche du temps voulu +time+
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
  for(var duo of this.byTimes){// duo = {time: temps, id:identifiant, fname: nom fichier}
    if(false === fn(duo)) break
  }
}

static get images() { return this._images }
static get byTimes(){ return this._byTimes ||defP(this,'_byTimes',this.updateByTimes())}

// Reçoit un temps et retourne le nom de l'image correspondante
static time2fname(time){
  if(!(time instanceof(OTime))) time = new OTime(time)
  return `at-${time.vhorloge_simple.replace(/[\:\.]/g,'')}.jpeg`
}

// Retourne le path de l'image de nom +fname+
static pathOf(fname){
  return path.resolve(path.join(this.a.folderPictures, fname))
}

static getAllPictures(){
  log.info('-> FAImage::getAllPictures')
  let my = this
  this._images  = {}
  delete this._byTimes
  fs.existsSync(this.path) && this.decomposeData(this.iofile.loadSync())
  this.pickupImagesInFolder()
  log.info('<- FAImage::getAllPictures')
}
/**
  @param {Object} data Données des images, enregistrées dans le fichier JSON
**/
static decomposeData(data){
  log.info(`-> FAImage::decomposeData`)
  // console.log("data:", data)
  let my = this
  var imgid, img
  this._images  = {}
  if(data){
    for(var imgid in data){
      img = new FAImage(imgid)
      img.dispatch(data[imgid])
      if (fs.existsSync(img.path)) {
        my._images[img.id] = img
      } else {
        log.warn(`Impossible de trouver l'image "${img.path}". Je la retire des données.`)
      }
    }
  }
  log.info('<- FAImage::decomposeData')
}

static dataByTimesFor(faimg){
  return {time:faimg.otime.seconds, id:faimg.id, fname:faimg.fname}
}

/**
  Méthode qui s'assure que toutes les images du dossier des pictures aient
  été chargées dans la donnée. Les ajoute à la donnée générale le cas échéant.
**/
static pickupImagesInFolder(){
  let my = this
  log.info('-> FAImage::pickupImagesInFolder')
  glob.sync(`${this.a.folderPictures}/*.*`).forEach(function(file){
    var fname = path.basename(file)
      , imgid = my.fname2id(fname)
    if(isUndefined(my._images[imgid])){
      my._images[imgid] = new FAImage(imgid, fname)
      // my._byTimes.push({time: my._images[imgid].otime.seconds, id:imgid, fname: fname})
      log.info(`   ADD Image "${fname}" (#${imgid}) qui n'était pas dans le fichier des data images.`)
    }
  })
  log.info('<- FAImage::pickupImagesInFolder')
}

static getData(){
  var h = {}
  this.forEachByTime(img => h[img.id] = this.images[img.id].dataEpured())
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
  isDefined(fname) && ( this._fname = fname )
  this.type   = STRimage
}

toString(){return `Image à ${this.otime.horloge_simple}`}

get id(){return this._id} // pour associés
set id(v){this._id = v}
get title(){return this.f_legend} // consistence avec autres éléments
get legend(){return this._legend}
get position(){return this._position}
get size(){return this._size}
get fname(){return this._fname}
get path(){return this._path || defP(this,'_path', path.join(this.a.folderPictures,this.fname))}
get affixe(){return this._affixe || defP(this,'_affixe',path.basename(this.fname,path.extname(this.fname)))}

get otime(){return this._otime || defP(this,'_otime',this.getImgTimeFromName())}
get time(){return this._time || defP(this,'_time', this.otime.vtime)}

// Méthode pratique pour reconnaitre rapidement l'element
get isAEvent(){return false}
get isEvent(){return false}
get isADocument(){return false}
get isDocument(){return false}
get isAScene(){return false}
get isScene(){return false}
get isAnImage(){return true}
get isImage(){return true}

getImgTimeFromName(){
  var l = this.affixe.length
    , t = this.affixe.substring(3, l) // tant que le nom est "at-HMMSS.jpeg"
    , horloge = t.match(/^([0-9])([0-9][0-9])([0-9][0-9])$/).splice(1,4).join(':')
  // let [hrs, mns, secs] = t.match(/^([0-9])([0-9][0-9])([0-9][0-9])$/).splice(1,4).map(n => parseInt(n,10))
  return new OTime(horloge)
}

// Pour la consistance avec FAEvent
hide(){
  this.jqReaderObj.hide()
  this.shown = false
}




}// /class FAImage
