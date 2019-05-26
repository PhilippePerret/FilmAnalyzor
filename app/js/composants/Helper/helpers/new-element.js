'use strict'

module.exports = {
  onKeyUp:(e) => {
    let type = this.shortcut2type[e.key]
    switch (type) {
      case undefined:
        return stopEvent(e)
      case 'document':
        FADocument.edit(/* pas d'id => nouveau ?*/)
        break
      case 'brin':
        FABrin.edit(/* pas d'id => nouveau */)
        break
      case 'personnage':
        FAPersonnage.edit(/* pas d'id => nouveau */)
        break
      default:
        EventForm.onClickNewEvent.bind(EventForm)(e, type)
    }
    this.close() // on referme la fenêtre après avoir choisi
    return stopEvent(e)
  }
, title: 'Créer un nouveau…'
, body: () => {
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
