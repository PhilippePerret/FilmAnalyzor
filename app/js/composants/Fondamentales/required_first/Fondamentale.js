'use strict'
/**
  Class Fondamentale
  ------------------
  Pour chaque fondamentale
**/

class Fondamentale {
// ---------------------------------------------------------------------
//  INSTANCES
//  Une Fondamentale
constructor(grpFonds, ydata){
  this.grpFonds = grpFonds
  this.analyse = this.a = grpFonds.analyse
  this._ydata = ydata
}

/**
  La méthode d'export commune à toutes les fondamentales

  +Options+
    :as     Pour déterminer si le retour doit être sous forme
            de string (défaut) ou sous forme de DOMElement ('dom')
            à append au document.
**/
export(options){
  let appends = [
    DCreate('H2', {class:'title', inner: this.hname})
  ]
  appends = this.addElementsTo(appends)
  this.facteurO_formated  && appends.push(this.divFacteurO)
  this.facteurU_formated  && appends.push(this.divFacteurU)
  this.scenes_formated    && appends.push(this.divScenes)

  let div = DCreate('DIV', {id: `fond${this.id}`, append: appends})
  if(options && options.as === 'dom'){
    return div
  } else {
    return div.outerHTML
  }
}

// ---------------------------------------------------------------------
// Méthodes d'Helper

/**
  Pour construire un DIV avec un LABEL et un SPAN.value

  +prop+      Propriété de l'instance (par exemple 'pseudo' ou 'question')
  +libelle+   Libellé gauche à afficher. Si non fourni, on titleize la
              propriété. P.e. 'description' => 'Description'
  +options+   Inutilisé mais permettra par exemple de changer la classe.
**/
libvalDiv(prop, libelle, options){
  let ghostProp = `_div${prop}`
  if(undefined === this[ghostProp] && this[prop]){
    if(undefined === libelle) libelle = prop.titleize()
    this[ghostProp] = DCreate('DIV', {class: 'libval normal', append:[
        DCreate('LABEL', {inner: libelle})
      , DCreate('SPAN', {class:'value', inner: this.formater(this[prop])})
    ]})
  }
  return this[ghostProp]
}

get formater(){
  if(undefined === this._formater){
    let fatexte = new FATexte('')
    this._formater = fatexte.formate.bind(fatexte)
  }
  return this._formater
}

// ---------------------------------------------------------------------
//  Méthodes d'helpers communes
get divDescription(){return this.libvalDiv('description')}
get divFacteurO(){return this.libvalDiv('facteurO_formated', 'Facteur O')}
get divFacteurU(){return this.libvalDiv('facteurU_formated', 'Facteur U')}
get divScenes(){return this.libvalDiv('scenes_formated', 'Scènes associées')}

// ---------------------------------------------------------------------
//  Données communes

get description(){return this.ydata.description}
get facteurO_formated(){
  if(undefined === this._facteurO_formated && (this.facteurO || this.description_factO)){
    let fa = this.facteurO
      , df = this.descFacteurO
    this._facteurO_formated = `${fa?fa + ' ': ''}${df?(fa?'. ':'')+df:''}`.trim()
  }
  return this._facteurO_formated
}
get facteurU_formated(){
  if(undefined === this._facteurU_formated && (this.facteurU || this.description_factU)){
    let fa = this.facteurU
      , df = this.descFacteurU
    this._facteurU_formated = `${fa?fa + ' ': ''}${df?(fa?'. ':'')+df:''}`.trim()
  }
  return this._facteurU_formated
}

get scenes_formated(){
  if(undefined === this._scenes_formated && this.scenes.length){
    let arr = []
    this.scenes.forEach(scene_id => arr.push(`{{scene:${scene_id}}}`))
    this._scenes_formated = arr.join(', ')
  }
  return this._scenes_formated
}
// ---------------------------------------------------------------------
//  Méthodes/données
get facteurO(){
  if(undefined === this._facteurO){
    if(this.ydata.facteurO === 'x/5') this._facteurO = null
    else this._facteurO = this.ydata.facteurO
  }
  return this._facteurO
}
get facteurU(){
  if(undefined === this._facteurU){
    if(this.ydata.facteurU === 'x/5') this._facteurU = null
    else this._facteurU = this.ydata.facteurU
  }
  return this._facteurU
}
get descFacteurO(){return this.ydata.description_factO}
get descFacteurU(){return this.ydata.description_factU}
get scenes(){return this.ydata.scenes || []}
get events(){return this.ydata.events || []}

get ydata(){return this._ydata}
// Le nom humain de la fondamentale, d'après sont 'type'
get hname(){return this._hname||defP(this,'_hname',this.type.titleize())}
}
