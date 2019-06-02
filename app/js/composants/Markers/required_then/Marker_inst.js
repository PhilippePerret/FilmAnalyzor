'use strict'

Object.defineProperties(Marker.prototype,{
  // Retourne le Div pour insertion dans le reader
  divReader:{get(){
    return DCreate(DIV,{
        id:this.domReaderId
      , class:'marker'
      , inner: `Marqueur « ${this.title} » - ${this.otime.rhorloge_simple}`
      , attrs:{'data-type':STRmarker, 'data-id':this.id, 'data-time':this.time}
    })
  }}
, jqReaderObj:{get(){
    return UI.sectionReader.find(`#${this.domReaderId}`)
  }}
, domReaderId:{get(){
    isDefined(this._domreaderid) || (
      this._domreaderid = `reader-marker-${this.id}`
    )
    return this._domreaderid
  }}
})
