'use strict'

/**
  Pour afficher une boite de dialogue avec des boutons

  USAGE
    let mb = new MessageBox(<data>)
    mb.show()
    //' Le programme doit se finir ici

  REQUIS :
    <data> définissant :
      :message      Le message principal à afficher
  OPTIONNEL
      :buttons      Liste Array des boutons, dans le même ordre qu'à l'écran
                    Par défaut : ['Annuler', 'OK']
      :title        Le titre de la fenêtre
                    Par défaut : vide
      :defaultButtonIndex   L'index du bouton (dans :buttons) sélectionné par
                            défaut. C'est lui qui réagira à la touche Return
                            Par défaut : 1
      :cancelButtonIndex    Index (dans :buttons) du bouton pour annuler. C'est
                            lui qui réagira à la touche Escape.
                            Par défaut : 0
      :okButtonIndex        Index (dans :buttons) du bouton pour confirmer. C'est
                            lui qui réagira (aussi) à la touche Return.
                            Par défaut : 1
      :methodOnOK           Méthode qui sera appelée si OK est cliqué (ou Return)
      :methodOnCancel       Méthode à appeler si le bouton Cancel est cliqué (ou
                            la touche Escape)
                            Note : si aucun de ces deux fonctions n'est définie,
                            c'est un simple message d'avertissement, avec un
                            bouton OK.
      :defaultAnswer        Si défini, ce n'est pas une boite de confirmation ou
                            d'information, c'est un prompt qui demander une
                            réponse à donner dans un champ de texte.
      :width                Largeur précise (ou en pourcentage) à donner à la
                            fenêtre.
                            Par défaut : 20%

**/
class MessageBox {
  constructor(data){
    this.data       = data
    this.title      = data.title || data.titre
    this.type       = data.type || 'alert' // 'alert', 'confirm' // inusité
    this.width      = data.width
    this.message    = data.message
    this.defaultButtonIndex = data.defaultButtonIndex
    defaultize(this,'defaultButtonIndex',1)
    this.cancelButtonIndex  = data.cancelButtonIndex
    defaultize(this,'cancelButtonIndex',0)
    this.okButtonIndex      = data.okButtonIndex
    defaultize(this,'okButtonIndex',1)
    this.defaultAnswer      = data.defaultAnswer

    this.methodOnCancel = data.methodOnCancel
    this.methodOnOK     = data.methodOnOK || data.methodOnOk

    this.buttons    = data.buttons || ['Annuler', 'OK']

  }
  show(){
    this.build()
    this.observe()
  }
  close(){
    this.remove()
    this.unobserve()
  }
  unobserve(){
    // Remettre les observers originaux
    window.onkeyup = this.oldKeyUp
    window.onkeydown = this.oldKeyDown
  }
  remove(){
    $('#masque-message-box').remove()
    this.jqObj.remove()
  }
  get isConfirmBox(){return this.type === 'confirm'}

  onClickBtn(ibtn){
    F.notify(`Bouton cliqué : ${ibtn}`)
    this.close()
  }

  // Quand on annule avec la touche ESCAPE ou le bouton d'annulation
  onCancel(e){
    // F.notify("Bouton CANCEL cliqué")
    isDefined(this.methodOnCancel) && this.methodOnCancel.call()
    this.close()
  }

