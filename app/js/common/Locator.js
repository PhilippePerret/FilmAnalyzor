'use strict'
/**
 * Class Locator
 * -------------
 * Pour la gestion d'un locateur vidéo
 */

const NextTime = require('./js/common/NextTime')
const LocatorGotoMethods = require('./js/common/Locator/goto_methods')

class Locator {

constructor(analyse){
  this.a = analyse
  this.stop_points = [] // pour mettre les OTime(s)
  this.stop_points_times = [] // pour mettre les seconds
}

get nextTime(){return this._nexttime || defP(this,'_nexttime', new NextTime())}

// Pour savoir si la vidéo est en train de jouer
get playing(){return this._playing || false}
set playing(v){ this._playing = v}

init(){
  this.videoController = this.a.videoController

  // Le bouton pour rejoindre le début du film. Il n'est défini que si
  // ce temps est défini pour l'analyse courante
  this.a.setButtonGoToStart()

  // L'horloge de la vidéo n'est visible que lorsque son temps est différent
  // du temps réel, donc lorsque le début du film est défini
  UI.videoHorloge.css('visibility', this.a.filmStartTime?STRvisible:STRhidden)

  // L'instance NextTime qui va permettre de connaitre
  // le temps suivant et la nature de l'élément portant
  // ce temps
  // this.nextTime.initWithTime(OTime.ZERO)

}

// ---------------------------------------------------------------------
//  Méthode de navigation dans la vidéo (play, stop, etc.)
/**
  Méthode qui met en route et arrête la vidéo

  Elle est notamment appelée quand on presse le bouton
  PLAY principal.

 */
togglePlay(ev){
  var pauser = this.playing === true
  if (pauser) {
    //
    // => PAUSE
    //
    UI.video.pause()
    $(this.btnPlay).removeClass('actived')
    this.playing = false
    this.actualizeALL() // à l'arrêt, on actualise tout
    this.desactivateFollowers()
    this.setPlayButton(this.playing)
    this.stopWatchTimerEvent()
    this.a.modified = true // pour le temps courant
  } else {
    //
    // => PLAY
    //
    this.resetAllTimes()
    // stop.
    var curT = this.getTime() // {OTime}
    // Pour gérer l'Autoplay Policy de Chromium
    var videoPromise = UI.video.play()
    if (isDefined(videoPromise)) {
      videoPromise.then( _ => {

        // Autoplay started!

        // On mémorise le dernier temps d'arrêt pour y revenir avec le bouton
        this.lastStartTime = curT
        this.addStopPoint(curT)
        $(this.btnPlay).addClass('actived')
        this.playing = true
        // On déclenche le suivi de l'horloge, curseur, etc.
        this.activateFollowers()
        this.setPlayButton(this.playing)
      }).catch(error => {
        // Autoplay was prevented.
        // Show a "Play" button so that user can start playback.
        // Pouvoir mettre cette alerte, en cas de début fort
        console.warn("Autoplay prevented, ok.")
        this.setPlayButton(this.playing)
      });
    }
    // On redémarre la surveillance des temps par les events du
    // reader pour qu'ils se mettent en exergue quand le temps
    // passe sur eux.
    this.restartWatchTimerEvent()
  }
  // console.log("<- togglePlay")
}

// ---------------------------------------------------------------------
//  MÉTHODES DE NAVIGATION DANS LA VIDÉO

stop(){
  this.playing && this.togglePlay()
}

/**
 * Méthode pour rembobiner au début du film (si on est après et qu'il est
 * défini) ou au début de la vidéo
 *
 * Note : le -5 ci-dessous permet de cliquer deux fois sur le bouton pour
 * revenir tout au début (sinon, on revient toujours au début défini du
 * film)
 */
stopAndRewind(){
  var curOTime = this.currentTime // {OTime}
  var newOTime = new OTime(0)

  // Si le film jouait, on doit l'arrêter
  if(this.playing) this.togglePlay()

  if(curOTime > this.lastStartTime){ // instances {OTime}
    // <= Le temps courant est supérieur au dernier temps de départ
    // => on revient au dernier temps de départ
    newOTime.rtime = this.lastStartTime.seconds
  } else if (this.hasStartTime && curOTime > (this.a.filmStartTime + 5)){
    // <= le temps courant est au-delà des 5 secondes après le début du film
    // => On revient au début du film
    newOTime.rtime = 0
  } else {
    // Sinon, on revient au début de la vidéo
    newOTime.vtime = 0
  }
  this.setTime(newOTime)
}

/**
  Méthode appelée par les boutons pour rembobiner ou avancer, quand
  on tient dessus.
  Elle doivent être utilisées avec les méthode `stop` correspondantes
  pour stoper l'avance ou le recul.
**/
startRewind(sec){
  this.timerRewind = setInterval(() => {this.rewind(sec)}, 100)
}
startForward(sec){
  this.timerForward = setInterval(()=>{this.forward(sec)}, 100)
}
/**
 * Méthode pour rembobiner de +secs+ seconds (on continue de jouer si
 * on jouait, ou alors on remet en route)
 */
rewind(secs){
  // console.log("-> rewind")
  var newtime = UI.video.currentTime - secs
  if(newtime < 0){
    newtime = 0
    if(this.timerRewind) this.stopRewind()
  }
  let ontime = new OTime(0)
  ontime.vtime = newtime
  this.setTime(ontime)
}

forward(secs){
  // console.log("-> forward")
  var newtime = UI.video.currentTime + secs
  if(newtime > UI.video.duration){
    if(this.timerForward) this.stopForward()
    return
  }
  let ontime = new OTime(0)
  ontime.vtime = newtime
  this.setTime(ontime)
}
stopRewind(){
  // console.log("-> stopRewind")
  clearInterval(this.timerRewind)
  delete this.timerRewind
}
stopForward(){
  // console.log("-> stopForward")
  clearInterval(this.timerForward)
  delete this.timerForward
}

/**
  Grande méthode qui règle le temps de la vidéo.

  Mais elle fait beaucoup plus que ça puisque c'est la méthode
  qui est appelée systématiquement quand on change un temps.

  Notamment, elle :

  * règle la vidéo au temps (exact voulu)
  * règle l'horloge principale
  * règle l'indicateur de position (timeline sous la vidéo)
  * indique les partie et sous-partie dans lesquelles on se
    trouve, pour le paradigme absolu ou le paradigme relatif
    au film.
  * cherche et indique la scène courante (if any)

  [1] Note : cette méthode ne doit surtout pas être appelée de façon
  récursive par le play, car elle initialise tous les temps mémorisés
  qui permettent de gagner de la puissance, comme par exemple le temps
  de la prochaine scène ou du temps d'arrêt (cf. `resetAllTimes`).

  +time+  @Number Nombre de secondes depuis le début de la vidéo
          Note : appeler la méthode `setTime` pour envoyer un
          temps dit "réel", c'est-à-dire par rapport au début
          défini du film.
  @param {OTime} time Instance de temps qui permet, grâce à sa propriété vtime
                      de régler la vidéo.
  @param {Object|Boolean} options | dontPlay
    dontPlay   Si true, on ne met pas la vidéo en route.
    updateOnlyVideo   Si true, on n'actualise que la vidéo et l'horloge
    updateOnlyHorloge Si true, on actualise que l'horloge principale
 */
setTime(time, options){
  // try {
  //   doujeviens
  // } catch (e) {
  //   throw(e)
  // } finally {
  // }
  if ( 'boolean' === typeof options ){
    options = {dontPlay: options}
  } else if ( isUndefined(options) ){
    options = {}
  }
  log.info(`-> Locator#setTime(time=${time}, options=${JSON.stringify(options)})`)

  // Les choix
  let updateTimes = isNotTrue(options.updateOnlyVideo) && isNotTrue(options.updateOnlyHorloge)
    , updateVideo = isNotTrue(options.updateOnlyHorloge)
    , playVideo   = isNotTrue(options.dontPlay) && updateTimes && updateVideo

  time instanceof(OTime) || raise(T('otime-arg-required'))

  if ( updateTimes ) {
    // Initialisation de tous les temps. Cf. [1]
    this.resetAllTimes()
    // On instancie le nextTime avec le temps choisi
    this.nextTime.initWithTime(time)

  }

  // Réglage de la vidéo. L'image au temps donné doit apparaitre
  // + réglage des curseurs
  updateVideo && this.setVideoAt(time)

  // Réglage de l'horloge principale (toujours)
  this.actualizeHorloge(time)

  if ( playVideo ) {
    // Si l'on n'a pas précisé explicitement qu'on ne voulait
    // pas démarrer la vidéo, on doit voir si on doit le
    // faire.
    // Et on doit le faire si :
    //  - elle n'est pas déjà en train de jouer
    //  - l'option de démarrer après le choix d'un temps est
    //    activée.
    isTrue(this.playAfterSettingTime) && isFalse(this.playing) && this.togglePlay()
    log.info('<- Locator#setTime')
  }

  // Si la vidéo ne joue pas, on force l'actualisation de tous
  // les éléments, reader, horloge, markers de structure, etc.
  // Sauf si les options demandent de n'actualiser que la
  // vidéo et l'horloge.
  if ( isFalse(options.updateOnlyVideo) ) {
    UI.video.paused && this.actualizeALL()
  }

}

setVideoAt(curt){
  UI.video.currentTime = curt.vtime
  this.actualiseBancTimeline(curt) // notamment le curseur
  // TODO
  // Plus tard, il faudra actualiser tous les curseurs
  // présents à l'affichage
}

// ---------------------------------------------------------------------
//  MÉTHODES DOM

// Réglage du bouton PLAY en fonction de +running+ (qui est this.playing)
setPlayButton(running){
  this.btnPlay.innerHTML = running ? this.imgPauser : this.imgPlay
}

/**
  Méthode qui arrête la surveillance des events affichés dans
  le reader (quand on arrête la lecture)
**/
stopWatchTimerEvent(){
  if (isEmpty(this.a.reader.watchedItems)) return
  Object.values(this.a.reader.watchedItems).forEach(item => this.a.reader.stopWatchingItem(item))
}

/**
  Méthode contraire à la méthode précédente, qui relance la
  surveillance des events affichés dans le reader, pour savoir
  si on passe par leur temps.
**/
restartWatchTimerEvent(){
  if (isEmpty(this.a.reader.watchedItems)) return
  Object.values(this.a.reader.watchedItems).forEach(item => this.a.reader.restartWatchingItem(item))
}

/**
 * On peut déterminer quand la vidéo devra s'arrêter avec cette méthode
 */
setEndTime(time, fnOnEndTime){
  if(!(time instanceof(OTime))){
    console.error(`${time} n'est pas une instance OTime. Je ne définis pas la fin de la vidéo.`)
    return
  }
  this.wantedEndTime = time
  this.wantedEndTimeCallback = fnOnEndTime
}

/**
  Méthode qui ré-initialise les valeurs qui vont servir à surveiller
  les temps en cours de lecture, pour connaitre le temps d'arrêt par
  exemple ou le temps de la prochaine scène.
  Ces valeurs doivent être ré-initialisées à chaque lancement de la
  vidéo.
**/
resetAllTimes(){
  delete this.wantedEndTime
  delete this.wantedEndTimeCallback
  delete this.timeNextScene

  delete this.nextTime
}



// ---------------------------------------------------------------------
//  MÉTHODES SUR LES SCÈNES

get currentScene(){ return FAEscene.current}
set currentScene(s){
  log.info(`Current scène de Locator mise à ${s} (${s.numero})`)
  FAEscene.current = s
}
// Retourne la scène précédente de la position courante
get prevScene() {
  return FAEscene.before(this.currentTime)
}
get nextScene(){
  return FAEscene.after(this.currentTime) // cf. [3] ci-dessus
}

addStopPoint(otime){
  if(this.a.options.get('option_lock_stop_points')) return
  otime instanceof(OTime) || raise(T('otime-arg-required'))
  if (this.stop_points_times.indexOf(otime.seconds) > -1) return
  if (this.stop_points_times.length > 2) {
    this.stop_points.shift()
    this.stop_points_times.shift()
  }
  this.stop_points.push(otime)
  this.stop_points_times.push(otime.seconds)
}

// ---------------------------------------------------------------------
// Méthodes de données

get startTime(){return this._startTime||defP(this,'_startTime', OTime.ZERO)}
get endTime(){return this._endtime||defP(this,'_endtime', new OTime(UI.video.duration))}
get currentTime(){ return OTime.vVary(UI.video.currentTime) }

/**
* Alias de this.currentTime pour retourner le temps vidéo courant
**/
getTime(){ return this.currentTime }


// ---------------------------------------------------------------------

/**
 * Méthode pour activer l'horloge qui dépend du début défini pour le
 * film (ou le début en cas d'erreur). Elle marche au frame près
 */
activateFollowers(){
  var my = this
  if (this.intervalTimer){
    this.desactivateFollowers()
  } else {
    // On construit la méthode d'actualisation en fonction des options et du
    // mode d'affichage.
    this.buildActualizeMainFunction()
    // === INTERVAL TIMER QUI DEMANDE L'ACTUALISATION DE L'AFFICHAGE ===
    this.intervalTimer = setInterval(my.actualizeMainFunction.bind(my), 1000/40)
  }
  my = null
}

desactivateFollowers(){
  if(this.intervalTimer){
    clearInterval(this.intervalTimer)
    this.intervalTimer = null
  }
}

/**
  Méthode qui se charge de tout actualiser,
  c'est-à-dire l'horloge, le reader (events proches) et le
  indicateur de structure.

  Note : avant, c'était la méthode appelée tous les 40 millièmes de seconde
  pour actualiser l'affichage. Maintenant, elle ne sert que lorsqu'on est à
  l'arrêt.
**/
actualizeALL(){
  log.info('-> Locator.actualizeALL')
  var curt = this.currentTime
  this.actualizeHorloge(curt)
  this.actualizeReader(curt)
  this.actualizeMarkersStt(curt)
  this.actualizeCurrentScene(curt)
  curt = null
  log.info('<- Locator.actualizeALL')
}

/**
  Méthode qui construit la fonction d'actualisation en fonction des options
  choisies.
**/
buildActualizeMainFunction(){
  var codeLines = [] // on mettra les lignes de code dedans
  // On actualise toujours les horloges
  codeLines.push("var curt = this.currentTime;")
  codeLines.push("this.actualizeHorloge(curt)")

  if (this.a.options.get('video.running.updates.reader')){
    codeLines.push("this.actualizeReader(curt)")
  }
  if (this.a.options.get('video.running.updates.stt')){
    codeLines.push("this.actualizeMarkersStt(curt)")
  }
  // Arrêter de jouer si un temps de fin est défini et qu'il est
  // atteint
  codeLines.push("this.isEndTimeWanted(curt) && this.stopAtEndTimeWanted()")

  this.actualizeMainFunction = new Function(codeLines.join(RC))
  this.actualizeMainFunction = this.actualizeMainFunction.bind(this)

}

actualiseBancTimeline(curt){
  BancTimeline.setCursorByTime(curt)
}

actualizeHorloge(curt){
  // console.log("[actualizeHorloge] curt:", curt)
  UI.mainHorloge.html(curt.rhorloge)
  UI.videoHorloge.html(curt.horloge)
}

actualizeReader(curt){
  // Note : on passe tous les 40 millième de secondes
  // par cette méthode, quand on joue la vidéo.

  // Nouveau fonctionnement. On se sert d'une instance
  // nextTime pour connaitre les prochains temps
  // d'event, d'image ou de structure
  // Rappel : nextTime est une instance NextTime dont le
  // valueOf retourne le prochain temps
  if (isUndefined(this.nextTime.nextItem) || curt.rtime < this.nextTime){
    return // rien à faire
  }

  // => Le temps suivant est atteint, on affiche l'élément
  // qui peut être un event, une image ou un noeud stt
  // Noter que ça va aussi actualiser la scène, si c'en est une
  // et où les noeuds structurels
  this.nextTime.revealNextItemAndFindNext()

}


// Retourne true si un temps de fin est voulu et qu'il est atteint
isEndTimeWanted(curt){
  return this.wantedEndTime && curt >= this.wantedEndTime
}

// Fonction à jouer quand le temps de fin est atteint
stopAtEndTimeWanted(){
  this.togglePlay()
  if(isFunction(this.wantedEndTimeCallback)) this.wantedEndTimeCallback()
}

/*
  De la même manière qu'on actualise l'horloge et le reader, on
  actualise la marque des parties et des zones à côté de
  l'horloge principale

  TODO Pour le moment, on vient ici tous les 40ème de secondes
  et on fait l'opération de checker dans les tables. On pourrait
  améliorer les choses en retenant le temps suivant à attendre
  et en s'en retournant tout de suite après (c'était un peu l'idée
  avant de revenir à quelque chose de plus efficace).
  Pour attendre le temps suivant, il suffit de prendre le start
  de l'élément suivant dans chaque table.
 */
actualizeMarkersStt(curt){
  // console.log("-> actualizeMarkersStt", curt)
  var vid = this.videoController
  isDefined(curt) || ( curt = this.currentTime )
  isDefined(this.a.PFA.TimesTables) || this.a.PFA.setTimesTables()
  isDefined(this.nextTimes) || (
    this.nextTimes = {'Main-Abs': null, 'Main-Rel': null, 'Sub-Abs':null, 'Sub-Rel': null}
  )
  // On doit répéter pour les quatre tables, heureusement petites,
  // pour trouver :
  //  - la partie absolue
  //  - la partie relative (if any)
  //  - la zone absolue
  //  - la zone relative si elle existe

  var kmar, node, name, nexT
  for(var ma of ['Main','Sub']){
    for(var ar of ['Abs','Rel']){
      kmar = `${ma}-${ar}`
      if(this.nextTimes[kmar] && this.nextTimes[kmar] > curt){
        // <= Le temps courant (curt) n'a pas encore atteint
        //    le prochain temps (nextTimes[key]) dans la table
        //    kmar
        // => On continue.
        continue
      }
      var res = this.getSttNameFor(curt, ma, ar)
      node = res[0]
      name = res[1]
      nexT = res[2]
      // Malheureusement, ça ne fonctionne pas avec :
      // [node, name, nextTime] = this.getSttNameFor(curt, ma, ar)
      vid.setMarkStt(ma, ar, node, name)
      this.nextTimes[kmar] = Math.round(nexT)
    }
  }

}

/**
  On renseigne la scène courante.

  Maintenant, cette méthode ne sert plus que lorsqu'on est à l'arrêt.
  Si on est en lecture, l'objet NextTime gère les scènes qui arrivent.

  @param {Float} curt  Le temps vidéo courant (donc pas le temps "réel")

 */
actualizeCurrentScene(curt){
  log.info("-> actualizeCurrentScene")
  // Rien à faire s'il n'y a pas de scène
  if(FAEscene.count === 0) return
  FAEscene.current = FAEscene.at(curt)
}

// ---------------------------------------------------------------------

/**
  Tourne le nom, le noeud et le prochain temps pour le noeud
  structurel correspondant au temps courant de la vidéo.
**/
getSttNameFor(curt, mainSub, absRel){
  var table = this.a.PFA.TimesTables[`${mainSub}s-${absRel}`/* p.e. 'Subs-Abs' */]
    , len = table.length
    , dtime
    , i = 0
    , nextTime = null
  for(;i<len;++i){
    dtime = table[i]
    if(curt.between(dtime.start, dtime.end - 0.01)){
      nextTime = table[i+1] ? table[i+1].start : null
      return [dtime.node, dtime.name, nextTime]
    }
    if(dtime.start > curt && !nextTime){
      nextTime = dtime.start
    }
  }
  return [null, null, nextTime]
}

/**
 * Méthode qui retourne les évènements proches du temps +time+
 */
eventsAt(time) {
  var trancheTime = parseInt(time - (time % 5),10)
  // On commence à chercher 10 secondes avant (on pourra changer ce nombre)
  var fromTranche = trancheTime // - 20
  var toTranche   = trancheTime // + 20
  // On prend tous les évènements dans ce temps
  var evs = []
  var evsBT = this.eventsByTrancheTime
  for(var tranche = fromTranche; tranche <= toTranche; tranche+=5){
    // console.log("Recherche dans la tranche : ", tranche)
    if(isUndefined(evsBT[tranche])) continue
    for(var i=0, len=evsBT[tranche].length;i<len;++i){
      evs.push(this.a.ids[evsBT[tranche][i]])
    }
  }
  return evs
}

/**
 * Ajoute l'évènement +ev+ à la liste par tranche (à sa création par exemple)
 */
addEvent(ev){
  var tranche = parseInt(ev.time - (ev.time % 5),10)
  if(isUndefined(this.eventsByTrancheTime[tranche])){
    // <= La tranche n'existe pas encore
    // => On la crée et on ajoute l'identifiant de l'event
    this._events_by_tranche_time[tranche] = [ev.id]
  } else {
    // <= La tranche existe déjà
    // => Placer l'évènement pile à l'endroit voulu
    var len = this.eventsByTrancheTime[tranche].length
    // console.log("tranche:",tranche)
    // console.log("this.eventsByTrancheTime[tranche]:", this.eventsByTrancheTime[tranche])
    // console.log("this._events_by_tranche_time[tranche]:", this._events_by_tranche_time[tranche])
    var etested
    for(var i=0;i<len;++i){
      etested = FAEvent.get(this._events_by_tranche_time[tranche][i])
      if (etested.time > ev.time){
        this._events_by_tranche_time[tranche].splice(i, 0, ev.id)
        break
      }
    }
  }
}

// ---------------------------------------------------------------------
//  MÉTHODES MARKERS

createNewMarker(){
  let my = this
  prompt("Nom du nouveau marqueur :", {
      defaultAnswer: ''
    , buttons:['Renoncer','Créer le marqeur']
    , defaultButtonIndex:1
    , cancelButtonIndex:0
    , okButtonIndex:1
    , methodOnOK: (title, indexButtonClicked) => {
        let m = new Marker(my.a, {time: my.currentTime.vtime, title:title})
        m.create()
      }
  })
}

// ---------------------------------------------------------------------
// Méthodes DOM

/**
  Méthode appelée pour se rendre au temps voulu.
 */
goToTime(ev){
  this.setTime(new OTime(VideoController.current.section.find('.requested_time').val()))
  // En pause, il faut forcer l'affichage du temps, ça ne se fait pas
  // tout seul.
  if(UI.video.paused) this.actualizeALL()
}

// ---------------------------------------------------------------------
/**
 * Propriété qui contient les évènements de l'analyse courante par tranche de
 * temps de 5 secondes.
 */
get eventsByTrancheTime(){
  if(isUndefined(this._events_by_tranche_time)){
    this._events_by_tranche_time = {}
    var i = 0, len = this.a.events.length, e, t
    for(i;i<len;++i){
      e = this.a.events[i]
      var t = parseInt(e.time - (e.time % 5),10)
      if(isUndefined(this._events_by_tranche_time[t])){
        this._events_by_tranche_time[t] = []
      }
      this._events_by_tranche_time[t].push(e.id)
    }
    // console.log("this._events_by_tranche_time:",this._events_by_tranche_time)
  }
  return this._events_by_tranche_time
}

// ---------------------------------------------------------------------
// Méthodes d'état
get hasStartTime(){
  return this.a && this.a.filmStartTime > 0
}

get playAfterSettingTime(){
  return this.a.options.get('option_start_when_time_choosed')
}

// --- DOM ÉLÉMENTS ---
get btnPlay(){return this.videoController.btnPlay}
get btnRewindStart(){return this.videoController._btnRwdSt}
get imgPauser(){return '<img src="./img/btns-controller/btn-pause.png" />'}
get imgPlay(){return '<img src="./img/btns-controller/btn-play.png" />'}

}

Object.assign(Locator.prototype, LocatorGotoMethods)
