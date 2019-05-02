'use strict'

function affiche(msg){
  $('div#message').html(msg)
}

class VideoController {

// ---------------------------------------------------------------------
//  CLASSE

static get VIDEO_SIZES(){
    return {small: 450, medium: 650, large: 1000}
}

static newId(){
  if(undefined === this.lastId) this.lastId = 0
  return ++ this.lastId
}

static get current(){return this._current}
static set current(v){this._current = v}

// ---------------------------------------------------------------------
//  INSTANCE

constructor(analyse){
  this.analyse = this.a = analyse
  this.id = VideoController.newId()

  // Maintenant, on construit toujours la section vidéo
  log.info(`---> Build vidéo #${this.id}`)
  this.build()
  log.info(`<--- Build vidéo #${this.id}`)

  // Le mettre en vidéo courant
  VideoController.current = this
}

// La section contenant cette vidéo
get section(){return this._section||defP(this,'_section',$(`#section-video-${this.id}`))}
// Le contrôleur vidéo lui-même (la balise vidéo)
get video(){return this._video||defP(this,'_video', this.section.find('.video')[0])}
// L'horloge principale
get mainHorloge(){return this._mainHorloge||defP(this,'_mainHorloge', this.section.find('.main-horloge'))}
// La boite des boutons de navigation (control box, ou video-controller)
get navButtons(){return this._navButtons||defP(this,'_navButtons', this.section.find('.video-controller'))}
get inited(){return this._inited || false }
set inited(v){this._inited = v}

/**
 * Initialisation du controller
 *
 * TODO : quand on utilisera plusieurs VideoController, il faudra que les
 * identifiant soient uniques
 */
init(){
  log.info("-> VideoController#init()")
  var my = this
  if (this.inited){throw("Le vidéocontroller ne devrait pas être initié deux fois…")}

  this.locator = this.analyse.locator

  this.setDimensions()

  // Si l'analyse a enregistré une taille de vidéo, on la règle. Sinon, on
  // met la taille médium. Idem pour la vitesse de lecture de la vidéo.
  this.setSize(this.a.options.videoSize)
  this.setSpeed(this.a.options.videoSpeed)

  this.observe()

  // On appelle juste l'indicateur de position pour l'initialiser
  this.positionIndicator.init()


  this.inited = true
  log.info("<- VideoController#init()")

}
// /fin init

// Tailles pour le lecteur video
setDimensions(){
  var videoReaderWidth = Math.round(ScreenWidth * 60 / 100)
  this.section.css('width',`${videoReaderWidth}px`)
  // Redéfinition de la taille large de la vidéo en fonction de
  // l'écran.
  this.redefineVideoSizes(videoReaderWidth)

  var videoWidth   = Math.round(ScreenWidth * 60 / 100)
  var readerWidth  = Math.round(ScreenWidth * 39 / 100)
  var readerHeight = Math.round(ScreenHeight * 50 /100)

}

/**
 * Pour définir la taille de la vidéo (trois formats sont disponibles, pour
 * le moment)
 *
 * Si +save+ est true, la taille doit être enregistrée dans les préférences
 * de l'analyse courante.
 */
setSize(v, save){
  if(undefined===v) v = this.menuVideoSize.value
  this.video.width = VideoController.VIDEO_SIZES[v] || v // peut-être un nombre
  this.section.css('width', `${this.video.width + 10}px`)
  // this.mainHorloge.className = `horloge ${v}` // normalement on ne  change plus
  if (save === true) this.a.options.videoSize = v
}
// retourne la taille actuelle de la vidéo
getSize(){ return this.video.width}

/**
* Pour définir la vitesse de la vidéo
**/
setSpeed(speed, save){
  log.info('-> videoController#setSpeed', speed)
  this.video.defaultPlaybackRate = speed
  this.video.playbackRate = speed
  log.info(`  = Video speed: ${speed}`)
  if(save === true) this.a.options.videoSpeed = speed
  log.info('<- videoController#setSpeed')
}

// Retourne la vitesse actuelle de la vidéo
getSpeed(){
  log.info('<-> videoController#getSpeed')
  return this.video.playbackRate
}


/**
  Pour détruire la vidéo courante, certainement au
  chargement d'une autre analyse.
**/
remove(){ this.section.remove() }

/**
 * Pour redéfinir les largeurs de la vidéo en fonction de la largeur
 * de l'écran.
 */
redefineVideoSizes(w){
  VideoController.VIDEO_SIZES['large']   = w - 10
  if(w < 650){
    VideoController.VIDEO_SIZES['medium']    = parseInt((w / 3) * 2, 10)
    VideoController.VIDEO_SIZES['vignette']  = parseInt(w / 2.2, 10)
  }
}



/**
 * Pour charger la vidéo de path +vpath+
 */
load(vpath){
  log.info("-> VideoController#load")
  $(this.video)
  .on('error', ()=>{
    log.warn("Une erreur s'est produite au chargement de la vidéo.", err)
  })
  .on('loadeddata', () => {
    UI.showVideoController()
    var lastCurTime = this.analyse.lastCurrentOTime
    lastCurTime && this.analyse.locator.setTime(lastCurTime, true)
    this.a.onVideoLoaded.bind(this.a)()
  })
  .on('ended', () => {
    // Quand on atteint le bout de la vidéo
    this.a.locator.stop()
  })
  this.video.src = path.resolve(vpath)
  this.video.load() // la vidéo, vraiment
  log.info("<- VideoController#load")
}

/**
 * Préparation de l'interface en fonction de la présence ou non d'une
 * vidéo.
 */
setVideoUI(visible){
  log.info("-> VideoController#setVideoUI")
  let visu = visible ? 'visible' : 'hidden'
  this.section.find('.video-header')[visible?'show':'hide']()
  for(var el of ['video','div-nav-video-buttons']){
    this.section.find(el).css('visibility', visu)
  }
  log.info("<- VideoController#setVideoUI")
}

/**
  Quand on clique sur les marker de structure à côté de l'horloge principale,
  on peut se rendre aux parties choisies. Chaque clic passe à la partie
  suivante. CMD click permet de revenir en arrière.

  +mainSub+   Soit 'Main' soit 'Sub', pour indiquer qu'il s'agit d'une
              partie (expo, dév, dénouement) ou d'une zone
  +absRel+    Soit 'Abs', soit 'Rel', pour indiquer qu'on a cliqué sur
              la section qui s'occupe des valeurs absolues ou la section
              qui s'occupe des valeurs relatives.

**/
onClickMarkStt(mainSub, absRel, e){
  var pfa = this.a.PFA
  // L'objet jQuery du marker
  var mk = this[`mark${mainSub}Part${absRel}`]
  // l'identifiant structure de la partie courant (peut-être indéfini)
  var kstt = mk.attr('data-stt-id')
  if(!kstt){
    // <= L'identifiant structurel n'est pas défini
    // => Il n'existe pas de noeud courant ou on est au tout début
    // ==> Prendre l'exposition
    kstt = mainSub == 'Main' ? 'DNOU' : 'desine'
  }
  var node = pfa.node(kstt)
  // console.log("Noeud courant : ", node.hname)
  var other_node
  if (e.metaKey){
    other_node = pfa.node(node.previous || node.last)
    // Sinon le temps ne serait pas contrôlé, car il est avant le
    // temps suivant attendu :
    delete this.a.locator.nextTimes
  } else {
    other_node = pfa.node(node.next || node.first)
  }
  // console.log("Nœud suivant/précédent, son temps:", other_node, other_node[`startAt${absRel}`])
  this.a.locator.setTime(new OTime(other_node[`startAt${absRel}`]))

  pfa = null
}

/**
* Met le nom de la partie courante dans le champ à côté de l'horloge
* principale, en réglant son attribut data-stt-id conservant son id
* structurel
**/
setMarkStt(mainSub, absRel, node, name){
  var mk = this[`mark${mainSub}Part${absRel}`]
  mk.html(name || '---')
  node && mk.attr('data-stt-id', node.id)
}

/**
* On place les observeurs sur le video-controleur
**/
get DATA_BUTTONS(){return [
    ['.btn-play', 'togglePlay']
  , ['.btn-stop', 'stopAndRewind']
  , ['.btn-go-to-film-start', 'goToFilmStart']
  , ['.btn-stop-points', 'goToNextStopPoint']
  , ['.btn-go-to-time-video', 'goToTime']
]}

observe(){
  var my = this

  // On observe les boutons de navigation
  for(var dbtn of this.DATA_BUTTONS){
    var [classe, method] = dbtn
    listenClick(this.section.find(classe)[0], my.locator, method)
  }

  var valsRewForw = [0.04, 1, 5]
  for(var i = 1; i < 4 ; ++ i){
    var val = valsRewForw.shift()
      , btnRewind   = this.section.find(`.btn-rewind-${i}`)[0]
      , btnForward  = this.section.find(`.btn-forward-${i}`)[0]
    listenMDown(btnRewind,  my.locator, 'startRewind', val)
    listenMUp(btnRewind,    my.locator, 'stopRewind')
    listenMDown(btnForward, my.locator, 'startForward', val)
    listenMUp(btnForward,   my.locator, 'stopForward')
  }

  // Les « horlogeables »
  var horloges = UI.setHorlogeable(this.section.find('.video-header')[0], {synchro_video: true})
  this.locator.oMainHorloge = Object.values(horloges)[0]

  // Boutons pour se déplacer de scène en scène (dans le contrôleur)
  var btnPrevScene = this.section.find('.btn-prev-scene')[0]
  var btnNextScene = this.section.find('.btn-next-scene')[0]
  listenMDown(btnPrevScene, my.locator,'goToPrevScene')
  listenMUp(btnPrevScene, my.locator,'stopGoToPrevScene')
  listenMDown(btnNextScene, my.locator,'goToNextScene')
  listenMUp(btnNextScene, my.locator,'stopGoToNextScene')

  // La vidéo elle-même, peut être déplacée pour récupérer un temps
  $(this.video).draggable({
    revert: true
  , cursorAt: {left: 40, top: 10}
  , helper: (e) => {
      let otime = this.locator.currentTime
      return DCreate('DIV', {
        inner: otime.horloge
      , class: 'dropped-time'
      , attrs:{'data-type': 'time', 'data-value': otime.horloge, 'data-time': otime.seconds.round(2)}
      })
    }
  })

  // Sur les parties à droite de l'horloge principale
  this.markMainPartAbs.on('click', this.onClickMarkStt.bind(this, 'Main', 'Abs'))
  this.markSubPartAbs.on('click', this.onClickMarkStt.bind(this, 'Sub', 'Abs'))
  this.markMainPartRel.on('click', this.onClickMarkStt.bind(this, 'Main', 'Rel'))
  this.markSubPartRel.on('click', this.onClickMarkStt.bind(this, 'Sub', 'Rel'))

  // Pour afficher les scènes, le div est sensible au clic et permet
  // d'éditer la scène
  this.markCurrentScene.on('click', () => {
    if (this.locator.currentScene){
      EventForm.editEvent.bind(EventForm)(this.locator.currentScene)
    }
  })

  horloges = null
  my = null
}

get btnPlay(){return this._btnPlay||defP(this,'_btnPlay', this.section.find('.btn-play')[0])}
get btnStop(){return this._btnStop||defP(this,'_btnStop', this.section.find('.btn-stop')[0])}
get btnRewindStart(){return this.btnSop}
get mainHorloge(){return this._mainHorloge||defP(this,'_mainHorloge', this.section.find('.main-horloge')[0])}
get realHorloge(){return this._realHorloge||defP(this,'_realHorloge', this.section.find('.real-horloge')[0])}

get markMainPartAbs(){return this._markMainPartAbs || defP(this,'_markMainPartAbs', this.section.find('.main-part-abs'))}
get markSubPartAbs(){return this._markSubPartAbs || defP(this,'_markSubPartAbs',    this.section.find('.sub-part-abs'))}
get markMainPartRel(){return this._markMainPartRel || defP(this,'_markMainPartRel', this.section.find('.main-part-rel'))}
get markSubPartRel(){return this._markSubPartRel || defP(this,'_markSubPartRel',    this.section.find('.sub-part-rel'))}
get markCurrentScene(){return this._markCurrentScene||defP(this,'_markCurrentScene',this.section.find('.mark-current-scene'))}

// Pour l'indicateur de position, une timeline sous
// la vidéo.
get positionIndicator(){return this._positionIndicator||defP(this,'_positionIndicator',new FATimeline(this.timeline))}
get timeline(){return this._timeline||defP(this,'_timeline',this.section.find('.timeline')[0])}

get CTRL_BUTTONS(){
  return {
  tiny_buttons:['prev-scene','rewind-3', 'rewind-2', 'rewind-1', 'forward-1', 'forward-2', 'forward-3', 'next-scene']
, main_buttons: {
    'go-to-film-start': {title:"Pour retourner au début du film (si défini)"}
  , 'stop-points': {title:"Passe en revue les 3 derniers points d'arrêt"}
  , 'stop': {title:"1/ dernier point d'arrêt, 2/ début du film, 3/ début de la vidéo"}
  , 'play': {title:"Lancer/pauser/relancer la vidéo"}
  }
}
}

build(){
  // console.log('-> VideoController#build')
  // La section principale
  let sectionVideo = DCreate('SECTION', {class: 'section-video', id: `section-video-${this.id}`, append:[
      // ENTÊTE
      DCreate('DIV', {class:'video-header no-user-selection', append:[
            DCreate('HORLOGE', {class: 'main-horloge horloge vignette horlogeable', inner: '0:00:00.0'})
          , DCreate('DIV', {class: 'main-part part-abs main-part-abs', inner: '...'})
          , DCreate('DIV', {class: 'sub-part part-abs sub-part-abs', inner: '...'})
          , DCreate('DIV', {class: 'main-part part-rel main-part-rel', inner: '...'})
          , DCreate('DIV', {class: 'sub-part part-rel sub-part-rel', inner: '...'})
          , DCreate('DIV', {class: 'mark-current-scene', inner: '...'})
      ]})
      // VIDÉO
    , DCreate('VIDEO', {id: `video-${this.id}`, class: 'video no-user-selection dropped-time', append:[
            DCreate('SOURCE', {id: `video-${this.id}-src`, type: 'video/mp4', attrs:{src:""}})
      ]})
      // INDICATEUR DE POSITION (aka TIMELINE)
    , DCreate('DIV', {class: 'timeline'})
      // Le DIV principal contenant les boutons de contrôle
    , DCreate('DIV', {class: 'div-nav-video-buttons no-user-selection'})
  ]})
  $('section#section-videos').append(sectionVideo)
  this.buildControllerBox()
}

buildControllerBox(){
  let btns = [], suf, dbtn

  let spanHorlogeReal = DCreate('SPAN', {class: 'real-horloge horloge mini fleft', inner: '0:00:00.0'})

  let divGoToTime = DCreate('DIV', {class:'go-to-time', append: [
      DCreate('BUTTON', {type: 'button', class:'small btn-go-to-time-video', inner: 'Aller au temps'})
    , DCreate('INPUT',  {type: 'text', id:`request_time-${this.id}`, class: 'requested_time horloge small', value: '', attrs:{placeholder:'0,0,0.0'}})
  ]})
  // Les boutons rewind et forward, etc.
  for(suf of this.CTRL_BUTTONS.tiny_buttons){
    btns.push(
        DCreate('BUTTON', {type: 'button', class: `controller btn-${suf}`, append:[
        DCreate('IMG', {attrs:{src: `./img/btns-controller/btn-${suf}.png`}})
      ]})
    )
  }
  let divTinyBtns = DCreate('DIV', {class: 'vcontroller-tiny-btns no-user-selection', append: btns})

  // Les boutons principaux du controller de vidéo
  btns = []
  for(suf in this.CTRL_BUTTONS.main_buttons){
    dbtn = this.CTRL_BUTTONS.main_buttons[suf]
    btns.push(
      DCreate('BUTTON', {type:'button', class: `main btn-${suf}`, attrs:{title:dbtn.title}, append:[
        DCreate('IMG', {attrs:{src: `./img/btns-controller/btn-${suf}.png`}})
      ]})
    )
  }
  let divMainBtns = DCreate('DIV', {class: 'vcontroller-main-btns no-user-selection', append:btns})

  let divControlBox = DCreate('DIV', {class: 'video-controller no-user-selection', id: `video-controller-${this.id}`, append:[
    spanHorlogeReal, divGoToTime, divTinyBtns, divMainBtns
  ]})

  $(`#section-video-${this.id} .div-nav-video-buttons`).append(divControlBox)
}

}
