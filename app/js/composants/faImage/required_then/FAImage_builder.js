'use strict'


Object.assign(FAImage.prototype,{

  showDiffere(){
    var my = this
    this.div //pour le construire
    var diff = ((my.otime - this.a.locator.currentTime) * 1000) - 300
    if ( diff < 0 ){ // ne devrait jamais arriver
      this.show()
    } else {
      this.timerShow = setTimeout(my.show.bind(my), diff)
    }
  }
, show(){
    let my = this
    // console.log("-> show", this.id)
    if(isTrue(my.shown)) return
    if(isNotEmpty(my.jqReaderObj)){
      // <= l'objet DOM existe déjà
      // => On a juste à l'afficher
      my.jqReaderObj.show()
    } else {
      // <= L'objet DOM n'existe pas encore
      // => Il faut le construire en appelant this.div
      my.a.reader.append(this)
      my.observe()
    }

    // Déplacé dans makeAppear
    // my.domReaderObj.parentNode.scrollTop = this.domReaderObj.offsetTop
    my.shown = true
  }

, observe(){
    let my = this
    if(isNotEmpty(my.jqReaderObj)){
      my.jqReaderObj.draggable(Object.assign({},DATA_ASSOCIATES_DRAGGABLE,{helper:'clone'}))
      my.jqReaderObj.hide()
    } else {
      log.warn(`L'objet Reader de l'image ${this} est introuvable. Impossible de l'observer.`)
    }
  }
}) // /assign

Object.defineProperties(FAImage.prototype,{
  // Le Div pour le reader
  div:{get(){
    var attrs = {}
    attrs[STRdata_type] = STRimage
    attrs[STRdata_id]   = this.id
    return DCreate(DIV,{id: this.domReaderId, class:'div-image image', attrs:attrs
      , append:[
          DCreate(IMG,{src:this.path, class:'image-overview',attrs:{onclick:`FAImage.edit('${this.id}')`}})
        , DCreate(SPAN,{inner:this.f_legend, class:`small ${this.domC('legend')}`})
        ]})
  }}
, domId:{get(){return this._domId||defP(this,'_domId', `image-${this.affixe}`)}}
// , domReaderObj:{get(){return this.jqReaderObj[0]}}
})
