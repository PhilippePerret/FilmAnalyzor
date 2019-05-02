'use strict'
/**

  Le miniwriter (class MiniWriter) est un système permettant d'éditer les
  textes avec plus de confort, en offrant notamment une dimension plus grande
  à l'espace de travail et en concentrant l'attention sur le texte.

  Features
  --------
  - Le MiniWriter doit pouvoir s'utiliser pour tous les types de texte, sauf
    peut-être les documents, qui ont leur propre writer
  - On doit pouvoir utiliser tous les snippets avec le mini-writer
  - On doit pouvoir visualiser le rendu de tout texte écrit.
  - On doit pouvoir passer simplement dans miniwriter depuis n'importe quel
    champ d'édition, donc n'importe quel textarea, notamment à partir de
    l'éditeur d'event (EventForm).

**/

class MiniWriter {

/**
* Méthode de classe de création du mini-writer qui permet de le créer à
* l'aide de `MiniWriter.new(<field>)`
**/
static new(field /* DOMElement non jQuery */){
  if('undefined' === typeof Snippets) return FAnalyse.loadSnippets(this.new.bind(this, field))
  // if($(`#${field.id}`).length === 0) throw("Il faut transmettre un champ valide.")
  if($(field).length === 0) throw("Il faut transmettre un champ valide.")
  // console.log("field:",field)
  var mw = new MiniWriter(current_analyse, field, this.newId())
  mw.show()
  return mw
}
static newId(){
  if(undefined === this.lastId) this.lastId = 0
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
  if (this.jqOwner.val() != this.textField.val()){
    if(!confirm("Le texte original a été modifié. Voulez-vous vraiment abandonner les changements ?")) return false
  }
  this.hide()
  return true
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
  Méthode de construction du mini-writer
 */
build(){
  return [
      DCreate('DIV', {class:'mini-writer-editor', append: [
          DCreate('DIV', {class: 'mini-writer-tools', inner: '[Mettre ici les outils]'})
        , DCreate('DIV', {class:'mini-writer-div-textarea', append : [
            DCreate('TEXTAREA', {id: `mini-writer-${this.id}-content`, class:'mini-writer-content'})
          ]})
        , DCreate('DIV', {class: 'mini-writer-buttons', append: [
            DCreate('DIV', {class:'fleft cbs', append:[
                DCreate('INPUT', {type:'checkbox', id: this.idFor('cb-visualizor')})
              , DCreate('LABEL', {inner: 'Visualiser', attrs: {for: this.idFor('cb-visualizor')}})
              , DCreate('INPUT', {type:'checkbox', id: this.idFor('cb-mask-fond'), attrs:{checked:'CHECKED'}})
              , DCreate('LABEL', {inner: 'Fond masqué', attrs: {for: this.idFor('cb-mask-fond')}})
              ]})
          , DCreate('BUTTON', {class:'main btn-ok', type:'button', inner:'Finir'})
          ]})
      ]})
    , DCreate('DIV', {class:'mini-writer-visualizor', style: 'display:none;', append: [
        DCreate('DIV', {class:'mini-writer-visualizor-content'})
    ]})
    ]
}
observe(){
  var my = this
  // On observe les boutons
  this.oButtons.find(`#${this.idFor('cb-visualizor')}`).on('click', this.toggleVisualizor.bind(this))
  this.oButtons.find(`#${this.idFor('cb-mask-fond')}`).on('click', this.toggleMaskFond.bind(this))
  this.oButtons.find('button.btn-ok').on('click', this.finir.bind(this))
  this.textField.on('keydown',  this.onKeyDown.bind(this))
  this.textField.on('keyup',    this.onKeyUp.bind(this))
  // On peut déposer des éléments quelconques sur le champ de texte
  let dataDrop = Object.assign({}, DATA_DROPPABLE, {
    drop: function(e, ui){
        stopEvent(e)
        var balise = my.a.getBaliseAssociation(my, ui.helper)
        balise && my.textField.insertAtCaret(balise)
        return false
    }
  })
  this.textField.droppable(dataDrop)
}

onKeyDown(e){
  if(e.keyCode === KESCAPE){

  } else if(e.keyCode === KRETURN){
    if(e.metaKey){
      // META + RETURN => FINIR
      this.finir.bind(this)()
      return stopEvent(e)
    }
  } else if(e.keyCode === KTAB){
    return KeyUpAndDown.inTextField.stopTab(e, this.sel)
  } else if (e.metaKey){
    // console.log("-> metaKey")
    if (e.ctrlKey) {
      // console.log("-> Meta + CTRL")
      if ( e.which === ARROW_UP || e.which === ARROW_DOWN){
        return KeyUpAndDown.inTextField.moveParagraph(e, sel, e.which === ARROW_UP)
      }
    } else if (e.altKey ){
      // META + ALT
    } else if (e.shiftKey) {
      // META + SHIFT
      // console.log("[DOWN] which, KeyCode, charCode, metaKey, altKey ctrlKey shiftKey", e.which, e.keyCode, e.charCode, e.metaKey, e.altKey, e.ctrlKey, e. shiftKey)
      if(e.which === 191){
        // === EXCOMMENTER OU DÉCOMMENTER UNE LIGNE ===
        return KeyUpAndDown.inTextField.toggleComments(e, this.selector, {before: '<!-- ', after: ' -->'})
      }
    } else {
      // TOUCHE META SEULE
    }
  }

}
onKeyUp(e){
  if(e.keyCode === KESCAPE){
    this.cancel.bind(this)()
    return stopEvent(e)
  } else if(e.metaKey === true){
    // MÉTA
    console.log("-> Touche META")
    if(e.shiftKey){
      // MÉTA + SHIFT
      // console.log("[UP] which, KeyCode, charCode, metaKey, altKey ctrlKey", e.which, e.keyCode, e.charCode, e.metaKey, e.altKey, e.ctrlKey)
    } else {
      // TOUCHE MÉTA SEULE
      if (e.which === KRETURN){
        F.notify("Touche retour et meta")
        return stopEvent(e)
      }
    }
  } else if(e.altKey){
    // ALT (SANS MÉTA)
    if(e.which === K_OCROCHET){ // note : avec altKey
      return KeyUpAndDown.inTextField.insertCrochet(e, this.selector)
    }
  } else if (e.which === K_GUIL_DROIT) { // " => «  »
    return KeyUpAndDown.inTextField.insertChevrons(e, this.selector)
  } else if(e.keyCode === KTAB){
    if(this.selector.before() == RC){
      // Si on est en début de ligne, on insert un élément de liste
      return KeyUpAndDown.inTextField.replaceTab(e, this.selector, '* ')
    } else {
      // Si on n'est pas en début de ligne, on regarde si ça n'est
      // un snippet
      return KeyUpAndDown.inTextField.replaceSnippet(e, this.selector)
    }
  }
  return true
}

idFor(foo){return `mw${this.id}-${foo}`}

// Le contenu du textarea
get contents(){return this.textField.val()}
get formater(){return this._formater||defP(this,'_formater', this.fatexte.formate.bind(this.fatexte))}

get textField(){return $(`#${this.domId} .mini-writer-content`)}
get oButtons(){return this._obuttons||defP(this,'_obuttons', $(`#${this.domId} .mini-writer-buttons`))}
get oVisualizor(){return this._ovisualizor||defP(this,'_ovisualizor', $(`#${this.domId} .mini-writer-visualizor`))}
get oVisualizorContent(){return this._ovisualizorContent||defP(this,'_ovisualizorContent', $(`#${this.domId} .mini-writer-visualizor-content`))}
get domId(){return this._domId||defP(this,'_domId',`mini-writer-${this.id}`)}
get fatexte(){return this._fatexte||defP(this,'_fatexte', new FATexte(''))}
get fwindow(){return this._fwindow||defP(this,'_fwindow', new FWindow(this, {class:'mini-writer', id:this.domId, y:-20, x:-20}))}
get selector(){return this._selector||defP(this,'_selector', new Selector(this.textField))}

get jqOwner(){return this._jqOwner||defP(this,'_jqOwner', $(this.owner))}
}
