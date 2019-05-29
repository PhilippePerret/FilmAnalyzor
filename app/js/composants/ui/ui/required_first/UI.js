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
            $(node).find(TEXT_TAGNAMES)
              .on(STRfocus, UI.onFocusTextField.bind(UI))
              .on(STRblur,  UI.onBlurTextField.bind(UI))
              .data('owner-id', node.id)
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
    domObserver.observe(DGet('section-writer'), domObserverConfig)
    domObserver.observe(DGet('section-eventers'), domObserverConfig)

  }
/**
  Les deux méthodes `onFocusTextField` et `onBlurTextField` sont
  appelées par les méthodes implémentées
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
  Retourne la vraie hauteur de l'élément, border et padding compris
**/
, realHeight(o){
    return $(o).outerHeight()
  }
, realWidth(o){
    return $(o).outerWidth()
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
      window.onkeyup    = this.onKey_UP_OUT_TextField.bind(this)
      window.onkeydown  = this.onKey_DOWN_OUT_TextField.bind(this)
    } else {
      window.onkeyup    = this.onKey_UP_IN_TextField.bind(this)
      window.onkeydown  = this.onKey_DOWN_IN_TextField.bind(this)
    }
    // La marque du type de shortcut
    this.markShortcuts.html(versOut?'INTERFACE':'TEXT FIELD')
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
, showVideoController(){
    VideoController.current.navButtons.show()
  }


/**
  Méthode qui règle les inputs champs texte pour définir si les
  textes doivent être édités dans le mini-writer ou dans leur
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
, goToTime(){this.runIfAnalyse('goToTime')}
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

  // Note : la plupart des noms des éléments de l'interface
  // sont définis dans system/first_required/ui/ui_builder.js

  /**
  La section qui affiche les procédés qui ont besoin de résolution
  lorsqu'elle n'est pas définie.
  **/
, warningSection:{get(){return $('#section-qrd-pp')}}


})
