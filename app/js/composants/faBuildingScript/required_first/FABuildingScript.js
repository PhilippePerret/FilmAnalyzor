'use strict'
/**
  FABuildingScript est une constante qui permet de construire de façon
  assistée le script d'assemblage de l'analyse.
**/

const FABuildingScript = {
  class: 'FABuildingScript'

, toggle(){
    // Il faut charger les données existantes, le cas échéant
    if (isNotTrue(this.loaded)){
      this.init()
      return this.load({after:this.toggle.bind(this)})
    }
    this.fwindow.toggle()
  }

, init(){
    this.CustomElementsIdToHname = {}
  }
/**
  Pour enregistrer la donnée
**/
, save(){
    // TODO Il faut préparer la donnée avant de l'enregistrer
    // Ça se fait simplement en relevant les identifiants dans la liste des
    // étapes retenues
    this.composeData()
    this.iofile.save({after: this.afterSave.bind(this)})
  }
, afterSave(){
    F.notify("Le script d'assemblage de l'analyse a été sauvegardé avec succès.")
    this.modified = false
  }
/**
  Pour lire la donnée
**/
, load(opts){
    if(this.iofile.exists()){
      this.decomposeData(this.iofile.loadSync({format:'raw'}))
    } else {
      this._data = []
    }
    this.loaded = true
    if (opts && opts.after) opts.after.call()
  }

/**
  Affiche l'explication de l'étape dont l'idée se trouve dans l'attribut
  `id-explication` de la cible de l'image cliqu"e
**/
, showStepExplaination(e){
    let step_id = $(e.target).attr('id-explication')
    F.notice(BUILDING_SCRIPT_DATA[step_id].explication)
    return stopEvent(e)
  }

, composeData(){
    var lines = [], checked
    this.stepsListObj.find('.step').each((i, e) => {
      e = $(e)
      checked = e.find('input[type="checkbox"]')[0].checked === true
      lines.push(`${e.data(STRtype)}:${e.data(STRid)}:${checked?1:0}:${e.data('hname')}`)
    })
    // console.log("lines: ", lines)
    this.contents = lines.join(RC)
    lines = null
  }

/**
  Déposition des données après chargement
**/
, decomposeData(data){
    this._data = data.split(RC).map(line => {
      var [step_type, step_id, checked, hname] = line.split(':')
      return {id: step_id, type:step_type, hname: hname, checked: (1 == parseInt(checked,10))}
    })
  }

/**
  Méthode qui retourne les données des documents personnalisés de l'analyse
  courante, sous forme de données d'étape.
**/
, customDocumentsAsSteps(){
    return FADocument.allDocuments.filter(doc => doc.dtype === 'custom').map(doc => {
      return {hname: doc.title, id:`doc:custom-${doc.id}`}
    })
  }

} ; /* /FABuildingScript */
Object.defineProperties(FABuildingScript,{

// ---------------------------------------------------------------------
// PROPRIÉTÉS GÉNÉRALES

  modified:{
    get(){return this._modified || false}
  , set(v){
      this._modified = v
      // TODO Faire apparaitre le bouton "sauver" quand il y a
      // des modifications
    }
  }

, data:{get(){return this._data || []}}

, iofile:{get(){return this._iofile || defP(this,'_iofile', new IOFile(this))}}
, path:{get(){
    return this._path||defP(this,'_path',this.a.filePathOf('building_script'))
  }}
, a:{get(){return current_analyse}}

// ---------------------------------------------------------------------
//  PROPRIÉTÉS DOM
, stepsListObj:{get(){
    if(isUndefined(this._stepslistobj)){
      this._stepslistobj = this.fwindow.jqObj.find('.body #bse-left-column #bse-steps-list')
      if(isEmpty(this._stepslistobj)) delete this._stepslistobj
    }
    return this._stepslistobj
  }}
, stepsOutListObj:{get(){
    if(isUndefined(this._stepsOutlistobj)){
      this._stepsOutlistobj = this.fwindow.jqObj.find('.body #bse-right-column #bse-steps-outlist')
      if(isEmpty(this._stepsOutlistobj)) delete this._stepsOutlistobj
    }
    return this._stepsOutlistobj
  }}
, jqObj:{get(){return this.fwindow.jqObj}}
, fwindow:{get(){
    return this._fwindow||defP(this,'_fwindow',new FWindow(this,{id:'building-script', class:'large-edition', name:'Building-script-editor', x:400}))
  }}
})
