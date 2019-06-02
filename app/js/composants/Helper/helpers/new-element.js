'use strict'

module.exports = {
  init: function(){
    log.info('n:New element')
  }
, onKeyUp: function(e){// NE PAS UTILISER () => {...} (scope)
    let type = this.shortcut2type[e.key]
    switch (type) {
      case undefined:
        return stopEvent(e)
      case STRdocument:
        FADocument.edit(/* pas d'id => nouveau ?*/)
        break
      case STRbrin:
        FABrin.edit(/* pas d'id => nouveau */)
        break
      case STRpersonnage:
        FAPersonnage.edit(/* pas d'id => nouveau */)
        break
      default:
        EventForm.onClickNewEvent.bind(EventForm)(e, type)
    }
    this.close() // on referme la fenêtre après avoir choisi
    return stopEvent(e)
  }
, title: 'Créer un nouveau…'
, body: function(){
    var divs = [], dev
    this.shortcut2type = {}
    for(var eid in EVENTS_TYPES_DATA){
      dev = EVENTS_TYPES_DATA[eid]
      divs.push(DCreate(DIV, {append:[
          DCreate(LABEL, {inner: dev.shortcut})
        , DCreate(SPAN,  {inner: dev.hname})
      ]}))
      this.shortcut2type[dev.shortcut] = dev.type
    }
    divs.push(DCreate(DIV, {class:'separator'}))
    let autres = [
        {hname: 'Personnage', shortcut: 'c'}
      , {hname: 'Brin', shortcut: 'b'}
      , {hname: 'Document', shortcut: 'm'}
    ]
    autres.map( dautre => {
      divs.push(
        DCreate(DIV, {append:[
            DCreate(LABEL, {inner: dautre.shortcut})
          , DCreate(SPAN,  {inner: dautre.hname})
        ]})
      )
      this.shortcut2type[dautre.shortcut] = dautre.hname.toLowerCase()
    })
    return divs
  }
}
