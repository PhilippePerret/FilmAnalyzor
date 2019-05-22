'use strict'
/**
 * Gestion de l'interface
 */
const UI = {
  class: 'UI'

/**
  Méthode qui fait basculer la captation des touches du mode "out" champs de
  texte au mode "in" (dans un champ de texte)
**/
, toggleKeyUpAndDown(versOut){
    log.info("-> UI.toggleKeyUpAndDown")
    window.onkeyup    = this[`onKeyUp${versOut?'Out':'In'}TextField`].bind(this)
    window.onkeydown  = this[`onKeyDown${versOut?'Out':'In'}TextField`].bind(this)
    this.markShortcuts.html(versOut?'INTERFACE':'CHAMP SAISIE')
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
    var my = this
    if(undefined === options) options = {}
    var hrs = container.querySelectorAll('horloge')
    var horloges = {}
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
