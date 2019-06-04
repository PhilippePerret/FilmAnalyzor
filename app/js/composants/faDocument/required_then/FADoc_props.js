'use strict'

Object.defineProperties(FADocument.prototype,{
  a:{get(){ return current_analyse }}
, iofile:{get(){return this._iofile||defP(this,'_iofile', new IOFile(this))}}
, title:{get(){ return this._title || defP(this,'_title', this.getTitle())}}
, path:{get(){ return this._path||defP(this,'_path', this.definePathPerType())}}
, extension:{get(){return this._ext || defP(this,'_ext', this.data.format || 'md')}}
, contents:{
    get(){return this._contents}
  , set(v){
      if (v === this._contents) return
      this._lastContents = `${this._contents}`
      this._contents = v
      this.displaySize()
      this.modified = true
      this.toggleMenuModeles()
    }
  }
  // À peu près les 200 premiers signes du texte
, firstContent:{get(){
    isDefined(this._firstContent) || this.getTitle() // force le calcul
    return this._firstContent
  }}
, dim:{get(){ return this._dim || defP(this,'_dim', this.data.dim)}}
, data:{get(){return this._data||defP(this,'_data',this.getDataDocId())}}
, theme:{get(){return this._theme||defP(this,'_theme',this.getThemePerDocument())}}

})

/**
  Les méthodes qui permettent de définir les données
**/
FADocument.prototype.getDataDocId = function (){
  switch (this.dtype) {
    case STRregular:  return DATA_DOCUMENTS[DATA_DOCUMENTS[this.id].dim]
    case STRcustom:   return DATA_DOCUMENTS[STRcustom]
    case STRsystem:   return DATA_DOCUMENTS[this.id] // data_proc, etc.
    default:
      throw(`Le dtype "${this.dtype}" est inconnu…`)
  }
}

FADocument.prototype.definePathPerType = function(){
  switch (this.dtype) {
    case STRregular:
      return path.join(this.a.folderFiles,`${this.dim}.${this.extension}`)
    case STRcustom:
      return path.join(this.a.folderFiles,`custom-${this.id}.${this.extension}`)
    case STRsystem:
      throw("Le path du document devrait être défini à l'instanciation.")
      // return path.join(APPFOLDER,'app','js','data',`${this.dtype}.yaml`)
  }
}

// Lit le titre dans le document et le retourne
// Ou retourne un string qui peut servir de titre
FADocument.prototype.getTitle = function(){
  log.info('-> FADocument.getTitle', this.toString())
  var tit
  if ( this.exists() ) {
    var buf = Buffer.alloc(200)
    var fd  = fs.openSync(this.path, 'r');
    fs.readSync(fd, buf, 0, 200, 0)
    buf = buf.toString().split(RC)
    let firstLine = buf.shift()
    if (firstLine.substring(0,2).trim() == '#'){
      tit = firstLine.substring(2, firstLine.length).trim()
      this._firstContent = buf.join(RC)
    } else {
      this._firstContent = buf.unshift(firstLine).join(RC)
    }
  } else {
    log.info(`   Le fichier "${this.path}" n'existe pas. Je ne peux pas trouver le titre.`)
    this._firstContent = ''
  }
  return tit || (this.dtype === STRcustom ? `Doc #custom-${this.id}` : this.data.hname)
}

FADocument.prototype.getThemePerDocument = function(){
  switch (this.data.type) {
    case STRdata: return 'data-theme'
    case STRreal: return 'real-theme'
    default: return 'real-theme'
  }
}
