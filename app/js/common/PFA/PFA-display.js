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
    isTrue(this.built) || this.build().observe()
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

    return this // pour le chainage
  }


, observe(){
    var jqo = this.jqObj
    // Dans le paradigme, on observe tous les events relatifs
    // pour pouvoir 1) les dragguer pour les placer dans d'autres
    // éléments et 2) les éditer en les cliquant.
    jqo.find('.event, .pfa-relative > .part')
      .draggable({
        containment:STRdocument
      , helper: function(e){
          if ( isUndefined(this._draghelper) ){
            let target = $(e.target)
              , ev = FAEvent.get(parseInt(target.data(STRid),10))
            this._draghelper = DHelper(ev.toString(), {type: STRevent, id: target.data(STRid)})
            // console.log("helper:", this._draghelper)
          }
          return this._draghelper
        }
      , revert: false
      , stop: function(e){
          this._draghelper.remove()
        }
      })
      .on(STRclick, function(e){
        var event_id = parseInt($(this).data(STRid),10)
        FAEvent.edit.bind(FAEvent, event_id)()
        stopEvent(e)
      })
}


}// /PFA_display

module.exports = PFA_display
