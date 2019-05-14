'use strict'


Object.assign(FAImage.prototype,{
  as(format,flat,opts){
    var divs = []
    switch (format) {
      case 'associate':
        divs.push(DCreate('DIV',{inner:this.toString()}))
        break
      default:
    }

    // On finalise
    divs = DCreate('DIV',{class:'image', append:divs, attrs:{'data-type':'image', 'data-id':this.id}})

    if(opts.as == 'dom') return divs
    else return divs.outerHTML
  }

, showDiffere(){
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
    if(my.shown === true) return
    if(my.jqReaderObj && this.jqReaderObj.length){
      // <= l'objet DOM existe déjà
      // => On a juste à l'afficher
      my.jqReaderObj.show()
    } else {
      // <= L'objet DOM n'existe pas encore
      // => Il faut le construire en appelant this.div
      my.a.reader.append(this)
      my.observe()
    }
    my.makeAppear() // c'est l'opacité qui masque l'event affiché

    // Déplacé dans makeAppear
    // my.domReaderObj.parentNode.scrollTop = this.domReaderObj.offsetTop
    my.shown = true
  }

, makeAppear(){
    this.jqReaderObj.animate({opacity:1}, 600)
    // Trop mou ou trop rapide avec scrollIntoView. Rien de vaut la méthode
    // old-school
    if(this.domReaderObj){
      this.domReaderObj.parentNode.scrollTop = this.domReaderObj.offsetTop
    } else {
      log.warn("Bizarrement, le domReaderObj de l'image suivante est introuvable : ", this.id, `div#${this.domId}`)
    }
  }
, observe(){
    let my = this
    my.jqReaderObj.draggable(Object.assign({},DATA_ASSOCIATES_DRAGGABLE,{helper:'clone'}))
  }
}) // /assign

Object.defineProperties(FAImage.prototype,{
  // Le Div pour le reader
  div:{get(){

    return DCreate(DIV,{id: this.domId, class:'div-image image', attrs:{'data-type':'image', 'data-id':this.fname}
      , append:[
          DCreate(IMG,{src:this.path, class:'image-overview',attrs:{onclick:`FAImage.edit('${this.id}')`}})
        , DCreate(SPAN,{inner:this.f_legend, class:`small ${this.domC('legend')}`})
        ]})
  }}
, domId:{get(){return this._domId||defP(this,'_domId', `image-${this.affixe}`)}}
, jqObj:{get(){return this.jqReaderObj}}
, domReaderObj:{get(){return this.jqReaderObj[0]}}
})
