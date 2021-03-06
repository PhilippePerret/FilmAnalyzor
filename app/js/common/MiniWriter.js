'use strict'
/**

  Le miniwriter (class MiniWriter) est un système permettant d'éditer les
  textes avec plus de confort, en offrant notamment une dimension plus grande
  à l'espace de travail et en concentrant l'attention sur le texte.

  Features
  --------
  - Le MiniWriter doit pouvoir s'utiliser pour tous les types de texte, sauf
    peut-être les documents, qui ont leur propre porte_documents
  - On doit pouvoir utiliser tous les snippets avec le miniwriter
  - On doit pouvoir visualiser le rendu de tout texte écrit.
  - On doit pouvoir passer simplement dans miniwriter depuis n'importe quel
    champ d'édition, donc n'importe quel textarea, notamment à partir de
    l'éditeur d'event (EventForm).

**/

class MiniWriter {

/**
* Méthode de classe de création du miniwriter qui permet de le créer à
* l'aide de `MiniWriter.new(<field>)`
**/
static new(field /* DOMElement non jQuery */){
  // if($(`#${field.id}`).length === 0) throw("Il faut transmettre un champ valide.")
  if(isEmpty($(field))) throw("Il faut transmettre un champ valide (existant).")
  // console.log("field:",field)
  var mw = new MiniWriter(current_analyse, field, this.newId())
  mw.show()
  return mw
}
static newId(){
  if(isUndefined(this.lastId)) this.lastId = 0
  return ++this.lastId
}

constructor(analyse, field, mini_writer_id){
  this.id = mini_writer_id
  this.analyse = this.a = analyse
  // Le champ d'origine, dans lequel on retournera le nouveau texte.
  this.owner   = field
  // État
  this.opened = false
  // État du visualiseur
  this.visualizorOpened = false
  // Le fond est-il masqué
  this.fondMasked = true
}
toggle(){
  this.fwindow.toggle()
}
show(){
  this.fwindow.show()
  this.setup()
  this.textField.focus()
  this.textField.focus()
}
hide(){
  this.fwindow.hide()
}
/**
  On met le texte du propriétaire dans le champ de texte du MiniWriter
**/
setup(){
  // console.log("this.textField:", this.textField)
  // console.log("this.jqOwner:", this.jqOwner)
  this.textField.val(this.jqOwner.val())
}
/**
  Méthode appelée par le bouton "Finir"
**/
finir(){
  this.synchronize()
  this.hide()
}
/**
  Méthode appelée par la touche escape pour renoncer à l'édition
  La méthode vérifie qu'aucune modification n'a eu lieu et demande confirmation
  le cas échéant
**/
cancel(){
  if ( this.contenuHasChanged() ){
    let dataConf = {
        message: T('confirm-abandon-modif-text')
      , buttons: ['Annuler', 'Abandonner les modifications']
      , defaultButtonIndex: 0
      , cancelButtonIndex: 0
      , okButtonIndex:1
      , methodOnOK: this.hide()
    }
    confirm(dataConf)
  }
}
contenuHasChanged(){
  return this.jqOwner.val() != this.textField.val()
}
/**
  On synchronize les contenus, c'est-à-dire qu'on met dans le
  champ propriétaire le nouveau texte.
**/
synchronize(){
  this.jqOwner.val(this.textField.val())
  this.jqOwner.trigger('change')
}

// ---------------------------------------------------------------------
//  MÉTHODES POUR LE VISUALISEUR

/**
  Méthode appelée toutes les x secondes pour actualiser l'affichage
  dans le visualizor.
**/
updateVisualizor(){
  this.oVisualizorContent.html(this.formater(this.contents, {format: HTML}))
}
/**
* Pour mettre en route ou stopper la visualisation
**/
toggleVisualizor(){
  if(this.visualizorOpened){
    clearInterval(this.timerVisualizor)
    delete this.timerVisualizor
    this.oVisualizor.hide()
    this.visualizorOpened = false
  } else {
    this.oVisualizor.show()
    this.visualizorOpened = true
    // On met en route une boucle qui va actualiser régulièrement
    // le texte
    this.timerVisualizor = setInterval(this.updateVisualizor.bind(this), 3000)
    this.updateVisualizor() // un tout de suite
  }
}
toggleMaskFond(){
  this.fwindow.jqObj.css('background', this.fondMasked?'transparent':'rgba(0,0,0,0.74)')
  this.fondMasked = !this.fondMasked
}
/**
  Méthode de construction du miniwriter
 */
build(){
  return [
      DCreate(DIV, {class:'miniwriter-editor', append: [
          DCreate(DIV, {class: 'miniwriter-tools', inner: '[Mettre ici les outils]'})
        , DCreate(DIV, {class:'miniwriter-div-textarea', append : [
            DCreate(TEXTAREA, {id: `miniwriter-${this.id}-content`, class:'miniwriter-content'})
          ]})
        , DCreate(DIV, {class: 'miniwriter-buttons', append: [
            DCreate(DIV, {class:'fleft cbs', append:[
                DCreate(INPUT, {type:STRcheckbox, id: this.idFor('cb-visualizor')})
              , DCreate(LABEL, {inner: 'Visualiser', attrs: {for: this.idFor('cb-visualizor')}})
              , DCreate(INPUT, {type:STRcheckbox, id: this.idFor('cb-mask-fond'), attrs:{checked:'CHECKED'}})
              , DCreate(LABEL, {inner: 'Fond masqué', attrs: {for: this.idFor('cb-mask-fond')}})
              ]})
          , DCreate(BUTTON, {class:'main btn-ok', type:BUTTON, inner:'Finir'})
          ]})
      ]})
    , DCreate(DIV, {class:'miniwriter-visualizor', style: 'display:none;', append: [
        DCreate(DIV, {class:'miniwriter-visualizor-content'})
    ]})
    ]
}
observe(){
  var my = this
  // On observe les boutons
  this.oButtons.find(`#${this.idFor('cb-visualizor')}`).on(STRclick, this.toggleVisualizor.bind(this))
  this.oButtons.find(`#${this.idFor('cb-mask-fond')}`).on(STRclick, this.toggleMaskFond.bind(this))
  this.oButtons.find('button.btn-ok').on(STRclick, this.finir.bind(this))

  // On peut déposer des éléments quelconques sur le champ de texte
  this.setTextFieldsAssociableIn(this.jqObj, this)
}

idFor(foo){return `mw${this.id}-${foo}`}

// Le contenu du textarea
get contents(){return this.textField.val()}
get formater(){return this._formater||defP(this,'_formater', this.fatexte.formate.bind(this.fatexte))}

get textField(){return $(`#${this.domId} .miniwriter-content`)}
get oButtons(){return this._obuttons||defP(this,'_obuttons', $(`#${this.domId} .miniwriter-buttons`))}
get oVisualizor(){return this._ovisualizor||defP(this,'_ovisualizor', $(`#${this.domId} .miniwriter-visualizor`))}
get oVisualizorContent(){return this._ovisualizorContent||defP(this,'_ovisualizorContent', $(`#${this.domId} .miniwriter-visualizor-content`))}
get domId(){return this._domId||defP(this,'_domId',`miniwriter-${this.id}`)}
get fatexte(){return this._fatexte||defP(this,'_fatexte', new FATexte(''))}
get jqObj(){return this.fwindow.jqObj}
get fwindow(){return this._fwindow||defP(this,'_fwindow', new FWindow(this, {class:'miniwriter', id:this.domId, y:-20, x:-20}))}
get selector(){return this._selector||defP(this,'_selector', new Selector(this.textField))}

get jqOwner(){return this._jqOwner||defP(this,'_jqOwner', $(this.owner))}
}

Object.assign(MiniWriter.prototype, TEXTFIELD_ASSOCIATES_METHS)
Object.defineProperties(MiniWriter.prototype, TEXTFIELD_ASSOCIATES_PROPS)
