'use strict'
/**
* Class FAReport
* ---------------
* Classe permettant de produire des rapports, soit à l'écran,
* soit dans des fichiers.

USAGE
=====

  var rep = new FAReport(current_analyse, {type: '<type>'})
  rep.add(<message>[, <type>][, <options>])
    Le type peut être :
      title             Pour un titre
      normal (default)
      notice
      error


  rep.show()          => afficher à l'écran
  rep.saveInFile()    => sauvegarde dans un fichier

**/
class FAReport {
// ---------------------------------------------------------------------
// CLASSE

// Pour afficher le dernier rapport produit
static showLast(){
  if(undefined === this.reports) return F.notify("Pas de dernier rapport à afficher.", {error: true})
  else {
    this.reports[this.reports.length - 1].show()
  }
}
// Ajoute un rapport à la liste courante
static addReport(report){
  isDefined(this.reports) || ( this.reports = [] )
  this.reports.push(report)
}

// ---------------------------------------------------------------------
//  INSTANCE
constructor(reportType){
  this.analyse = this.a = current_analyse
  this.type     = reportType
  this.messages = []
  this.constructor.addReport(this)
}

// ---------------------------------------------------------------------
//  Méthode publiques

/**
* Pour ajouter un message
* +msg+       Le message String
* +type+      Le type. cf. ci-dessus
* +indent+    Indentation
*
**/
add(msg, type, indent){
  var t = new Date()
    , htime = `${t.getHours()}:${`${t.getMinutes()}`.padStart(2,'0')}:${`${t.getSeconds()}`.padStart(2,'0')}:${t.getMilliseconds()}`
  this.messages.push({message: msg, type: (type || 'normal'), time: t, htime:htime, indent: indent || 0})
}
/**
* Méthode qui produit la sortie à l'écran
**/
show(){
  this.fwindow.show()
}
hide(){
  this.fwindow.hide()
}
/**
* Méthode qui produit la sortie dans un fichier

Note : l'IOFile va se servir de this.contents comme texte à sauver
**/
saveInFile(){
  this.iofile.save({after: this.endSave.bind(this)})
}
endSave(){
  // On utilise ensuite pandoc pour créer un fichier autonome
  // TODO Ajouter `--css=path/to/css` pour ajouter une feuille de style
  // pour mettre en forme le rapport
  var cmd = `pandoc -s -o ${this.finalpath} ${this.path}`
  exec(cmd, (err, stdout, stderr) => {
    if(err)throw(err)
    fs.unlinkSync(this.path)
    F.notice(`Le rapport a été sauvé dans "/reports/${this.fname}l".`)
  })
}

// ---------------------------------------------------------------------
// Méthodes de construction

// Appelée par la fwindow
build(){
  var btnclose  = DCreate(BUTTON, {type: STRbutton, class: 'btn-close'})
  return [btnclose, this.messagesDomObjects]
}

/**
* Retourne tous les messages en tant qu'objet DOM
**/
allObjMsgs(){
  var msgs = []
  for(var msg of this.messages){
    msgs.push(DCreate(DIV, {class: `report-msg ${msg.type} indent${msg.indent||0}`, append:[
        DCreate(SPAN,{class:STRtime, inner: msg.htime})
      , DCreate(SPAN,{class:'msg', inner:msg.message})
    ]}))
  }
  return msgs
}
// ---------------------------------------------------------------------
// Méthodes d'évènements

observe(){
  // On pourra observer les events cités, par exemple, pour pouvoir les
  // éditer.
}

// ---------------------------------------------------------------------
// Propriétés
get contents(){
  if(undefined === this._contents){
    this._contents = this.messagesDomObjects.outerHTML
  }
  return this._contents
}
get messagesDomObjects(){
  if(undefined === this._messagesDomObjects){
    this._messagesDomObjects = DCreate(DIV,{class: 'report-contents', append: this.allObjMsgs()})
  }
  return this._messagesDomObjects
}
get fwindow(){return this._fwindow||defP(this,'_fwindow', new FWindow(this, {}))}
get iofile(){return this._iofile || defP(this,'_iofile', new IOFile(this))}
get path(){return this._path || defP(this,'_path', path.join(this.a.folderReports, this.fname))}
get fname(){return this._fname || defP(this,'_fname', `report-${new Date().getTime()}.htm`)}
get finalpath(){return this._finalpath||defP(this,'_finalpath',`${this.path}l`)}
}
