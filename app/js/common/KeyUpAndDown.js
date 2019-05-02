'use strict'
/**
  Extension pour gérer les touches

  Sert aussi au FAWriter
**/

const KeyUpAndDown = {
  class: 'KeyUpAndDown'
, type: 'Object'

, init(){
    this.a = current_analyse
    this.inTextField.stopTab        = this.inTextField.stopTab.bind(this)
    this.inTextField.replaceTab     = this.inTextField.replaceTab.bind(this)
    this.inTextField.replaceSnippet = this.inTextField.replaceSnippet.bind(this)
    this.inTextField.moveParagraph  = this.doMoveParagraph.bind(this)
    this.inTextField.toggleComments = this.doToggleComments.bind(this)
    this.inTextField.insertCrochet  = this.doInsertCrochet.bind(this)
    this.inTextField.insertChevrons = this.doInsertChevrons.bind(this)
  }

, commonKeyUp(e){
    if(e.key === this.keyPressed){
      // console.log("J'ai retiré la touche", e.key)
      delete this.keyPressed
      // S'il y a une fonction à appeler quand on relève la
      // touche, on l'appelle.
      if('function' === typeof(this.methodOnKeyPressedUp)){
        this.methodOnKeyPressedUp()
      }
    }
  }
, commonKeyDown(e){
    // console.log("-> KeyUpAndDown#commonKeyDown")
    if(e.metaKey){
      if(['j','k','l'].indexOf(e.key) > -1){
        let a   = current_analyse
          , loc = a.locator
          , vid = a.videoController
        if (e.key === 'j') { // meta + j => rewind or accelerate
          loc.playing && loc.togglePlay()
          loc.rewind(1.0)
          return stopEvent(e)
        } else if(e.key === 'k'){ // meta + k => stop
          loc.playing && loc.stop()
          vid.setSpeed(1.0)
          return stopEvent(e)
        } else if(e.key === 'l'){ // meta + l => start or accelerate
          // Si la vidéo est déjà en train de jouer, on l'accélère
          // Si la vidéo n'est pas en train de jouer, on la démarre
          loc.playing ? vid.setSpeed(vid.getSpeed() + 0.5) : loc.togglePlay()
          return stopEvent(e)
        }
      }
    }
    else if (this.keyPressed){
      switch (this.keyPressed) {
        case 'v':
          // Pour changer la taille de la vidéo, on maintient la touche 'v'
          // appuyé et on joue les flèches
          if(e.keyCode === ARROW_UP || e.keyCode === ARROW_DOWN){
            current_analyse.options.change('video_size', e.keyCode === ARROW_UP ? '+' : '-', /*don't save = */ true)
            // La méthode qu'il faudra appeler lorsqu'on relèvera la touche
            this.methodOnKeyPressedUp = current_analyse.options.save.bind(current_analyse.options)
            return stopEvent(e)
          }
          break;
        default:

      }
    }
    else {
      this.keyPressed = e.key
    }
  }
, inTextField:{
  // Méthode appelé quand on joue la touche TAB
    stopTab(e, sel){
      return stopEvent(e)
    }
    // Remplace la touche tabulation, dans le selector +sel+,
    // par le texte +remp+
  , replaceTab(e, sel, remp){
      sel.insert(remp)
      return stopEvent(e)
    }
  , replaceSnippet(e, sel){
      var snip = sel.beforeUpTo(' ', false, {endRC: true})
      snip === null || Snippets.checkAndReplace(sel, snip)
      // return stopEvent(e)
    }
    // Méthode appelée pour déplacer un paragraphe dans le texte
  , moveParagraph(e, sel, toUp){
      return this.doMoveParagraph(e, sel, toUp)
    }
  , toggleComments(e, sel, args){
      return this.doToggleComments(e, sel, args)
  }
  , insertCrochet(e, sel){
      return this.doInsertCrochet(e, sel)
  }
  , insertChevrons(e, sel){
      return this.doInsertChevrons(e, sel)
  }
}

/**
  Les touche Up et Down quand on se trouve en dehors d'un champ de
  texte.
  TODO Attention, pour le moment, ça n'est pas implémenté.
**/
, outTextField:{

  }
}

