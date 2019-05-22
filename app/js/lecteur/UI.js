'use strict'
/**
 * Gestion de l'interface
 */
const UI = {
  class: 'UI'

/**
  Méthode appelée au chargement de l'analyse, pour régler le mode d'affichage
  de l'analyse. Pour le moment, programmé pour le mode ban timeline
**/
, setModeAffichage(){
    this.ModeBancTimeline = true === current_analyse.options.get('option_banc_timeline')
    this.ModeBancTimeline && this.toggleModeBancTimeline()
  }

/**
  Basculer dans le mode "Ban Timeline" qui présente l'interface comme un
  ban de montage, de façon fixe.
**/
, toggleModeBancTimeline(){
    if(NONE === typeof(BancTimeline)){
      window.BancTimeline = App.loadTool('ui/mode_banc_timeline')
    }
    BancTimeline.toggle.bind(BancTimeline)()
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
  // Note : la plupart des noms des éléments de l'interface
  // sont définis dans system/first_required/ui/ui_builder.js
  
  /**
  La section qui affiche les procédés qui ont besoin de résolution
  lorsqu'elle n'est pas définie.
  **/
  warningSection:{get(){return $('#section-qrd-pp')}}
})
