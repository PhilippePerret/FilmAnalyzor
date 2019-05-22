'use strict'

// Méthode `BancTimeline::prepareInterface`
module.exports = function(){

  // Le banc timeline lui-même
  document.body.append(DCreate(SECTION,{id:'banctime-ban-timeline', append:[
      DCreate(DIV,{id:'banctime-scaletape'})   // bande pour positionner le curseur
    , DCreate(DIV,{id:'banctime-tape'})        // bande pour déposer les éléments
    , DCreate(DIV,{id:'banctime-cursor'}) // curseur de timeline
    ]}))

  // Éléments à ajouter à la section `section-videos`
  $('#section-videos').append(DCreate(DIV,{id:'bt-video-toolbox', append:[
    DCreate(SPAN,{id:'mode-shortcuts-span', append:[
      DCreate(LABEL,{inner:'Mode raccourcis'})
    , DCreate(SPAN,{id:'banctime-mode-shortcuts',inner:'INTERFACE'})
    ]})
  ]}))

  // Il faut régler les hauteurs aux hauteurs par rapport à l'écran
  let timelineRowHeight = 260
    , topRowHeight = ScreenHeight - timelineRowHeight - 80
    , timelineTapeHeight = timelineRowHeight - this.scaleTape.height()

  // $(STRbody).css('grid-template-rows', `${topRowHeight}px ${timelineRowHeight}px`)

  // Hauteur de la tape de timeline (là où sont déposés les events)
  this.timelineTape.css('height', `${timelineTapeHeight}px`)

  // Hauteur du curseur de timeline
  this.cursor.css('height', `${timelineRowHeight - 10}px`)

  // Lui donner la même taille que son container
  let readerHeight = topRowHeight - 8
  $('#reader').css({'height':readerHeight, 'min-height':readerHeight, 'max-height':readerHeight})


  $('#ui-top-row').resizable({
    alsoResize: '#section-videos'
  })


}
