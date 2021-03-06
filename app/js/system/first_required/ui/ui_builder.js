'use strict'

const UIBuilder = {

  inited: false

/**
  Grande méthode de préparation de tout l'interface
**/
, init(){
    var my = this
    if (isTrue(this.inited)) return F.error(T('ui-init-only-once'))

    this.a = this.analyse = current_analyse // peut-être undefined

    // On définit tous les noms des éléments de l'interface,
    // colonnes, rangées, sections principales
    this.defineFirstUIComponants()

    // On règle les dimensions en fonction de la taille actuelle
    // de l'éditeur. Elles seront ensuite rectifiées en fonction
    // de l'analyse.
    this.setDimensions()

    // On construit les éléments à l'intérieur de chaque partie
    this.buildSectionVideo()
    this.buildSectionReader()
    this.buildSectionTimeline()

    // On définit les composants suivant (construits)
    this.defineOtherUIComponants()

    // On observe l'interface
    this.observe_ui()

    this.inited = true
  }

, defineFirstUIComponants(){

    // Le container principal de toute la page
    UI.wholeUI = $('body > div#whole-ui')

    // La rangée de vidéo et de reader
    UI.C1R1 = $('div#C1-R1')

    // Section Vidéo
    UI.sectionVideo = $('section#C1-R1-C1-section-video')

    // Section Reader
    UI.sectionReader = $('section#C1-R1-C2-section-reader')

    // Section pour mettre les formulaire
    UI.sectionForms = $('section#C2-R1-forms')

    // Section pour mettre la timeline
    UI.sectionTimeline = $('section#C1-R2-banc-timeline')

    // La barre d'état en bas de la fenêtre
    UI.stateBar = $('#analyse-state-bar')

    // Le div qui contiendra les porte_documents
    UI.sectionWriter = $('#section-porte-documents')

  }
//

/**
  Définition des dimensions des éléments de l'interface
  en fonction de ses dimensions
**/
, setDimensions(){

    UI.updateUIConstants()

    // Les hauteurs
    // Tout, pratiquement, se règle avec les CSS et les flex, il suffit de
    // définir la hauteur de la fenêtre, i.e. du contenant principal.
    // `H` est une constante qui correspond à l'espace réel libre dans la
    // fenêtre, au-dessus de la barre d'état. Il est recalculé à chaque
    // changement de dimension de la fenêtre
    UI.wholeUI.height(H)

  }
//

, buildSectionVideo(){
    require('./ui_builder/video_controller.js').bind(this)()
  }
, buildSectionReader(){
    // Rien à faire pour le moment
  }
, buildSectionTimeline(){
    require('./ui_builder/banc_timeline.js').bind(this)()
  }
//

, defineOtherUIComponants(){

    // La réglette des temps dans le banc timeline (là où l'on
    // clique pour placer le curseur)
    UI.timeRuler = UI.sectionTimeline.find('div#banctime-timeRuler')

    // Bande de la timeline, sous la timeRuler (réglette de temps), qui va
    // contenir la "tape" des events ou les pfa.
    UI.timelineBanc = UI.sectionTimeline.find('section#banctime-banc-timeline')

    // La bande (tape) sur laquelle sont répartis les events.
    // Note : c'est cette bande qui sera remplacée par la bande des pfa pour les
    // voir
    UI.timelineTape = UI.timelineBanc.find('div#banctime-tape')

    // La vidéo proprement dite (attention DOMElement, pas jqSet)
    UI.video = UI.sectionVideo.find('video#section-video-body-video-1')[0]

    // L'horloge principal
    UI.mainHorloge = UI.sectionVideo.find('div#section-video-header horloge#main-horloge')
    UI.videoHorloge = UI.sectionVideo.find('div#bt-video-toolbox span.video-horloge')
    UI.markCurrentScene = UI.sectionVideo.find('div#section-video-header span#mark-current-scene')

    // Pour la boucle d'attente
    UI.msgWaitingLoop = $('span#waiting-loop-message')
    UI.divWaitingLoop = $('div#waiting-loop')

    // La barre d'état (pour le moment, elle est construite en dur)
    UI.stateBar = $('div#analyse-state-bar')

    // La marque des raccourcs courants
    UI.markShortcuts = UI.stateBar.find('#mode-shortcuts')

    // Les marques de début et de fin de film
    UI.markFilmStart  = UI.timeRuler.find('span.mark-film-start')
    UI.markFilmEnd    = UI.timeRuler.find('span.mark-film-end')

    // La section contenant les eventers
    UI.sectionEventers = $('#section-eventers')
  }

/**
  Méthode qui place les observers sur l'interface général
**/
, observe_ui(){
    log.info('-> UIBuilder.observe_ui')
    var my = this

    $('#C1').resizable({
      handles:'e'
    })

    UI.C1R1.resizable({
        handles: 's'
      , stop: (e) => {
          current_analyse.options.memorizeUIsizes()
        }
    })

    UI.sectionForms.resizable({
      handles:'s'
    })
    UI.sectionVideo.resizable({
        handles:'e'
      , stop: (e) => {
          UI.fixeSectionReaderWidth()
          current_analyse.options.memorizeUIsizes()
        }
    })

    // On enclenche la captation de touches pressées
    UI.toggleKeyUpAndDown(/* vers out-text-field = */ true)

    // On observe les mutations du DOM
    UI.observeMutations()

    // Observation de la timeRuler (réglette de temps)
    UI.timeRuler
      // La bande métrée est sensible au clic pour permettre de se
      // déplacer dans le film
      .on(STRclick, BancTimeline.onClicktimeRuler.bind(BancTimeline))
      // Un survol de la timeRuler modifie l'horloge principale
      .on(STRmouseover, BancTimeline.onMouseOverTimeRuler.bind(BancTimeline))

    // On rend draggable les marques de début et de fin de film sur la timeRuler
    UI.timeRuler.find('.mark-film').draggable({
        axis:'x'
      , drag: (e) => {
          current_analyse.locator.setTime(OTime.vVary(BancTimeline.p2t($(e.target).position().left)), {updateOnlyVideo: true})
          return e
        }
      , stop: (e) => {
          let lastOTime = OTime.vVary(BancTimeline.p2t($(e.target).position().left))
          current_analyse.locator.setTime(lastOTime)
          // On règle le temps de fin ou de début
          var isFilmStart = $(e.target).hasClass('mark-film-start')
          current_analyse.runTimeFunction(`Film${isFilmStart?'Start':'End'}Time`, lastOTime.vtime)
        }
    })

    // Extras
    // ------
    // Tous les champs input-text, on selectionne tout quand on focusse
    // dedans
    $('input[type="text"]').on(STRfocus, function(){$(this).select()})

    my = null
    log.info('<- UIBuilder.observe_ui')
  }

}// /UIBuilder

module.exports = UIBuilder