KeyUpAndDown.doInsertCrochet = function(e, sel){
  sel.insert('}')
  sel.set(sel.startOffset-1, sel.startOffset-1)
  return true
}
KeyUpAndDown.doInsertChevrons = function(e, sel){
  sel.set(sel.startOffset-1, null)
  sel.insert('«  »')
  sel.set(sel.startOffset-2, sel.startOffset-2)
}
KeyUpAndDown.doToggleComments = function(e, sel, args){
  var {before: debCom, after: endCom} = args
  if(sel.line.substring(0,debCom.length) == debCom){
    // <= La ligne commence par '# '
    // => Il faut décommenter
    sel.startOffset = sel.startLineOffset
    sel.endOffset = sel.startLineOffset + debCom.length
    sel.insert('')
    if(endCom){
      sel.startOffset = sel.endLineOffset - endCom.length
      sel.endOffset   = sel.endLineOffset
      sel.insert('')
    }
  } else {
    // <= La ligne ne commence pas par '# '
    // => Il faut la commenter (l'ex-commenter)
    sel.goToLineStart()
    sel.insert(debCom)
    if(endCom){
      sel.goToLineEnd()
      sel.insert(endCom)
    }
  }
}
KeyUpAndDown.doMoveParagraph = function(e, sel, toUp){
  var sOffset, decFromStart, parag
  // Prendre le paragraphe courant
  var befText = sel.beforeUpTo(RC, false)
  if(befText === null){
    // <= Pas de RC avant
    // => On est en haut
    if(toUp) return
    decFromStart = 0
  } else {
    decFromStart = befText.length
  }
  // On se déplace au début du paragraphe
  sel.set(sel.startOffset - befText.length, null)
  // On cherche la fin du paragraphe (en la prenant)
  var aftText = sel.afterUpTo(RC, true)
  if(aftText === null){
    // <= Pas de RC après
    // => On est tout en bas du document. Il faut s'arrêter là si
    //    c'est la descente qui est demandée
    if(!toUp) return
  }
  // On place la fin de la sélection à cet endroit
  sel.set(null, sel.endOffset + aftText.length)
  // On mémorise le paragraphe (car on va l'enlever et le remettre
  // plus haut ou plus bas)
  parag = sel.contents
  // console.log(`Le paragraphe à coller: "${parag}"`)
  // On efface le paragraphe
  sel.remplace('')
  if(toUp){
    // On doit remonter d'un signe pour se placer dans le paragraphe
    // précédent
    sOffset = sel.startOffset - 1
    sel.set(sOffset, sOffset)
    // On cherche le début du paragraphe précédent
    befText = sel.beforeUpTo(RC, false)
    if(befText === null){
      // <= Pas de retour chariot avant
      // => C'est le premier paragraphe
      sOffset = 0
    } else if (befText.length) {
      // <= Le texte précédent à une longueur
      // => Ce n'est pas un paragraphe vide
      sOffset = sel.startOffset - befText.length
    } else {
      sOffset = null // pas de déplacement à faire
    }
    if(sOffset !== null) sel.set(sOffset, sOffset)
  } else {
    // On doit descendre le paragraphe
    aftText = sel.afterUpTo(RC, false)
    if (aftText === null){
      // <= pas de retour chariot après
      // => On est arrivé en bas
      sOffset = sel.fieldValue.length - 1
      // Il faut ajouter un retour de chariot au paragraph
      parag = `${RC}${parag.substring(0, parag.length -1)}`
    } else if (aftText.length) {
      // Si on trouve encore des retours chariot après
      sOffset = sel.startOffset + aftText.length + 1
    } else {
      sOffset = sel.startOffset + 1
    }
    // On se déplace à l'endroit où le paragraphe doit êre recollé
    if ( sOffset !== null ) sel.set(sOffset, sOffset)
  }
  // Et on colle ici le paragraphe
  sel.remplace(parag)
  // On remonte au début du paragraph
  sOffset = sel.startOffset - parag.length
  sel.set(sOffset, sOffset)
  if(decFromStart){
    // On se replace où on était dans le paragraphe
    sOffset = sel.startOffset + decFromStart
    sel.set(sOffset, sOffset)
  }

  // console.log(`Monter ou descendre le paragraphe "${parag}"`)
  return stopEvent(e)

}
KeyUpAndDown.init()
