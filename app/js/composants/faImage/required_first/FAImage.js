'use strict'


class FAImage extends FAElement {
// ---------------------------------------------------------------------
//  CLASS

static get(img_fname){
  if(undefined === this._images) this.getAllPictures()
  if(undefined === this._images[img_fname]) this._images[img_fname] = new FAImage(img_fname)
  return this._images[img_fname]
}

static init(){
  this.getAllPictures()
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
  glob.sync(`${current_analyse.folderPictures}/*.*`).forEach(function(file){
    var fname = path.basename(file)
    my._images[fname] = new FAImage(fname)
    my._byTimes.push({time: my._images[fname].otime.seconds, fname: fname})
  })

  // TODO On doit faire aussi la liste par temps
}

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
get path(){return this._path || defP(this,'_path',path.join(current_analyse.folderPictures,this.fname))}
get affixe(){return this._affixe || defP(this,'_affixe',path.basename(this.fname,path.extname(this.fname)))}

get otime(){return this._otime || defP(this,'_otime',this.getImgTimeFromName())}

getImgTimeFromName(){
  var l = this.affixe.length
    , t = this.affixe.substring(3, l) // tant que le nom est "at-HMMSS.jpeg"
    , horloge = t.match(/^([0-9])([0-9][0-9])([0-9][0-9])$/).splice(1,4).join(':')
  // let [hrs, mns, secs] = t.match(/^([0-9])([0-9][0-9])([0-9][0-9])$/).splice(1,4).map(n => parseInt(n,10))
  return new OTime(horloge)
}

}