  onOK(e){
    F.notify("Bouton OK cliqué -- ou Return")
    if ( this.isPrompt() ) {
      this.methodOnOK(this.getAnswer(), 1)
    } else {
      isDefined(this.methodOnOK) && this.methodOnOK.call()
    }
    this.close()
  }

isPrompt(){return isDefined(this.defaultAnswer)}

// Quand on relève une touche dans la réponse
onKeyUpAnswer(e){
  e.stopPropagation(e)
  switch (e.key) {
    case STREnter:
      UI.onBlurTextField.bind(UI)() // car pas déclenché au blur du answer field
      if ( this.okButtonIndex === this.defaultButtonIndex) {
        this.onOK(e)
      } else if (this.cancelButtonIndex === this.defaultButtonIndex) {
        this.onCancel(e)
      }
      return false
    case ESCAPE:
      return stopEvent(e)
    case TABULATION:
      e.stopPropagation()
      this.onCancel(e)
      return false
    default:
      e.stopPropagation()
      return true
  }
}
onKeyDownAnswer(e){
  e.stopPropagation()
  return true
}

/**
  Retourne la valeur donnée dans le champ, si c'est un prompt
**/
getAnswer(){
  return this.answerField.val().trim()
}

build(){
  var ibtn = -1 // pour commencer à 0
  var btns = this.buttons.map( b => DCreate(BUTTON, {type:STRbutton, inner:b, class:`button-${++ibtn}`}))
  $(btns[this.defaultButtonIndex]).addClass('main-button')

  var divs = [
      DCreate(DIV,{class:'title', inner: this.title})
    , DCreate(DIV,{class:'message', inner: this.message})
  ]
  if ( this.isPrompt() ) {
    divs.push(DCreate(DIV,{class:'reponse',append:[
      DCreate(INPUT,{type:STRtext,class:'message-box-answer',value:this.defaultAnswer})
    ]}))
  }
  // Ajout des boutons
  divs.push(DCreate(DIV,{class:'buttons', append:btns}))

  this.jqObj = $(DCreate(DIV,{class:`message-box message-box-${this.type}`, append:divs}))
  if ( isDefined(this.width) ) {
    this.jqObj.css('width', this.width)
    // Régler aussi la marge (mais seulement si la taille est donnée en %)
    if ( this.width.endsWith('%') ){
      let pct = parseInt(this.width.substring(0, this.width.length - 1), 10)
        , reste = Math.round((100 - pct) / 2)
      this.jqObj.css('left', `${reste}%`)
    }
  }
  document.body.append(DCreate(DIV,{id:'masque-message-box'}))
  document.body.append(this.jqObj[0])
}

observe(){
  for(var ibtn = 0, len = this.buttons.length; ibtn < len ; ++ibtn){
    // ibtn = parseInt(ibtn,10)
    if ( ibtn == this.okButtonIndex ){
      this.jqObj.find(`.button-${ibtn}`).on(STRclick, this.onOK.bind(this))
    } else if ( ibtn == this.cancelButtonIndex ){
      this.jqObj.find(`.button-${ibtn}`).on(STRclick, this.onCancel.bind(this))
    } else {
      // Autres boutons
      this.jqObj.find(`.button-${ibtn}`).on(STRclick, this.onClickBtn.bind(this, parseInt(ibtn,10)))
    }
  }

  // On bloque toutes les autres actions
  this.oldKeyUp     = window.onkeyup
  this.oldKeyDown   = window.onkeydown

  window.onkeyup    = this.onKeyUp.bind(this)
  window.onkeydown  = this.onKeyDown.bind(this)

  $('#masque-message-box').on(STRclick, this.onClickBackground.bind(this))

  // On focusse dans le champ de saisie, si c'est un prompt
  if ( this.isPrompt() ){
    this.answerField
      .on(STRkeyup, this.onKeyUpAnswer.bind(this))
      .on(STRkeydown, this.onKeyDownAnswer.bind(this))
      .on(STRfocus, UI.onFocusTextField.bind(UI))
      .on(STRblur,  UI.onBlurTextField.bind(UI))
      .focus()

    // UI.onFocusTextField.bind(UI)({target: this.answerField[0]}/* ne sert à rien pour le moment*/)
  }
}

  onKeyUp(e)    {
    if(e.key === ESCAPE) this.onCancel()
    else if (e.key === ENTER){
      if ( this.okButtonIndex === this.defaultButtonIndex) {
        this.onOK(e)
      } else if (this.cancelButtonIndex === this.defaultButtonIndex) {
        this.onCancel(e)
      }
    }
    return stopEvent(e)
  }
  onKeyDown(e)  { return stopEvent(e) }
  onClickBackground(e){
    return stopEvent(e)
  }

get answerField(){return this.jqObj.find('.reponse INPUT')}

}// /class MessageBox

module.exports = MessageBox
