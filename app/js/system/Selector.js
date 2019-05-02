'use strict'
/**
*
* Utilitaire pour manipuler la sélection dans un textarea/input[text]
*
* Version 1.0.2
*

  var sel = new Selector(myTextareaField)

  sel.contents        => le contenu de la sélection
  sel.length          => longueur de la sélection
  sel.before()        => Le caractère/signe juste avant la sélection
  sel.before(4)       => Les 4 caractères avant la sélection
  sel.beforeUpTo(sig) => les caractères avant, jusqu'au signe fourni
  sel.beforeUpTo(sig, false)    Même chose, mais sans le signe (on s'arrête avant)
  sel.beforeUpTo(sig, false/true, options)
      +options+ peut contenir :
           noRC      Rencontrer un retour chariot annule la recherche (null est
                     retourné)
           endRC     Un retour de chario peut être une fin de recherche. Si
                     le 2e argument est true (compris), on renvoie le texte
                     trouvé avec le retour chariot.
  sel.goToLineStart() Pour rejoindre le début de la ligne courante
  sel.after()         => Le caractère/signe juste après la sélection
  sel.after(4)        => les 4 caractères/signes après la sélection
  sel.afterUpTo(sig)  => Les caractères après, jusqu'au signe fourni
  sel.afterUpTo(sig, false)   Même chose, mais sans le signe (on s'arrête avant)
  sel.afterUpTo(sig, false, options) cf.beforeUpTo
  sel.remplace(txt)   => Remplace la sélection par `txt`
  sel.insert(txt)     => alias de remplace

  sel.startOffset  (r/w)   => le début de la sélection
  sel.endOffset    (r/w)   => la fin de la sélection
  sel.line         (r)     => retourne la ligne de la sélection

Notes sur versions
------------------

# Version 1.0.0
    Première mise en place efficace de l'objet Selector

# Version 1.0.2
    3e paramètre pour `beforeUpTo` et `afterUpTo` pour définir si un retour
    chariot va annuler la recherche ou va la terminer.

*/

class Selector {
constructor(domObj){
  if(domObj instanceof HTMLTextAreaElement){
    [this.domObj, this.jqObj]  = [domObj, $(domObj)]
  } else {
    [this.domObj, this.jqObj] = [domObj[0], domObj]
  }
}
/**
 * Retourne le contenu complet du champ
 */
get fieldValue(){return this.jqObj.val()}
/**
 * Retourne le contenu de la sélection
 */
get contents(){
  return this.fieldValue.substring(this.startOffset, this.endOffset)
}
/**
 * Insert à la place de la sélection
 */
insert(v){
  this.jqObj.insertAtCaret(v)
}
remplace(v){return this.insert(v)} // alias

// Pour rejoindre le début de la ligne
goToLineStart(){
  this.startOffset = this.startLineOffset
  this.endOffset   = this.startLineOffset
}
goToLineEnd(){
  this.startOffset = this.endLineOffset
  this.endOffset   = this.endLineOffset
}
get startLineOffset(){
  var nbavant = (this.beforeUpTo(RC, false)||'').length
  return this.startOffset - nbavant
}
get endLineOffset(){
  var nbapres = (this.afterUpTo(RC, false)||'').length
  return this.startOffset + nbapres
}

// Retourne le contenu de la ligne dans laquelle se
// trouve la sélection
get line(){
  return this.fieldValue.substring(this.startLineOffset, this.endLineOffset)
}
/**
 * Retourne le décalage de départ de la sélection
 */
get startOffset(){return this.domObj.selectionStart}
set startOffset(v){this.domObj.selectionStart = v}
/**
 * Retourne le décalage de fin de la sélection
 */
get endOffset(){return this.domObj.selectionEnd}
set endOffset(v){this.domObj.selectionEnd = v}
/**
 * Retourne la longueur de la sélection
 */
get length(){return this.contents.length}
/**
 * Retourne les +len+ signes avant la sélection
 */
before(len){
  if (undefined === len) len = 1
  return this.fieldValue.substring(this.startOffset - len, this.startOffset)
}
/**
 * Retourne les +len+ signes après la sélection
 */
after(len){
  if (undefined === len) len = 1
  return this.fieldValue.substring(this.endOffset, this.endOffset + len)
}

set(start, end){
  if (null !== start) this.domObj.selectionStart = start
  if (null !== end)   this.domObj.selectionEnd   = end
  this.jqObj.focus()
}

/**
 * Retourne le texte avant jusqu'au signe +sig+
 */
beforeUpTo(sig, compris, options){
  [compris, options] = this.defaultize(compris, options)
  var hasBeenFound = false
  var textAvant = this.fieldValue.substring(0, this.startOffset)
  var len = textAvant.length, curSig, textFound = [], i = len - 1
  for(;i>=0;i--){
    curSig = textAvant.substring(i, i+1)
    if ( curSig == RC ){
      if (options.noRC){
        hasBeenFound = false
        break
      } else if (options.endRC) {
        hasBeenFound = true
        compris && textFound.push(RC)
        break
      }
    }
    if(compris) textFound.push(curSig)
    if (curSig == sig){
      hasBeenFound = true
      break
    }
    if(!compris) textFound.push(curSig)
  }
  textAvant = null
  if (hasBeenFound) return textFound.reverse().join('')
  else return null
}

/**
* Retourne le texte après jusqu'au signe +sig+
* Si +compris+ est true (défaut), le sign est renvoyé, sinon, on s'arrête
* avant.
**/
afterUpTo(sig, compris, options){
  [compris, options] = this.defaultize(compris, options)
  var textApres = this.fieldValue.substring(this.endOffset, this.fieldValue.length)
  var textFound = '', curSig, hasBeenFound = false
  for(var i = 0, len = textApres.length; i < len ; ++i){
    curSig = textApres.substring(i, i + 1)
    if ( curSig == RC ){
      if (options.noRC){
        hasBeenFound = false
        break
      } else if (options.endRC) {
        hasBeenFound = true
        compris && textFound.push(RC)
        break
      }
    }
    if (compris) textFound += curSig
    if (curSig == sig){
      hasBeenFound = true
      break
    }
    if (!compris) textFound += curSig
  }
  textApres = null
  if (hasBeenFound) return textFound
  else return null
}
// Mettre les valeurs par défaut
defaultize(compris, options){
  if(undefined === compris) compris = true
  if(undefined === options) options = {}
  return [compris, options]
}
}
