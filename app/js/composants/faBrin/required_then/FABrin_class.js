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
    this.modified = false
    this.saving   = false
  }

/**
  Pour détruire le brin
**/
, destroy(brin_id){
    F.error("La destruction du brin est à implémenter")
    log.error("La destruction du brin est à implémenter (FABrin::destroy(brin_id))")
  }
/**
  Demande l'ouverture du document des données
**/
, openDocData(){ FAWriter.openDoc('dbrins') }

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

/**
  Nom de la table des éléments, qui permet à FAElement de proposer des méthodes
  génériques comme `count` ou autre.
**/
, tableItemsKey:{get(){return this._tblitemskey||defP(this,'_tblitemskey','brins')}}

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
      this.btnOK.html(v ? 'Enregistrer' : 'OK')
    }
  }

// , iofile:{get(){return this._iofile||defP(this,'_iofile', new IOFile(this, this.path))}}
, path:{get(){return this._path||defP(this,'_path',path.join(this.a.folderFiles,'dbrins.yaml'))}}


})
