'use strict'

const BancTimeline = {
  SCENE_ROW: 7 // 0-start
, reset(){
    log.info("-> BancTimeline::reset")
    // Suppression de tous les markers
    UI.timeRuler.find('span.marker').remove()
    // Suppression de tous les éléments sur le banc proprement dit
    this.timelineTape.find('div.banctime-element').remove()

    // Initialisation des propriétés
    delete this._currenttime
    delete this._zoom
    delete this._width
    delete this._coefp2t
    delete this._coeft2p

    // Initialisation de la liste des items
    BancTimeline.items = []

    // Initialisation de la map
    BancTimeline.map = new Map()

    log.info("<- BancTimeline::reset")
  }

, init(){
    log.info("-> BancTimeline::init")
    let my = this

    // On transforme toutes les instances Event en élément
    // BancTimeline
    this.instancyEvents()

    // On définit la map du banc-timeline, qui permettra de
    // savoir où sont placés les éléments
    this.defineMap()

    // On dispatche tous les events sur la timeline
    this.dispatchElementOnTape()

    log.info("<- BancTimeline::init")
  }

, positionneMarkFilmStartEnd(){
    log.info('-> BancTimeline::positionneMarkFilmStartEnd()')
    log.info(`      Left start:${this.t2p(this.a.filmStartTime)}`)
    log.info(`      Left end:${this.t2p(this.a.filmEndTime)}`)
    UI.markFilmStart.css(STRleft,`${this.t2p(this.a.filmStartTime)-8}px`)
    UI.markFilmEnd.css(STRleft,`${this.t2p(this.a.filmEndTime)}px`)
    log.info('<- BancTimeline::positionneMarkFilmStartEnd()')
  }

/**
  Quand on passe la souris sur la réglette de temps, on déclenche
  un setTimeout qui doit déclencher l'observer de déplacement de la
  souris sur cette réglette (rapide).

  Note : ce setTimeout sert à ne pas déclencher les choses si on ne
  fait que passer sur la réglette rapidement
**/
, onMouseOverTimeRuler(e){
    // console.log("-> onMouseOverTimeRuler")
    this.timerOnTimeRuler = setTimeout(this.observeTimeRuler.bind(this), 750)
    return stopEvent(e)
  }

/**
  Quand la souris passe sur la réglette de temps (timeRuler) on déclenche les
  observers de déplacement de souris et de sortie du champ.
**/
, observeTimeRuler(){
    this.timeOnMouseOver = this.a.locator.currentTime
    UI.timeRuler
      .on(STRmousemove, this.onMouseMoveTimeRuler.bind(this))
      .on(STRmouseout,  this.onMouseOutTimeRuler.bind(this) )
  }

// Quand la souris quitte la réglette de temps, on doit arrêter et
// détruire le timer qui n'a peut-être pas été mis en route
, onMouseOutTimeRuler(e){
    if (isDefined(this.timerOnTimeRuler) ) {
      clearTimeout(this.timerOnTimeRuler)
      delete this.timerOnTimeRuler
    }
    // Il faut remettre l'horloge et la vidéo dans le temps
    // initial, qui a pu être changé si on a cliqué sur la timeRuler
    if ( this.timeOnMouseOver && this.timeOnMouseOver != this.currentTime ) {
      this.a.locator.setTime(this.timeOnMouseOver)
    }
    delete this.timeOnMouseOver
    UI.timeRuler
      .off(STRmousemove)
      .off(STRmouseout)
    return stopEvent(e)
  }

, onMouseMoveTimeRuler(e) {
    var vtime = this.p2t(e.clientX)
    isDefined(this._mouseotime) || ( this._mouseotime = new OTime(0) )
    this._mouseotime.updateSeconds(vtime)
    UI.mainHorloge.html(this._mouseotime.horloge)
    UI.video.currentTime = vtime
    return stopEvent(e)
  }

// ---------------------------------------------------------------------
//  MÉTHODES GÉNÉRALES DE PRÉPARATION

/**
  Méthode qui instancie chaque event de banctimeline pour en faire un élément propre
**/
, instancyEvents(){
    log.info("-> BanTimeline::instancyEvents")
    let my = this
    this.a.forEachEvent(e => {
      if ( e.isASttNode ) return
      var bte = new BancTimelineElement(e)
      my.items.push(bte)
    })
    log.info("<- BanTimeline::instancyEvents")
  }
/**
  Méthode qui place les éléments courants sur la "tape" de la timeline
**/
, dispatchElementOnTape(){
    // try {
    //   pourvoirlebacktrace
    // } catch (e) {
    //   console.error(e)
    // }
    log.info("-> BancTimeline::dispatchElementOnTape()")
    this.items.map( bte => bte.place() )
    log.info("<- BancTimeline::dispatchElementOnTape()")
  }

/**
  À la création d'un event, on le place sur le banc timeline
**/
, append(ev) {
    var bte = new BancTimelineElement(ev)
    this.items.push(bte)
    this.searchRowForItem(bte)
    bte.place()
  }

/**
  Destruction d'un event
    -  sur la timeline (HTML Element)
    - dans la liste this.items
    - dans la map this.map
**/
, remove(ev){
    let bte
    var i = 0
      , len = this.items.length
    for(; i<len; ++i) {
      var item = this.items[i]
      if ( item.event.id === ev.id ){
        bte = item
        this.items.splice(i,1)
        break
      }
    }

    // On doit forcément trouver l'élément
    bte || raise(`L'élément timeline correspondant à l'event #${ev.id} est introuvable…`)

    bte.remove()

    // On le retire de la map pour laisser l'espace vide
    var ispace = 0
      , len = this.map[bte.row].length
    for(; ispace<len; ++ispace){
      var space = this.map[bte.row][ispace]
      if ( space.id === ev.id ) {
        this.map[bte.row].splice(ispace,1)
        break
      }
    }
  }
// ---------------------------------------------------------------------
//  MÉTHODES D'EVENTS

/**
  Méthode appelée quand on clique sur la tape d'échelle/temps
**/
, onClicktimeRuler(e){
    this.setCurrentPosition(e.offsetX)
    return stopEvent(e)
  }

, setCurrentPosition(left){
    this.currentTime = this.p2t(left)
    this.a.locator.setTime(this.currentTime)
  }
/**
  @param {OTime} t   Time où mettre le cursor
**/
, setCursorByTime(t){
    this.currentTime = t
    this.cursor.css(STRleft,`${(this.t2p(t.vtime))}px`)
  }

// ---------------------------------------------------------------------
//  LA MAP DE LA TIMELINE

/**

  Définition de la "map" du banc timeline. L'idée est de faire une carte
  qui contienne les positions des éléments sur le banc, pour un placement
  plus efficace des éléments. Au lieu de parcourir tous les éléments dans le
  DOM, on parcourera une Map.

  En même temps qu'on définit cette map, au début, on place les items
  à leur place, rangée par rangée.

**/
, defineMap(){
    // Pour connaitre les rangées occupées à un moment de la boucle sur tous
    // les éléments, on tient à jour cette map `map` où les clés
    // sont les indices de rangée (de 1 à SCENE_ROW) et la valeur est une liste
    // contenant tout les espaces occupés.
    // Un espace occupé s'exprime par {:start, :end}
    this.map = []

    // On peut boucler sur chaque items ({BancTimelineElement}), chaque élément
    // de la timeline, correspondant en général à des events
    for (var item of this.items) {
      this.searchRowForItem(item)
    } // fin de boucle sur tous les éléments à placer (items)

  } // /defineMap

/**
  Méthode qui retourne la rangée sur laquelle doit être placé l'item
  +item+ en l'ajoutant à la map (cf. ci-dessus)
**/
, searchRowForItem(item){
    // Si c'est une scène, la rangée SCENE_ROW est réservée à son
    // placement.
    // Normalement, une scène ne peut pas être superposée à une autre
    // scène, donc on a aucune vérification à faire ici. On peut juste
    // passer l'élément
    if ( item.event.isScene ) {
      item.row = this.SCENE_ROW
      return
    }

    for ( var irow = 0; irow < this.SCENE_ROW ; ++ irow ) {
      // Création de la rangée. On ajoute un espace au tout début pour
      // simplifier le code
      if ( isUndefined(this.map[irow]) ) {
        this.map[irow] = [{start:-1, end:-1}]
      }
      // On prend cette rangée
      var drow = this.map[irow]
      for ( var space of drow ) {
        if ( space.start > item.event.endAt || space.end < item.event.startAt ) {
          // L'espace libre a été trouvé
          drow.push({start: item.event.startAt, end:item.event.endAt, id:item.event.id})
          item.row = irow
          break
        }
      }
      // Si la rangée de l'item est définie, on peut passer à la suite
      // Noter, donc, que toutes les rangées en seront pas forcément
      // définies
      if ( isDefined(item.row) ) break
    } // fin de boucle sur toutes les rangées

    // Quand on n'a pas trouvé de ligne pour l'item, on le met
    // sous la ligne des scènes
    if ( isUndefined(item.row) ) {
      log.error(T('no-row-for-item',{item:item}))
      item.row = this.SCENE_ROW + 1
    }
    // console.log("BancTimeline.map =", this.map)
  }

// ---------------------------------------------------------------------
//  MÉTHODES DE CALCUL

/**
  Méthode qui reçoit un nombre de pixels +x+ correspondant à une coordonnée
  dans le ban de timeline et retourne le temps correspondant en fonction du
  zoom appliqué.
**/
, p2t(x){
    return (x * this.coefP2T()).round(2)
  }

/**
  Inversement, reçoit un temps et retourne un nombre de pixels

  Permet de placer les éléments sur la timeline en fonction de leur temps.
**/
, t2p(t){
    // console.log({
    //   operation: 't2p'
    // , 'temps donné': t
    // , 'coefficiant T2P': this.coefT2P()
    // , return: Math.round(t * this.coefT2P())
    // })
    return Math.round(t * this.coefT2P())
  }
// ---------------------------------------------------------------------
//  MÉTHODES DE CALCUL

, coefP2T(){
    return this._coefp2t || defP(this,'_coefp2t', this.calcCoefP2T())
  }
, coefT2P(){ return this._coeft2p || defP(this,'_coeft2p', this.calcCoefT2P())}

// ---------------------------------------------------------------------
// Méthodes de calculs

, calcCoefP2T(){
    let duree = UI.video.duration
      , coef  = ( duree / this.width ) / this.zoom
    return coef
  }

, calcCoefT2P(){
    log.info('-> BancTimeline::calcCoefT2P')
    let duree = UI.video.duration
    try {
      this.width    || raise('la largeur du banc est nulle.')
      this.a.duree  || raise('La durée du film est nulle.')
      this.zoom     || raise('Le zoom du banc est nul.')
      // Le calcul
      this._coeft2p = (this.width / duree) * this.zoom
    } catch (e) {
      raise(`Impossible de calculer le coefficiant BancTimeline time2pixels : ${e}`)
    }
    // console.log({
    //   operation:'Calcul coef T2P (temps -> pixels)'
    // , width: this.width
    // , zoom: this.zoom
    // , duree: duree
    // , coefficiant: this._coeft2p
    // })
    return this._coeft2p
  }

, UI: {
  zoom(deca){ // UI.zoom
    this.setBTZoom(0.2 * (deca||1))
    BancTimeline.items.map(bte => bte.repositionne())
    console.log("ZOOM:", BancTimeline.zoom)
  }
, dezoom(deca){ // UI.dezoom
    this.setBTZoom(-0.2* (deca||1))
    BancTimeline.items.map(bte => bte.repositionne())
    console.log("ZOOM:", BancTimeline.zoom)
  }
, setBTZoom(value){ // UI.setBTZoom
    delete BancTimeline._coefp2t
    delete BancTimeline._coeft2p
    BancTimeline.zoom += value
    if(BancTimeline.zoom < 0) BancTimeline.zoom = 0.1
  }
}


}// /const BancTimeline



