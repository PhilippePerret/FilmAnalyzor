'use strict'
Object.assign(FABrin,{

newNumero(){
  if(undefined === this.lastNumero) this.lastNumero = 0
  return ++ this.lastNumero
}
,

/**
  Boucle sur tous les brins
**/
forEachBrin(fn){
  for(var brin_id in this.brins){
    if(false === fn(this.brins[brin_id])) break
  }
}

,
/**
  @param  {String} brin_id Identifiant du brin
  @return {FABrin} l'instance du brin d'identifiant +brin_id
**/
get(brin_id){
  return this.brins[brin_id]
}

,
reset(){
  if(this.timerSave){
    clearTimeout(this.timerSave)
    delete this.timerSave
  }
  if(this._fwindow){
    this.fwindow.remove()
    delete this._fwindow
  }
  delete this.data
  delete this._brins
  delete this._path
  delete this._iofile
  delete this._pathData
  delete this._iofileData
  delete this.lastNumero
  return this // chainage
}
,
init(){
  this.loadData()
}
,
loadData(){
  log.info("-> FABrin::loadData")
  this.iofileData.loadIfExists({after: this.afterLoadData.bind(this)})
  log.info("<- FABrin::loadData")
}
,
afterLoadData(data){
  log.info("-> FABrin::afterLoadData")
  this.brins = {}
  if(data){
    for(var dbrin of data){
      this.brins[dbrin.id] = new FABrin(dbrin)
    }
  }
  this.load()
  log.info("<- FABrin::afterLoadData")
}
,
/**
  Chargement des informations sur les events
  Contrairement à la méthode `loadData` qui charge les données sur les brins
**/
load(){
  log.info("-> FABrin::load")
  this.iofile.loadIfExists({after:this.afterLoad.bind(this)})
  log.info("<- FABrin::load")
}
,
afterLoad(data){
  log.info("-> FABrin::afterLoad")
  if(data){
    for(var brin_id in data){
      Object.assign(this.brins[brin_id].data, data[brin_id])
    }
  }
  // console.log("[After load] brins:", this.brins)
  log.info("<- FABrin::afterLoad")
}

,
save(){
  log.info('-> FABrin::save')
  if(this.a.locked) return F.notify(T('analyse-locked-no-save'))
  this.saving = true
  this.composeThisData()
  this.iofile.save({after:this.afterSaving.bind(this)})
  log.info('<- FABrin::save (asynchrone)')
}
,
afterSaving(){
  log.info('-> FABrin::afterSaving')
  this.saving = false
  clearTimeout(this.timerSave)
  delete this.timerSave
  if(this.analyseWasNotModified) this.a.modified = false
  log.info('<- FABrin::afterSaving')
}

/**
  Pour éditer le brin d'identifiant +bid+

  Pour le moment, on ouvre simplement le document qui contient la définition
  des brins, mais pour l'avenir, on pourra imaginer que ce soit un formulaire
  qui permette de le faire en toute souplesse.
**/
, edit(bid){ this.openDocData()}

/**
  Demande l'ouverture du document des données
  (appelée par le bouton dédié)
**/
, openDocData(){
    FAWriter.openDoc('dbrins')
  }

/**
  Méthode qui définit les données à enregistrer (et les envoie directement
  à iofile). La raison est simple : ce ne sont que les données de liaisons
  qui sont enregistrées dans le fichier brins.json (les données des brins,
  elles, sont enregistrées dans `analyse_files/dbrins.yaml`)
**/
, composeThisData(){
    var d = {}, sd
    this.forEachBrin(function(brin){
      // On n'enregistre que ce qui est nécessaire
      sd = {}
      if(brin.events.length) sd.events = brin.events
      if(brin.documents.length) sd.documents = brin.documents
      if(brin.times.length) sd.times = brin.times
      d[brin.id] = sd
    })
    this.contents = d // pour être utilisé par iofile
}

})
Object.defineProperties(FABrin,{
// L'analyse courante
a:{get(){return current_analyse}}
,
/**
  Marque de modification
  ----------------------
  Noter que l'enregistrement des brins est automatique. Dès qu'une modification
  a été opérée, une boucle se met en route pour sauver les données 4 secondes
  plus tard (histoire de ne pas sauver à chaque ajout)

  Lorsqu'il y a modification, on actualise aussi la fenêtre d'affichage.
**/
modified:{
  get(){return this._modified || false}
, set(v){
    if(v && this.a.locked) return F.notify(T('analyse-locked-no-save'))
    this._modified = v
    if (true === v && !this.timerSave){
      this.analyseWasNotModified = !this.a._modified
      this.a.modified = true
      this.timerSave  = setTimeout(this.save.bind(this), 3000)
      this.updateListing()
    }
  }
}
,
/**
  @return {Number} Le nombre de brins définis
**/
count:{
  get(){return Object.keys(this.brins).length}
}
,
iofile:{get(){return this._iofile||defP(this,'_iofile',new IOFile(this))}}
,
path:{get(){return this._path||defP(this,'_path',path.join(this.a.folder,'brins.json'))}}
,
iofileData:{get(){return this._iofileData||defP(this,'_iofileData', new IOFile(this.pathData))}}
,
pathData:{get(){return this._pathData||defP(this,'_pathData',path.join(this.a.folderFiles,'dbrins.yaml'))}}


})
