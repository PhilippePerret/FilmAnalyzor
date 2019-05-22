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

    // Dorénavant, le mode d'affichage de l'écran est toujours
    // le mode "banc de montage". On pourra supprimer définitivement
    // cette propriété lorsqu'elle aura disparu partout.
    this.ModeBancTimeline = true

    // On définit tous les noms des éléments de l'interface,
    // colonnes, rangées, sections principales
    this.defineUIComponants()

    // On règle les dimensions en fonction de la taille actuelle
    // de l'éditeur.
    this.setDimensions()

    // On construit les éléments à l'intérieur de chaque partie
    this.buildSectionVideo()
    this.buildSectionReader()
    this.buildSectionTimeline()

    // On observe l'interface
    this.observe_ui()


    this.inited = true
  }

/**
  Définition des dimensions des éléments de l'interface
  en fonction de ses dimensions
**/
, setDimensions(){

    // Les hauteurs
    // Tout, pratiquement, se règle avec les CSS et les flex, il suffit de
    // définir la hauteur de la fenêtre, i.e. du contenant principal.
    // `H` est une constante qui correspond à ScreenHeight
    UI.wholeUI.css(STRheight, `${H}px`)

  }


, buildSectionVideo(){
    require('./ui_builder/video_controller.js').bind(this)()
    // La vidéo elle-même
    // TODO
    // L'horloge du temps réel
    // TODO
    // L'horloge du temps vidéo
    // TODO
    // Le span de scène courante si elle existe
    // TODO
    // On redéfinit les tailles "humaines" (large, medium, vignette)
    VideoController.redefineVideoSizes()
  }
, buildSectionReader(){
    // Rien à faire pour le moment
  }
, buildSectionTimeline(){
    // Le banc timeline lui-même
    UI.sectionTimeline.append(DCreate(SECTION,{id:'banctime-ban-timeline', append:[
        DCreate(DIV,{id:'banctime-scaletape'})   // bande pour positionner le curseur
      , DCreate(DIV,{id:'banctime-tape'})        // bande pour déposer les éléments
      , DCreate(DIV,{id:'banctime-cursor'}) // curseur de timeline
      ]}))

  }


/**
  Méthode qui place les observers sur l'interface général
**/
, observe_ui(){
    var my = this

    $('#C1').resizable({
      handles:'e'
    })
    $('#C1-R1').resizable({
      handles:'s'
    })
    UI.sectionForms.resizable({
      handles:'s'
    })
    UI.sectionVideo.resizable({
      handles:'e'
    })

    // On doit pouvoir resizer la section vidéo et la section des autres
    // éléments
    UI.sectionVideo.resizable({
        handles: 'e'
    })

    // Extras
    // ------
    // Tous les champs input-text, on selectionne tout quand on focusse
    // dedans
    $('input[type="text"]').on(STRfocus, function(){$(this).select()})

    my = null
  }


, defineUIComponants(){

    // Le container principal de toute la page
    UI.wholeUI  = $('body > div#whole-ui')

    // Section Vidéo
    UI.sectionVideo   = $('section#C1-R1-C1-section-video')

    // Section Reader
    UI.sectionReader  = $('section#C1-R1-C2-section-reader')

    // Section pour mettre les formulaire
    UI.sectionForms = $('section#C2-R1-forms')

    // Section pour mettre la timeline
    UI.sectionTimeline = $('section#C1-R2-banc-timeline')

    // Pour la boucle d'attente
    UI.msgWaitingLoop = $('span#waiting-loop-message')
    UI.divWaitingLoop = $('div#waiting-loop')
  }
}// /UIBuilder

module.exports = UIBuilder
