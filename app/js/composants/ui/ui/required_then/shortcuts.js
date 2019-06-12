'use strict'
/**
  Gestion des combinaisons de touches dans le mode Ban Timeline

  NOTE
    On modifie les raccourcis en appelant la méthode :
    UI.toggleKeyUpAndDown(true) // vers INTERFACE (out field)

**/

const GOTODATA = App.require('system/prefs/gotodata')
const TBL_GOTO_FLAG2METHOD = {}


Object.assign(UI, {

/**
  Méthode principale qui reçoit les touches quand on est dans un champ
  de saisie.

  note : on modifie les raccourcis en appelant la méthode :
  UI.toggleKeyUpAndDown(true) // vers INTERFACE (out field)

**/
  onKey_UP_IN_TextField(e){
    let target = $(e.target)
      , touche = e.key
    // log.info("-> KeyUp dans un TEXT FIELD")

    var sel // = new Selector(target) (dès que c'est utile ci-dessous)

    if ( touche === STRArrowLeft || touche === STRArrowRight ) {
      // Quand une des flèches gauche ou droit est pressée, il faut
      // regarder où il faut se rendre en fonction des préférences 'goto-...'
      // Mais ça doit être traité par DOWN_IN
    } else if(e.key === ESCAPE){
      /**
        // TODO Il faut traiter l annulation quand on est dans un champ
        // de texte.
      **/
      // this.cancel.bind(this)()
      // return stopEvent(e)
    } else if(isTrue(e.metaKey)){
      // MÉTA
      // console.log("-> Touche META")
      if(e.shiftKey){
        // MÉTA + SHIFT
        // console.log("[UP] which, KeyCode, charCode, metaKey, altKey ctrlKey", e.which, e.keyCode, e.charCode, e.metaKey, e.altKey, e.ctrlKey)
      } else {
        // TOUCHE MÉTA SEULE
        if (e.which === KRETURN){
          // F.notify("Touche retour et meta")
          return stopEvent(e)
        }
      }

    } else if(e.altKey){

      // ALT (SANS MÉTA)

      if(e.which === K_OCROCHET){ // note : avec altKey
        return UI.inTextField.insertCrochet(e, new Selector(target))
      }

    } else if (e.which === K_GUIL_DROIT) { // " => «  »

      return UI.inTextField.insertChevrons(e, new Selector(target))

    } else if (e.key === DELETE ){
      sel = new Selector(target)
      if ( ((sel && sel.beforeUpTo(RC,false))||'').match(/^ +$/) ) {
        // TODO TROUVER COMMENT SAVOIR QUE LE PROPRIÉTAIRE EST LE FAWRITER
        if ( e.target.data('owner-id') === 'porte_documents') {
          if(PorteDocuments.currentDocument.isData){
            // On doit effacer deux espaces
            sel = PorteDocuments.selector
            let st = 0 + sel.startOffset
            sel.startOffset= st - 1
            sel.remplace('')
            stopEvent(e)
            return false
          }
        }
      }

    } else if(e.keyCode === KTAB){

      if(target.data('owner-id') === 'porte_documents'){
        if(PorteDocuments.selector.before() == RC){
          // Si on est en début de ligne, on insert un élément de liste
          return UI.inTextField.replaceTab(e, new Selector(target), '* ')
        }
      }
      return UI.inTextField.replaceSnippet(e, new Selector(target))
    }
    return true
  }

, onKey_DOWN_IN_TextField(e){
    let target = $(e.target)
      , touche = e.key

    if(e.key === ESCAPE){
      if ( FWindow.currentIsEventForm() ){
        // Fermer la fenêtre d'édition, peut-être sans enregistrer
        if ( EventForm.modified ) {
          F.notify('event-modified-cant-close-form')
        } else {
          FWindow.closeCurrent()
        }
      } else {
        F.notify(T('unknown-front-fwindow-cant-close'))
      }
    } else if ( e.key === ENTER ) {
      if(e.metaKey){
        // META + RETURN => FINIR L'ÉDITION DE ?…
        if ( FWindow.currentIsEventForm() ) {
          EventForm.currentForm.submit.bind(EventForm.currentForm).call()
        } else if(target.data('owner-id') === 'porte_documents'){
          // Enregistrer le document couramment édité
          PorteDocuments.saveContentsAndCurrentDoc()
          return stopEvent(e)
        } else {
          F.notify(T('unknown-front-fwindow-cant-close'))
        }
        return stopEvent(e)
      }
    } else if(e.keyCode === KTAB){
      return this.inTextField.stopTab(e, new Selector(target))
    } else if ( e.metaKey ) {
        if ( e.ctrlKey ) {
          // MÉTA + CTRL
          if ( e.which === ARROW_UP || e.which === ARROW_DOWN){
            // UNE ERREUR CI DESSOUS: sel EST NON DÉFINI
            // IL FAUT PRENDRE LE selector du propriétaire
            return this.inTextField.moveParagraph(e, new Selector(target), e.which === ARROW_UP)
          }
        } else if (e.altKey ){
          // META + ALT
        } else if (e.shiftKey) {
          // META + SHIFT
          // console.log("[DOWN] which, KeyCode, charCode, metaKey, altKey ctrlKey shiftKey", e.which, e.keyCode, e.charCode, e.metaKey, e.altKey, e.ctrlKey, e. shiftKey)
          if(e.which === 191){
            // === EXCOMMENTER OU DÉCOMMENTER UNE LIGNE ===
            if(target.data('owner-id') === 'porte_documents'){
              return this.inTextField.toggleComments(e, PorteDocuments.selector, {before: '<!-- ', after: ' -->'})
            }
          }
        } else {
          // MÉTA seule
          switch (e.key) {
            case STRj:
            case STRk:
            case STRl:
              let a   = current_analyse
                , loc = a.locator
                , vid = a.videoController
              if (e.key === STRj) { // meta + j => rewind or accelerate
                loc.playing && loc.togglePlay()
                vid.rewind(1.0)
                return stopEvent(e)
              } else if(e.key === STRk){ // meta + k => stop
                loc.playing && vid.stop()
                vid.setSpeed(1.0)
                return stopEvent(e)
              } else if(e.key === STRl){ // meta + l => start or accelerate
                // Si la vidéo est déjà en train de jouer, on l'accélère
                // Si la vidéo n'est pas en train de jouer, on la démarre
                loc.playing ? vid.setSpeed(vid.getSpeed() + 0.5) : loc.togglePlay()
                return stopEvent(e)
              }
              break
            case STRs: // MÉTA + s
              if(target.data('owner-id') === 'porte_documents'){
                PorteDocuments.saveContentsAndCurrentDoc()
                return stopEvent(e)
              } else {
                F.notify("Je ne connais pas le propriétaire pour exécuter Command + s… Pour y remédier, définir le 'data-owner-id' de la cible, par exemple, ou donner un ID précis au container.")
              }
              break
          }
        }
      }
    }

/**
  Méthode principale qui reçoit les touches quand on est hors d'un champ
  de saisie
**/
, onKey_UP_OUT_TextField(e){
    let target = $(e.target)
    log.info(`-> onKey_UP_OUT_TextField (e.key: "${e.key}")`)
    // console.log("Touche pressée en dehors d'un champ de saisie :", e.key)
    // On met la touche pressée dans une variable pour pouvoir la
    // modifier plus tard.
    var touche = e.key

    // console.log(e)
    if(touche === this.currentKeyDown){
      // console.log("J'ai retiré la touche", e.key)
      delete this.currentKeyDown
      // S'il y a une fonction à appeler quand on relève la
      // touche, on l'appelle.
      isFunction(this.methodOnKeyPressedUp) && this.methodOnKeyPressedUp()
    }

    switch (touche) {
      case ESCAPE:
        if ( FWindow.closeCurrent() ) return stopEvent(e)
        else return true
      case STRTab:
        // Si une fwindow est courante, il faut focusser dans son
        // premier champ de texte (en s'assurer qu'on bascule bien dans l'autre
        // mode de raccourcis)
        if(FWindow.current){
          FWindow.current.jqObj.find(TEXT_TAGNAMES).focus()
          return stopEvent(e)
        }
        break
      case STRg: // g => fenêtre "goto"
        Helper.open('go-to')
        return stopEvent(e) // pas par le menu cf. N0004
      case STRm: // m
        log.info('m:New marker')
        this.a.markers.createNew() // pas par le menu cf. N0004
        return stopEvent(e)
      case STRM: // M
        log.info('M:show markers list')
        current_analyse.markers.showListing() // pas par le menu cf. N0004
        return stopEvent(e)
      case STRn: // n => pour choisir un nouvel élément à créer
        Helper.open('new-element') // pas par le menu cf. N0004
        return stopEvent(e)
      case STRN: // N majuscule
        FAEstt.klisting.show(); break
      case ' ':
        touche = this.a.locator.playing ? STRk : STRl
      case STRk: // k
      case STRj: // j
      case STRJ: // J
      case STRl: // l
        let loc = this.a.locator
          , vid = this.a.videoController
        if ( touche === STRj ) { // meta + j => rewind
          loc.playing && loc.togglePlay()
          vid.rewind(1.0)
        } else if(touche === STRJ){ // maj + j => rewind plus fort
          loc.playing && loc.togglePlay()
          vid.rewind(10)
        } else if(touche === STRk){ // meta + k => stop
          loc.playing && vid.stop()
          vid.setSpeed(1.0)
        } else if(touche === STRl){ // meta + l => start or accelerate
          // Si la vidéo est déjà en train de jouer, on l'accélère
          // Si la vidéo n'est pas en train de jouer, on la démarre
          loc.playing ? vid.setSpeed(vid.getSpeed() + 0.5) : loc.togglePlay()
        }
        return stopEvent(e)
      case STRS: // S majuscule
        FAEscene.klisting.show(); break
      // La touche "z" permet de ZOOMER/DÉZOOMER
      case STRz:
        this.UI.zoom();break
      case STRZ:
        this.UI.zoom(10); break
      case 'Â':
        this.UI.dezoom();break
      case 'Å': // alt-maj-z
        this.UI.dezoom(10);break
      case 'Escape':
        /**
          // TODO Close current fwindow
          // Attention j ai l impression que plusieurs parties le font
        **/
        break
      default:

    }
  }

, onKey_DOWN_OUT_TextField(e){
    // log.info(`-> onKey_UP_OUT_TextField (e.key: "${e.key}")`)
    let target = $(e.target)
      , touche = e.key

    if ( touche === STRArrowLeft || touche === STRArrowRight ) {
      // cf. N0003
      var flag = this.keyComb2flag(e)
      log.info("Flag Goto:", flag)
      if ( isFunction(this.a.locator[TBL_GOTO_FLAG2METHOD[flag]]) ) {
        this.a.locator[TBL_GOTO_FLAG2METHOD[flag]].bind(this.a.locator).call()
        // TODO
        // Transformer goToFilmStartOrZero en goToStartFilm
        // Transformer goToFilmEndOrEnd en goToEndFilm
      }
      return stopEvent(e)
    } else if(this.currentKeyDown){
      // <= Une touche est pressée
      switch(this.currentKeyDown){
        case STRv:
          // Pour changer la taille de la vidéo, on maintient la touche 'v'
          // appuyé et on joue les flèches
          if(e.keyCode === ARROW_UP || e.keyCode === ARROW_DOWN){
            current_analyse.options.change('video_size', e.keyCode === ARROW_UP ? '+' : '-', /*don't save = */ true)
            // La méthode qu'il faudra appeler lorsqu'on relèvera la touche
            this.methodOnKeyPressedUp = current_analyse.options.save.bind(current_analyse.options)
            return stopEvent(e)
          }
          break;
      }
    } else {

      /**
        ---------------------------------------------------------------------
          Traitement de toutes les touches seules en dehors d'un champ de
          saisie.

        ---------------------------------------------------------------------
      **/
      this.currentKeyDown = e.key
      // On met la touche pressée dans une variable pour pouvoir la
      // modifier plus tard.
      switch (touche) {
        case STRm:
          if(e.metaKey){
            log.info('CMD-m:create new marker')
            F.notify("TODO: Je dois créer un nouveau marqueur.")
            return stopEvent(e)
          } else if (e.altKey){
            log.info('ALT-M:go to previous marker')
            F.notify("TODO: Je dois passer en revue les marqueurs en sens inverse.")
          }
          break
        case STRn:
          return stopEvent(e)
        default:

      }

    }
  }

, initKeysObservers(){
    this.inTextField.stopTab        = this.inTextField.stopTab.bind(this)
    this.inTextField.replaceTab     = this.inTextField.replaceTab.bind(this)
    this.inTextField.replaceSnippet = this.inTextField.replaceSnippet.bind(this)
    this.inTextField.moveParagraph  = this.doMoveParagraph.bind(this)
    this.inTextField.toggleComments = this.doToggleComments.bind(this)
    this.inTextField.insertCrochet  = this.doInsertCrochet.bind(this)
    this.inTextField.insertChevrons = this.doInsertChevrons.bind(this)

    // On prépare les flags des combinaisons arrows
    // cf. N0003
    this.prepareArrowsCombs()
  }

, inTextField:{
    // Méthode appelé quand on joue la touche TAB
    stopTab(e, sel){
      // Mais pour un input text, il faut returner true
      if (e.target.tagName === INPUT) return true
      return stopEvent(e)
    }
    // Remplace la touche tabulation, dans le selector +sel+,
    // par le texte +remp+
  , replaceTab(e, sel, remp){
      sel = sel || new Selector($(e.target))
      sel.insert(remp)
      return stopEvent(e)
    }
  , replaceSnippet(e, sel){
    sel = sel || new Selector($(e.target))
      var snip = sel.beforeUpTo(' ', false, {endRC: true})
      isNull(snip) || Snippets.checkAndReplace(sel, snip)
      // return stopEvent(e)
    }
    // Méthode appelée pour déplacer un paragraphe dans le texte
  , moveParagraph(e, sel, toUp){
    sel = sel || new Selector($(e.target))
      return UI.doMoveParagraph(e, sel, toUp)
    }
  , toggleComments(e, sel, args){
      return this.doToggleComments(e, sel || new Selector($(e.target)), args)
    }
  , insertCrochet(e, sel){
      return this.doInsertCrochet(e, sel || new Selector($(e.target)))
    }
  , insertChevrons(e, sel){
      return this.doInsertChevrons(e, sel || new Selector($(e.target)))
    }
  }

, doInsertCrochet(e, sel){
    sel.insert('}')
    sel.set(sel.startOffset-1, sel.startOffset-1)
    return true
  }
, doInsertChevrons(e, sel){
    sel.set(sel.startOffset-1, null)
    sel.insert('«  »')
    sel.set(sel.startOffset-2, sel.startOffset-2)
  }
, doToggleComments(e, sel, args){
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
, doMoveParagraph(e, sel, toUp){
    var sOffset, decFromStart, parag
    // Prendre le paragraphe courant
    var befText = sel.beforeUpTo(RC, false)
    if(isNull(befText)){
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

    if ( isNull(aftText) && isFalse(toUp) ) return
    // <= Pas de RC après
    // => On est tout en bas du document. Il faut s'arrêter là si
    //    c'est la descente qui est demandée

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
      if(isNull(befText)){
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
      if(isNotNull(sOffset)) sel.set(sOffset, sOffset)
    } else {
      // On doit descendre le paragraphe
      aftText = sel.afterUpTo(RC, false)
      if ( isNull(aftText) ) {
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
      if ( isNotNull(sOffset) ) sel.set(sOffset, sOffset)
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

/**

  Prépare le tableau TBL_GOTO_FLAG2METHOD qui va permettre d'obtenir,
  à partir d'une combinaison clavier avec les flèches left/right, de
  déterminer la méthode à appeler.

**/
, keyComb2flag(e){
    var flag = e.key === STRArrowLeft ? 32 : 64 ;
    if (e.metaKey  || e.meta )  flag = flag | 2
    if (e.altKey   || e.alt )   flag = flag | 4
    if (e.ctrlKey  || e.ctrl )  flag = flag | 8
    if (e.shiftKey || e.shift ) flag = flag | 16
    return flag
  }
, prepareArrowsCombs() {
    // On commence par relever les préférences
    var listePrefs = GOTODATA.map(dsc => `goto-${dsc.type}`)
    var prefs = Prefs.get(listePrefs)
    if ( isUndefined(prefs['goto-next-scene']) ) {
      prefs = {}
      GOTODATA.map(dsc => prefs[`goto-${dsc.type}`] = dsc.dataArrowComb)
    }
    for ( var pref in prefs ) {
      // On transforme "goto-next-scene" en goToNextScene
      var method = pref.split('-').map(t => t.titleize())
      method[0] = 'goTo'
      method = method.join('')
      TBL_GOTO_FLAG2METHOD[this.keyComb2flag(prefs[pref])] = method
    }
    // console.log("TBL_GOTO_FLAG2METHOD:", TBL_GOTO_FLAG2METHOD)
  }
}) // /Object.assign(UI)

UI.initKeysObservers()