Object.defineProperties(BancTimeline, {
  // Propriétés diverses
  a:{get(){return current_analyse}}

, currentTime:{
    get(){return this._currenttime || new OTime(0)}
  , set(v){
      isDefined(this._currenttime) || (this._currenttime = new OTime(0))
      isDefined(v.vtime) && ( v = v.vtime )
      this._currenttime.updateSeconds(v)

    }
  }

// ---------------------------------------------------------------------
//
  // zoom courant (défaut = 100)
, zoom:{
    get(){return this._zoom || 1}
  , set(v){this._zoom = v}
  }
  // Scroll courant du ban de timeline
, scrollX:{
    get(){return this.timelineTape.scrollLeft()}
  }

// ---------------------------------------------------------------------
//  PROPRIÉTÉS DOM

, width:{get(){
    return this._width || defP(this,'_width', this.timelineTape.innerWidth())
  }}

// ---------------------------------------------------------------------
//  OBJETS DOM

, cursor:{get(){return $('section#banctime-banc-timeline div#banctime-cursor')}}
  // Bande sur laquelle on dépose les éléments.
, timelineTape:{get(){return $('section#banctime-banc-timeline div#banctime-tape')}}
, timeRuler:{get(){return $('section#banctime-banc-timeline div#banctime-timeRuler')}}
, BancTimeline:{get(){return $('section#banctime-banc-timeline')}}
})
