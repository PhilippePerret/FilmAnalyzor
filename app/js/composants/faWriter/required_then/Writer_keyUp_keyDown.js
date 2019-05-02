'use strict'
/**
* Extension de FAWriter pour gérer l'entrée dans le champ textarea du texte
**/
FAWriter.onKeyDown = function(e){
  // console.log("[DOWN] which, KeyCode, charCode, metaKey, altKey ctrlKey", e.which, e.keyCode, e.charCode, e.metaKey, e.altKey, e.ctrlKey)
  let sel = this.selector, ret = true // retour par défaut
  if(e.keyCode === KTAB){
    return KeyUpAndDown.inTextField.stopTab(e, sel)
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
        return KeyUpAndDown.inTextField.toggleComments(e, sel, {before: '# ', after: null})
      }
    } else {
      // META SEUL
      if (e.which === K_S ){
        this.currentDoc.getContents()
        if (this.currentDoc.isModified()){
          this.currentDoc.save()
        }
        ret = stopEvent(e)
      }
    }
  }
  sel = null
  return ret
}

FAWriter.onKeyUp = function(e){
  // console.log("[UP] which, KeyCode, charCode, metaKey, altKey ctrlKey", e.which, e.keyCode, e.charCode, e.metaKey, e.altKey, e.ctrlKey)
  var sel = this.selector
    , ret = true
  if(e.metaKey){
    // MÉTA
    if(e.shiftKey){
      // MÉTA + SHIFT
      console.log("[UP] which, KeyCode, charCode, metaKey, altKey ctrlKey", e.which, e.keyCode, e.charCode, e.metaKey, e.altKey, e.ctrlKey)
    }
  } else if(e.altKey){
    // ALT (SANS MÉTA)
    if(e.which === K_OCROCHET){ // note : avec altKey
      return KeyUpAndDown.inTextField.insertCrochet(e, sel)
    }
  } else if (e.which === K_GUIL_DROIT) { // " => «  »
    return KeyUpAndDown.inTextField.insertChevrons(e, sel)
  } else if (e.keyCode === KERASE && (sel.beforeUpTo(RC,false)||'').match(/^ +$/)){
    if(this.currentDoc.isData){
      // On doit effacer deux espaces
      let st = 0 + sel.startOffset
      sel.startOffset= st - 1
      sel.remplace('')
      stopEvent(e)
      return false
    } else {
      return true
    }
  } else if(e.keyCode === KTAB){
    if( sel.before() == RC || !sel.before() ){
      // => suivant le type
      return KeyUpAndDown.inTextField.replaceTab(e, sel, this.currentDoc.dataType.type == 'data' ? '  ': '* ')
    } else if((sel.beforeUpTo(RC,false)||'').match(/^ +$/)) {
      // <= Seulement des espaces avant la sélection
      // => Si c'est un fichier Data, on ajoute encore deux espaces,
      //    sinon on ne fait rien.
      return KeyUpAndDown.inTextField.replaceTab(e, sel, this.currentDoc.dataType.type == 'data' ? '  ': '')
    } else {
      // => Check snippet
      // On prend les lettres juste avant la sélection pour voir
      // si c'est un snippet.
      return KeyUpAndDown.inTextField.replaceTab(e, sel)
    }
  }
  sel = null
  return ret
}
