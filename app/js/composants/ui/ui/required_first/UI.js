'use strict'
/**
 * Gestion de l'interface
 */

window.H = undefined
window.W = undefined

const UI = {
  class: 'UI'

/**
  Méthode, appelée à l'initialisation, permettant de surveiller
  les mutations du DOM et, notamment, observer les champs de
  texte qui sont ajoutés.
**/
, observeMutations(){
    // On place un observer qui
    let domObserver = new MutationObserver((mutations, observer) => {
      for(var mutation of mutations){
        if(mutation.type === STRchildList){
          // Un élément ajouté
          // console.log("Éléments ajoutés : ", mutation.addedNodes)
          mutation.addedNodes.forEach( node => {
            // console.log("Observers focus/blur posés sur :", node)
            // console.log("Champs de saisie trouvés : ",$(node).find(TEXT_TAGNAMES))
            // $(node).find(TEXT_TAGNAMES)
            //   .on(STRfocus, UI.onFocusTextField.bind(UI))
            //   .on(STRblur,  UI.onBlurTextField.bind(UI))
            //   .data('owner-id', node.id)
            // l'idée maintenant est de faire un peu plus du surmesure.
            // Le champ peut contenir une donnée "data-onfocus-fn" et "data-onblur-fn"
            // dont la valeur sera une méthode de UI qui sera appelée au lieu des
            // méthode communes onFocusTextField et onBlurTextField
            $(node).find(TEXT_TAGNAMES).each((i, o) => {
              var fn, fnOnFocus, fnOnBlur
              o = $(o)
              fnOnFocus = o.data('onfocus-fn') || 'onFocusTextField'
              fnOnBlur  = o.data('onblur-fn')  || 'onBlurTextField'
              // if ( fnOnFocus ) {
              //   console.log("L'élément définit une méthode au focus", o, fnOnFocus)
              // }
              // if ( fnOnBlur ) {
              //   console.log("L'élément définit une méthode au blur", o, fnOnBlur)
              // }
              o.on(STRfocus,  UI[fnOnFocus].bind(UI))
                .on(STRblur,  UI[fnOnBlur].bind(UI))
                .data('owner-id', node.id)

            })
          })
        }
      }
    })
    let domObserverConfig = {
      // On ne prend pas les changements d'attributs
      attributes: false,
      // On veut la liste des éléments ajoutés et supprimés
      childList: true,
      // Seulement les éléments ajoutés à l'élément surveillé
      subtree: false
    };

    // Toutes les touches forment des combinaisons
    // clavier, tant qu'on n'est pas dans un champ de texte.
    // Pour activer les observers « hors champ », on simule le
    // blur d'un champ de texte
    this.onBlurTextField()

    // On commence à observer le DOM, seulement les sections
    // dans lesquelles ont peut ajouter des éléments (car
    // subtree est false dans les configurations de mutation)
    domObserver.observe(document.body, domObserverConfig)
    domObserver.observe(DGet('section-porte-documents'), domObserverConfig)
    domObserver.observe(DGet('section-eventers'), domObserverConfig)

  }

, onBlurPorteDocumentTextarea(e){
    return PorteDocuments.observeKeys()
  }

/**
  Pour observer la vidéo (son chargement)
  Noter qu'il ne faut le faire qu'une seule fois, sinon, ça
  appelle deux fois la méthode `onVideoLoaded`
  C'est la raison pour laquelle je préfère la mettre dans UI
  plutôt que dans l'objet VideoController.

**/
, observeVideo(){
    let my = this
    if ( isTrue(this.videoObserved) ) return
    $(UI.video)
      .on('error', ()=>{
        log.warn("Une erreur s'est produite au chargement de la vidéo.", err)
      })
      .on('loadeddata', () => {
        current_analyse.onVideoLoaded.bind(current_analyse)()
      })
      .on('ended', () => {
        // Quand on atteint le bout de la vidéo
        current_analyse.videoController.stop()
      })
    this.videoObserved = true
  }

/**
  Fixe la taille de la section du Reader pour qu'elle ne puisse pas se
  redimensionner suivant son contenu.
  La méthode est appelée au chargement mais aussi au resize de la vidéo.

  @param {Number} size    Width en pixels à donner, ou la taille actuelle.
**/
, fixeSectionReaderWidth(size){
    UI.sectionReader.css('width', `${size || UI.sectionReader.width()}px`)
  }

/**
  Met l'interface aux dimensions de l'analyse
**/
, setUIsections(){
    let hc1r1 = this.a.options.get('ui.row.c1r1.height')
    hc1r1 && UI.C1R1.height(hc1r1)
    // var htim = this.a.options.get('ui.section.timeline.height') || 200
    // UI.sectionTimeline.css('height',`${htim}px`)
    let wrea = this.a.options.get('ui.section.reader.width')
    wrea && UI.sectionReader.width(wrea)
    // let hvid = this.a.options.get('ui.section.video.height')
    let wvid = this.a.options.get('ui.section.video.width')
    wvid && UI.sectionVideo.width(wvid)

    // console.log({
    //     'heigth timeline': htim
    //   , 'width reader': wrea
    //   , 'height video': hvid
    //   , 'width video': wvid
    //   , 'height c1r1': hc1r1
    // })
  }

/**
  Les deux méthodes `onFocusTextField` et `onBlurTextField` sont
  appelées par les méthodes implémentées

  ATTENTION : `e` peut ne pas être défini, quand la méthode
  est appelée pour forcer le focus, comme par exemple avec les
  messageBox en mode prompt.
**/
, onFocusTextField(e){
    UI.toggleKeyUpAndDown(/* out-text-field = */ false)
  }
, onBlurTextField(e){
    UI.toggleKeyUpAndDown(/* out-text-field = */ true)
  }

, updateUIConstants(){
    // La hauteur absolue de l'espace libre, au-dessus de la barre
    // d'état
    H = window.innerHeight - UI.stateBar.outerHeight()
    log.info(`H (hauteur espace travail) : ${H}`)
    W = window.innerWidth
    log.info(`W (largeur espace travail) : ${W}`)
  }

/**
  Pour indiquer un texte à côté du curseur de temps dans le banc timeline
**/
, markCursor(str) {
    this.timerMarkCursor && this.killTimerMarkCursor()
    if ( isNotEmpty(str) ){
      this.oMarkCursor.html(str)
      this.oMarkCursor.show()
      this.timerMarkCursor = setTimeout(this.hideMarkCursor.bind(this), 3000)
    } else {
      this.oMarkCursor.hide()
    }
  }
, hideMarkCursor(){
    this.killTimerMarkCursor()
    this.oMarkCursor.hide()
  }
, killTimerMarkCursor(){
    clearTimeout(this.timerMarkCursor)
    delete this.timerMarkCursor
  }

/**
  Retourne la vraie hauteur de l'élément, border et padding compris
**/
, realHeight(o){
    return $(o).outerHeight()
  }
, realWidth(o){
    return $(o).outerWidth()
  }

/**
  Méthode pour définir les obersers des touches up and down
  Cette méthode doit impérativement être appelée pour conserver le
  fonctionnement des raccourcis universels qui doivent fonctionner dans tous
  les cas.

  @param {String} modeName    Le nom du mode, par exemple 'FA-LISTING-FAPersonnage'
                              Il permet de consigner le mode pour le remettre
                              plus tard, lorsque la fenêtre qui l'utilise
                              redevient active.
  @param {Object} args        Définition des raccourcis :
                      name:   Nom à mettre dans la barre d'état
                      up:     méthode pour keyUp
                      down:   méthode pour keyDown
                      not_universel   Si true, on ne met pas les raccourcis
                              universels.
**/
, setKeyUpAndDown(modeName, args) {
    // console.log("application des raccourcis:", modeName)
    isDefined(this.ShortcutsMap) || ( this.ShortcutsMap = new Map() )
    if ( this.ShortcutsMap.has(modeName) ) {
      // console.log(`Le mode de shortcuts "${modeName}" m'est connu, je le reprends`)
      args = this.ShortcutsMap.get(modeName)
    } else {
      // console.log(`Le mode de shortcuts "${modeName}" m'est inconnu, je le consigne`)
      isDefined(args.name) || ( args.name = modeName )
      this.ShortcutsMap.set(modeName, args)
    }

    // Pour les tests
    this.currentShortcutsName = args.name

    var res
    window.onkeyup = ((e) => {
      res = this.universalKeyUp(e)
      if ( isDefined(res) ){
        if ( isTrue(res) ) return true // comportement par défaut
        else return stopEvent(e)
      }
      res = args.up(e)
      stopEvent(e)
      return res
    })
    window.onkeydown = ((e) => {
      res = this.universalKeyDown(e)
      if ( isDefined(res) ){
        if ( isTrue(res) ) return true
        else return stopEvent(e)
      }
      res = args.down(e)
      stopEvent(e)
      return res
    })
    this.markShortcuts.html(args.name)
  }
/**
  Méthodes universelles

  @return {Boolean} true on doit adopter le traitement par défaut, sans aller
                    plus loin
                    false si on doit stopper l'event, sans aller plus loin
                    undefined si on doit continuer en testant avec les méthodes
                    particulières.
**/
, universalKeyUp(e) {
    switch (e.key) {
      case ESCAPE: // fermeture de la fenêtre au premier plan
        // console.log("Fermeture fenêtre par raccourcis universels.")
        if (
              FWindow.currentIsEventFormAndCanClose()
          ||  FWindow.currentIsPorteDocumentsAndCanClose()
          ||  FWindow.currentIsFaListing()
          ||  FWindow.currentIsDataEditorAndCanClose()
          ||  FWindow.currentIsEventersAndCanClose()
        ) {
          FWindow.closeCurrent()
          return false
        } else if ( FWindow.currentIsEventForm() ){
          F.notify(T('event-modified-cant-close-form'))
        } else if ( FWindow.currentIsDataEditor() ){
          F.notify(T('deditor-item-modified-cant-close'))
        } else {
          F.notify(T('unknown-front-fwindow-cant-close'))
        }
        return false
      case STRl: // partout, hors champ, la touche "l" démarre la video
        if ( this.isOutTextField ) {
          F.notify("Je dois démarrer la vidéo.")
          return false
        } else {
          F.notify("Je suis dans un champ de saisie, je ne démarre pas la vidéo.")
          return true
        }
    }
    return // non traité = undefined
  }
, universalKeyDown(e) {
    if ( e.metaKey && e.shiftKey && e.altKey) {
      // CMD + ALT + SHIFT => Édition
      console.log("CMD+SHIFT+ALT et ", e.key)
      switch (e.key) {
        case '¢': // ALT C Édition personnages
        case '∫': // ALT B Édition des brins
        case '∆': // ALT D Édition des décors
        // case ' ': // Les fondamentales
        case 'ﬂ': // ALT G Lites des images
        case '∏': // ALT P Calque du PFA
        case '∑': // ALT S Les statistiques
        case '›': // ALT W Édition des documents
        case '⁄': // ALT X Script d'assemblage (il faudrait mieux avec ALT)
          return true
        default:
      }
    } else if ( e.metaKey && e.shiftKey) {
      // CMD + SHIFT => Listes
      switch (e.key) {
        case STRC: // Liste des personnages
        case STRB: // Liste des brins
        case STRD: // Liste des décors
        case STRF: // Les fondamentales
        case STRG: // Lites des images
        case STRP: // Calque du PFA
        case STRS: // Les statistiques
        case STRW: // Liste des documents
        // case STRX: // Script d'assemblage (il faudrait mieux avec ALT)
          return true
        default:
      }
      return
    } else if ( e.metaKey ) {
      // META key seule (p.e. CMD+R) pour recharger
      switch (e.key) {
        case STRr: // Recharger, mais il ne faut le faire qu'en mode développement
          if (process.env.NODE_ENV === 'development') return true
          else return false
        case STRq: // Quitter
          if ( current_analyse && current_analyse.modified ) {
            return App.confirmQuit() // false ou true
          }
          return true
        default:
      }
    }
    switch (e.key) {

      default:
    }
    return
  }
/**
  Méthode qui fait basculer la captation des touches du mode "out" champs de
  texte au mode "in" (dans un champ de texte).

  C'est la méthode principale de gestion des raccourcis, il ne
  faut plus utiliser qu'elle.
**/
, toggleKeyUpAndDown(versOut){
    log.info("-> UI.toggleKeyUpAndDown")
    // Je pourrais utiliser des variables pour définir les noms des variables,
    // comme : `onKey_UP_${versOut?'OUT':'IN'}TextField`, mais je préfère pouvoir
    // les retrouver explicitement par leur nom.
    if ( versOut ) {
      this.setKeyUpAndDown('INTERFACE', {
          up:   this.onKey_UP_OUT_TextField.bind(this)
        , down: this.onKey_DOWN_OUT_TextField.bind(this)
      })
      this.isOutTextField = true
    } else {
      this.setKeyUpAndDown('TEXT FIELD', {
          up:   this.onKey_UP_IN_TextField.bind(this)
        , down: this.onKey_DOWN_IN_TextField.bind(this)
      })
      this.isOutTextField = false
    }
  }


, setDroppable(container, options){
    let dataDrop = Object.assign({}, DATA_ASSOCIATES_DROPPABLE, {
      drop(e, ui){
        var balise = current_analyse.getBaliseAssociation(undefined, ui.helper, e)
        if(balise) $(e.target).insertAtCaret(balise)
      }
    })
    container.find('textarea, input[type="text"]').droppable(dataDrop)
  }

/**
 * Au chargement d'un analyse

 cf. aussi FAnalyse.resetAll (recherchable) qui est peut-être plus adapté
 pour faire ça.
 */
, reset(){}

// ---------------------------------------------------------------------
//  Pour les boucles d'attente
, startWait(message){
    if (this.waiting) return
    isDefined(message) && (message += ' Merci de patienter…')
    this.msgWaitingLoop.html(message || '')
    this.divWaitingLoop.show()
    this.waiting = true
  }

, stopWait(){
    if(!this.waiting) return
    this.divWaitingLoop.hide()
    this.waiting = false
  }

// ---------------------------------------------------------------------
//  Méthode d'affichage

/**
  Méthode qui rend visible l'élément +o+ dans son container scrollable en
  scrollant le conteneur.
  Si l'élément se trouve caché au-dessus il est mis en haut de l'espace
  visible et s'il se trouve caché en dessous il est mis en bas de l'espace
  visible.

  NOTE IMPORTANTE
    Pour pouvoir fonctionner, il faut absolument que le container possède
    la classe `position: relative`. Dans le cas contraire, les positions
    seront mal calculées.

**/
, rendVisible(o) {
    o = $(o)[0]
    let parent = o.parentNode

    // Pour ne pas avoir à tout recalculer chaque fois (par rapport au container)
    // on enregistre les données statiques qui serviront chaque fois.
    if ( isUndefined(this._containersRendVisible) ) this._containersRendVisible = new Map()

    var h
    if ( this._containersRendVisible.has(parent) ) {
      h = this._containersRendVisible.get(parent)
    } else {
      let pBounds = parent.getBoundingClientRect()
        , parentStyle = window.getComputedStyle(parent)
        , oneTiers = pBounds.height / 3
        , twoTiers = 2 * oneTiers

      h = {
          pBounds: pBounds
        , pHeight: pBounds.height
        , pBorderTop: parseInt(parentStyle['borderTopWidth'],10)
        , pPaddingTop: parseInt(parentStyle['paddingTop'],10)
        , oneTiers: oneTiers
        , twoTiers: twoTiers
      }
      h.soust = h.pBorderTop + h.pPaddingTop
      this._containersRendVisible.set(parent, h)
    }

    let oBounds       = o.getBoundingClientRect()

    // let oTop =  oBounds.top - (pBounds.top + soust)
    let oTop    = o.offsetTop - h.soust
      , pScroll = parent.scrollTop
      , oSpace  = {from:oTop, to: oTop + oBounds.height}
      , pSpace  = {from:pScroll, to:h.pHeight + pScroll}

    // console.log({
    //   oBounds: oBounds
    // , hdata: h
    // , oSpace: oSpace
    // , pSpace: pSpace
    // })

    if ( oSpace.from < pSpace.from || oSpace.to > pSpace.to ) {
      var tscrol
      if ( oSpace.from < pSpace.from ) {
      //   // <= On est en train de monter et l'item se trouve au-dessus
      //   // => Il faut placer l'item en bas
      //   tscroll = oSpace.from + pBounds.height - oBounds.height
      tscrol = Math.round(oSpace.from - h.twoTiers)
      } else {
      //   // <= On est en train de descendre et l'item se trouve en dessous
      //   // => Il faut placer l'item en haut
      //   tscroll = oSpace.from
      tscrol = Math.round(oSpace.from - h.oneTiers)
      }
      // console.log("L'item est en dehors, il faut le replacer. Scroll appliqué :", tscrol)
      parent.scrollTo(0, tscrol)
    }
  }
/**
  Méthode qui règle les inputs champs texte pour définir si les
  textes doivent être édités dans le miniwriter ou dans leur
  champ d'origine.
**/
, miniWriterizeTextFields(container, editInMiniwriter){
    // console.log("-> miniWriterizeTextFields", editInMiniwriter)
    if(!container) container = $(document)

    container.find(STRtextarea)[editInMiniwriter?'on':'off'](STRfocus, function(e){
      MiniWriter.new($(this)[0])
    })
  }
/**
 * Rend tous les champs avec la class "horlogeable" du +container+ comme
 * des input-text dont on peut régler le temps à la souris
 */
, setHorlogeable(container, options){
    let my = this
      , hrs = container.querySelectorAll('horloge')
    var horloges = {}
    options = options || {}
    // console.log("horloges trouvées : ", hrs)
    for(var i = 0, len=hrs.length; i<len; ++i){
      var h = new DOMHorloge(hrs[i])
      horloges[h.id] = h
      if(options.synchro_video) h.synchroVideo = true
      h.observe()
    }
    return horloges
  }

/**
  Rendre les horloges de durée du container +container+ "durationnable" c'est-
  à-dire qu'on peut en régler la durée.
**/
, setDurationable(container){
    var my = this
    var hrs = container.querySelectorAll('duree')
    var horloges = {}
    // console.log("horloges trouvées : ", hrs)
    for(var i = 0, len=hrs.length; i<len; ++i){
      var h = new DOMDuration(hrs[i])
      horloges[h.id] = h
      h.observe()
    }
    return horloges
  }

, setPictosAide(container){
    $(container).find('img.picto-aide').on(STRclick, this.showHelp.bind(this))
  }
, showHelp(e) {
    let msg = $(e.target).data('message')
    F.notify(msg)
  }
, setVideoPath(ev){
    current_analyse.setVideoPath(ev)
  }

// ---------------------------------------------------------------------
//  RACCOURCIS
// ---------------------------------------------------------------------
// Méthode travaillant avec les boutons de l'UI, mais affectant l'analyse
// courante (seulement si elle existe, donc)
// En fait, ce sont des raccourcis (sauf pour togglePlay, par exemple, qui
// initialise des valeurs)
, togglePlay(){
    this.runIfAnalyse('togglePlay')
  }
, runIfAnalyse(method, arg){
    current_analyse && current_analyse.locator[method].bind(current_analyse.locator)(arg)
  }
, hideCurrentTime(){this.runIfAnalyse('hideCurrentTime')}
, stopAndRewind(){this.runIfAnalyse('stopAndRewind')}
, goToFilmStart(){this.runIfAnalyse('goToFilmStart')}
, goToNextStopPoint(){this.runIfAnalyse('goToNextStopPoint')}

, rewind(pas){this.runIfAnalyse('startRewind', pas)}
, forward(pas){this.runIfAnalyse('startForward', pas)}
, stopRewind(pas){this.runIfAnalyse('stopRewind', pas)}
, stopForward(pas){this.runIfAnalyse('stopForward', pas)}

, goToPrevScene(){this.runIfAnalyse('goToPrevScene')}
, goToNextScene(){this.runIfAnalyse('goToNextScene')}
, stopGoToPrevScene(){this.runIfAnalyse('stopGoToPrevScene')}
, stopGoToNextScene(){this.runIfAnalyse('stopGoToNextScene')}

}



Object.defineProperties(UI,{
  a:{get(){ return current_analyse }}
, oMarkCursor:{get(){return $('#banctime-cursor-mark')}}

  // Note : la plupart des noms des éléments de l'interface
  // sont définis dans system/first_required/ui/ui_builder.js

  /**
  La section qui affiche les procédés qui ont besoin de résolution
  lorsqu'elle n'est pas définie.
  **/
, warningSection:{get(){return $('#section-qrd-pp')}}


})
