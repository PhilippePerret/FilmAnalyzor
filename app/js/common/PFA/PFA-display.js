'use strict'
/**
  Extension (mixins) pour l'affichage des PFA

  Ce module fonctionne de paire avec le module PFA-building qui se concentre
  sur la construction du paradigme.

**/

const PFABuilder = tryRequire('PFA-builder',__dirname)


const PFA_display = {
  toggle(){ this.shown ? this.hide() : this.show() }
, show(){
    isTrue(this.built) || this.build()
    UI.timelineTape.hide()
    this.jqObj.show()
    this.shown = true
  }
, hide(){
    this.jqObj.hide()
    UI.timelineTape.show()
    this.shown = false
  }
, update(){
    if (isFalse(this.shown)) return
    F.notify("Il faut implémenter l'actualisation du PFA (dans PFA-display.js)")
    // Cela doit consister en la refonte du paradigme relatif
  }

// ---------------------------------------------------------------------
//  MÉTHODES DE CONSTRUCTION ET DE SURVEILLANCE
, build(){

    let builder = new PFABuilder(this)

    this.calcDimsFor(UI.sectionTimeline.innerWidth() - 12)

    UI.timelineBanc.append(DCreate(DIV,{
        id: this.domId
      , class: 'pfas'
      , append:[
            builder.styles
          , builder.absolutePFA
          , builder.relativePFA
        ]
    }))

    this.built = true
  }


, observe(){
    // On colle un FATimeline
    var ca  = this.a
    var jqo = this.jqObj
    var tml = new FATimeline(jqo[0])
    tml.init({height: 40, cursorHeight:262, cursorTop: -222, only_slider_sensible: true})
    // Dans le paradigme, on observe tous les events relatifs
    // pour pouvoir 1) les dragguer pour les placer dans d'autres
    // éléments et 2) les éditer en les cliquant.
    jqo.find('.event')
      .draggable({
        containment:STRdocument
      , helper: 'clone'
      , revert: true
      })
      .on(STRclick, function(e){
        var event_id = parseInt($(this).attr(STRdata_id),10)
        FAEvent.edit.bind(ca, event_id)()
        stopEvent(e)//sinon le pfa est remis au premier plan
      })
}


}// /PFA_display

module.exports = PFA_display
