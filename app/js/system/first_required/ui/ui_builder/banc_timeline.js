'use strict'

const BancTimelineBuilder = {
  /**
    Méthode principale de construction
  **/
  build(){
    // Le banc timeline lui-même
    UI.sectionTimeline.append(DCreate(SECTION,{id:'banctime-banc-timeline', append:[
        // bande pour déposer les éléments
        DCreate(DIV,{id:'banctime-tape',append:[
          // bande pour positionner le curseur et les marqueurs
          DCreate(DIV,{id:'banctime-timeRuler', append:[
              // On place les marques amovibles de début et de fin de film
              DCreate(SPAN,{class:'mark-film mark-film-start'})
            , DCreate(SPAN,{class:'mark-film mark-film-end'})
          ]})
         // curseur de timeline
        , DCreate(DIV,{id:'banctime-cursor',append:[
            // Pour écrire quelque chose à côté du cursor
            DCreate(SPAN,{id:'banctime-cursor-mark'})
          ]})
        ]})
      ]}))
  }

}// /BancTimelineBuilder

module.exports = function(){
  let my = this
  BancTimelineBuilder.build()
  UI.markCursor() // pour cacher le texte à côté du curseur
}
