'use strict'

const UIBuilder = {

  inited: false
// Grande méthode de préparation de tout l'interface
, init(){
    var my = this
    if (isTrue(this.inited)) return F.error(T('ui-init-only-once'))

    this.a = this.analyse = current_analyse

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

    // On observe l'interface
    this.observe_ui()


    this.inited = true
  }

/**
  Définition des dimensions des éléments de l'interface
  en fonction de ses dimensions
**/
, setDimensions(){
    // const H = ScreenHeight

    // Les hauteurs
    UI.mainContainer.css(STRheight, `${H}px`)
    UI.leftColumn.css(STRheight, `${H}px`)
    UI.rightColumn.css(STRheight, `${H}px`)
    UI.topRow.css(STRheight, this.pct2px(H,60))
    UI.sectionVideo.css(STRheight, this.pct2px(H,60))
    UI.sectionReader.css(STRheight, this.pct2px(H,60))

    UI.leftColumn.css(STRwidth, this.pct2px(W, 2))
    UI.sectionVideo.css(STRwidth, this.pct2px(W, 60))
    UI.sectionReader.css(STRwidth, this.pct2px(W, 35))
    UI.rightColumn.css(STRwidth, this.pct2px(W, 2))

    // Pas la peine de régler la hauteur de la bande du bas puisqu'elle
    // se "flexe"
    // UI.bottomRow.css('height', `${Math.round(H * 40/100)}px`)

  }

, pct2px(WorH, pct){
    return `${(Math.round(WorH * pct / 100))}px`
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
    $('#C2-R1-forms').resizable({
      handles:'s'
    })
    $('section#C1-R1-C1-section-video').resizable({
      handles:'e'
    })


    // On doit pouvoir redimensionner la rangée du
    // haut
    UI.topRow.resizable({
        alsoResize: '#section-videos, #section-reader, #section-eventers'
      , resizeWidth: false
      , autoHide: true
      , handles: 's'
      // , classes: {'ui-resizable-s':'ui-icon ui-icon-triangle-2-n-s'}
    })

    // On doit pouvoir resizer la section vidéo et la section des autres
    // éléments
    UI.sectionVideo.resizable({
        handles: 'e'
      , classes: {'ui-resizable-ghost':'ui-icon-arrowthick-2-e-w'}
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
    UI.mainContainer  = $('body > div#main-container')
    UI.topRow         = $('div#ui-top-row')
    UI.bottomRow      = $('div#ui-bottom-row')
    UI.leftColumn     = $('div#ui-left-column')
    UI.rightColumn    = $('div#ui-right-column')

    // Vidéo
    UI.sectionVideo   = $('section#section-videos')

    // Reader
    UI.sectionReader  = $('section#section-reader')

    // Pour la boucle d'attente
    UI.msgWaitingLoop = $('span#waiting-loop-message')
    UI.divWaitingLoop = $('div#waiting-loop')
  }
}// /UIBuilder

module.exports = UIBuilder
