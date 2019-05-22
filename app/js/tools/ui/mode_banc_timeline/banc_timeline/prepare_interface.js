'use strict'

// Méthode `BancTimeline::prepareInterface`
module.exports = function(){


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



}
