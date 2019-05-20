'use strict'

// Méthode `BanTimeline::prepareInterface`
module.exports = function(){
  // On doit supprimer la pied de page
  $('#section-footer').hide()

  // $('#section-videos').hide() // en attendant
  // $('#section-reader').hide() // en attendant
  $('#analyse-state-bar').hide() // en attendant

  // Si c'est la première fois, il faut charger la feuille de style
  isEmpty($('#ban-timeline-stylesheet')) && (
    System.loadCSSFile('./css/mode_ban_timeline.css', 'ban-timeline-stylesheet')
  )

  // Retirer la taille imprimée à la vidéo
  $('#section-videos .section-video').attr('style', null)

  // Retirer le placement imprimé au reader
  $('#reader').attr('style', null)

  // Retirer le draggable du reader
  current_analyse.reader.fwindow.jqObj.draggable('option','disabled','true')


  // Le ban timeline lui-même
  document.body.append(DCreate(SECTION,{id:'bantime-ban-timeline', append:[
      DCreate(DIV,{id:'bantime-scaletape'})   // bande pour positionner le curseur
    , DCreate(DIV,{id:'bantime-tape'})        // bande pour déposer les éléments
    , DCreate(DIV,{id:'bantime-cursor'}) // curseur de timeline
    ]}))

  // Il faut régler les hauteurs aux hauteurs par rapport à l'écran
  let timelineRowHeight = 260
    , topRowHeight = ScreenHeight - timelineRowHeight - 80
    , timelineTapeHeight = timelineRowHeight - this.scaleTape.height()

  $(STRbody).css('grid-template-rows', `${topRowHeight}px ${timelineRowHeight}px`)

  // Hauteur de la tape de timeline (là où sont déposés les events)
  this.timelineTape.css('height', `${timelineTapeHeight}px`)

  // Hauteur du curseur de timeline
  this.cursor.css('height', `${timelineRowHeight - 10}px`)

}
