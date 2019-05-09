'use strict'

Object.assign(FABrin,{

newNumero(){
  if(undefined === this.lastNumero) this.lastNumero = 0
  return ++ this.lastNumero
}

/**
  Boucle sur tous les brins
**/
, forEachBrin(fn){
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
  delete this.lastNumero
  return this // chainage
}

, init(){
    log.info('-> FABrin.init')
    this.load()
    log.info('<- FABrin.init')
  }

, load(){
    log.info("-> FABrin::load")
    this.loading = true
    this.iofile.loadIfExists({after: this.afterLoad.bind(this)})
    log.info("<- FABrin::load")
  }

, afterLoad(data){
    log.info("-> FABrin::afterLoad")
    this.reset()
    this.data     = data // une Array d'objet contenant les données
    this.loading  = false
    this.loaded   = true
    log.info("<- FABrin::afterLoad")
  }

, save(){
    log.info('-> FABrin::save')
    if(this.a.locked) return F.notify(T('analyse-locked-no-save'))
    this.saving = true
    this.composeThisData()
    // console.log("this.data avant save:", this.data)
    this.iofile.save({after:this.afterSaving.bind(this)})
    log.info('<- FABrin::save')
  }
, afterSaving(){
    if(this.analyseWasNotModified) this.a.modified = false
    this.saving = false
  }

/**
  Pour éditer le brin d'identifiant +bid+

  Pour le moment, on ouvre simplement le document qui contient la définition
  des brins, mais pour l'avenir, on pourra imaginer que ce soit un formulaire
  qui permette de le faire en toute souplesse.
**/
, edit(bid){ this.openDocData() }

/**
  Demande l'ouverture du document des données
  (appelée par le bouton dédié)
  // TODO pourvoir ouvrir aussi dans DataEditor
**/
, openDocData(){
    FAWriter.openDoc('dbrins')
  }

/**
  Méthode qui reconstitue les data pour le fichier (utilisé par
  le data éditor)
**/
, composeThisData(){
    this.contents = Object.values(this.brins).map(brin => brin.dataEpured())
  }

})//assign

Object.defineProperties(FABrin,{
  // L'analyse courante
  a:{get(){return current_analyse}}

, brins:{
    get(){
      if(undefined === this._brins){
        this._brins = {}
        if(this.data){
          for(var dbrin of this.data){
            this._brins[dbrin.id] = new FABrin(dbrin)
          }
        }
      }
      return this._brins
    }
  }
/**
  Marque de modification
  ----------------------
  Noter que l'enregistrement des brins est automatique. Dès qu'une modification
  a été opérée, une boucle se met en route pour sauver les données 4 secondes
  plus tard (histoire de ne pas sauver à chaque ajout)

  Lorsqu'il y a modification, on actualise aussi la fenêtre d'affichage.
**/
, modified:{
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

/**
  @return {Number} Le nombre de brins définis
**/
, count:{
    get(){return Object.keys(this.brins).length}
  }

, iofile:{get(){return this._iofile||defP(this,'_iofile', new IOFile(this, this.path))}}
, path:{get(){return this._path||defP(this,'_path',path.join(this.a.folderFiles,'dbrins.yaml'))}}


})
