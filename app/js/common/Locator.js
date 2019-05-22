'use strict'
/**
 * Class Locator
 * -------------
 * Pour la gestion d'un locateur vidéo
 */

class Locator {

constructor(analyse){
  this.a = analyse
  this.stop_points = [] // pour mettre les OTime(s)
  this.stop_points_times = [] // pour mettre les seconds
}

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
  this.hasStartTime && UI.videoHorloge.css('visibility', STRhidden)
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
    this.desactivateHorloge()
    this.setPlayButton(this.playing)
    this.stopWatchTimerEvent()
    this.a.modified = true // pour le temps courant
  } else {
    //
    // => PLAY
    //
    this.resetAllTimes()
    // On mémorise le dernier temps d'arrêt pour y revenir avec le bouton
    // stop.
    var curT = this.getTime() // {OTime}
    // Pour gérer l'Autoplay Policy de Chromium
    var videoPromise = UI.video.play()
    if (isDefined(videoPromise)) {
      videoPromise.then( _ => {
        // Autoplay started!
        this.lastStartTime = curT
        this.addStopPoint(curT)
        $(this.btnPlay).addClass('actived')
        this.playing = true
        this.activateHorloge()
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
  this.actualizeHorloge()
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
  @param {Boolean} dontPlay   Si true, on ne met pas la vidéo en route.
 */
setTime(time, dontPlay){
  log.info('-> Locator#setTime(time=, dontPlay=)', time.toString(), dontPlay)
  time instanceof(OTime) || raise(T('otime-arg-required'))

  // Initialisation de tous les temps. Cf. [1]
  this.resetAllTimes()

  // Réglage de la vidéo. L'image au temps donné doit apparaitre
  UI.video.currentTime = time.vtime

  // Réglage de l'horloge principale.
  UI.mainHorloge.html(time.vhorloge)

  if(!dontPlay){
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
  UI.video.paused && this.actualizeALL()

}

// ---------------------------------------------------------------------
//  MÉTHODES DOM

// Réglage du bouton PLAY en fonction de +running+ (qui est this.playing)
setPlayButton(running){
  this.btnPlay.innerHTML = running ? this.imgPauser : this.imgPlay
}

/**
 * Méthode qui affiche les évènements qui se trouvent à +time+
 * (avec une marge de plus ou moins 10 secondes)
 * Note : la méthode est appelée toutes les 3 secondes
 */
showEventsAt(time){
  this.eventsAt(time).forEach(ev => {if(!ev.shown) ev.showDiffere()})
}

/**
  Méthode qui affiche les images autour du temps time
  @param {OTime} time
**/
showImagesAt(time){
  FAImage.imagesAt(time.vtime).forEach(img => {if(!img.shown) img.showDiffere()})
}

/**
  Méthode qui arrête la surveillance des events affichés dans
  le reader (quand on arrête la lecture)
**/
stopWatchTimerEvent(){
  this.a.reader.forEachEvent(function(ev){if(ev.shown)ev.stopWatchingTime()})
}
/**
  Méthode contraire à la méthode précédente, qui relance la
  surveillance des events affichés dans le reader, pour savoir
  si on passe par leur temps.
**/
restartWatchTimerEvent(){
  this.a.reader.forEachEvent(function(ev){if(ev.shown)ev.startWatchingTime()})
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
}


/**
 * Méthode permettant de rejoindre le début du film (ou le 0)
 */
goToFilmStart(){

  if(isDefined(this.a.filmStartTime)) this.setTime(this.startTime)
  else F.error("Le début du film n'est pas défini. Cliquer sur le bouton adéquat pour le définir.")
}

goToFilmStartOrZero(){
  this.setTime(this.a.filmStartTime ? this.startTime : OTime.ZERO)
}

// Méthode permettant de rejoindre la fin du film (avant le générique, s'il
// est défini.)
goToFilmEndOrEnd(){
  if(isDefined(this.a.filmEndTime)) this.setTime(this.endTime)
  else UI.video.currentTime = UI.video.duration
}

// ---------------------------------------------------------------------
//  MÉTHODES SUR LES SCÈNES

get currentScene(){ return FAEscene.current}
set currentScene(v){
  log.info(`Current scène de Locator mise à ${v} (${v.numero})`)
  FAEscene.current = v
}

// Retourne la scène précédente de la scène courante
get prevScene(){
  if (!this.currentScene || this.currentScene.numero == 1) return
  else return FAEscene.getByNumero(this.currentScene.numero - 1)
}
get nextScene(){
  // console.log("-> nextScene")
  if(!this.currentScene) return FAEscene.getByNumero(1)
  else return FAEscene.getByNumero(this.currentScene.numero + 1)
}

goToPrevScene(){
  let method = () => {
    let pScene = this.prevScene
    if (pScene){
      this.setTime(pScene.otime)
    } else if (FAEscene.current){
      F.notify(`La scène ${FAEscene.current.numero} n'a pas de scène précédente.`)
    } else {
      F.notify('Pas de scène courante.')
    }
  }
  this.timerPrevScene = setTimeout(method, 1000)
  method()
}
stopGoToPrevScene(){
  clearTimeout(this.timerPrevScene)
  delete this.timerPrevScene
}

goToNextScene(){
  log.info("-> Locator#goToNextScene", (!FAEscene.current ? 'pas de scène courante' : `Passer à la scène suivante de la ${FAEscene.current.numero}`))
  let method = () => {
    let nScene = this.nextScene
    if (nScene){
      this.setTime(nScene.otime)
      if(this.currentScene) log.info(`   Après setTime, numéro scène courant = ${this.currentScene.numero}`)
      log.info(`   [goToNextScene] Après setTime, numéro scène suivante = ${nScene.numero}`)
    } else if (FAEscene.current) {
      F.notify(`   [goToNextScene] La scène ${FAEscene.current.numero} n'a pas de scène suivante.`)
    } else {
      F.notify(`   [goToNextScene] Pas de scène suivante.`)
    }
  }
  this.timerNextScene = setTimeout(method, 500)
  method()
  log.info('<- Locator#goToNextScene')
}
stopGoToNextScene(){
  clearTimeout(this.timerNextScene)
  delete this.timerNextScene
}
// ---------------------------------------------------------------------
//  Gestion des points d'arrêt

goToNextStopPoint(){
  ifDefined(his._i_stop_point) || ( this._i_stop_point = -1 )
  ++ this._i_stop_point
  if(this._i_stop_point > this.stop_points.length - 1) this._i_stop_point = 0
  if(isUndefined(this.stop_points[this._i_stop_point])){
    F.notify(T('no-stop-point'))
  } else {
    this.setTime(this.stop_points[this._i_stop_point])
  }
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
get currentTime(){
  isDefined(this._currentTime) || ( this._currentTime = OTime.ZERO )
  this._currentTime.vtime = UI.video.currentTime.round(2)
  return this._currentTime
}

/**
* Alias de this.currentTime pour retourner le temps vidéo courant
**/
getTime(){ return this.currentTime }

// ---------------------------------------------------------------------
//  Méthode de formatage

// Retourne une horloge sous la forme [-]h:mm:ss:ff
/**
  @param {OTime} s  Un Otime
**/
getRealTime(s){
  var negative = s < 0
  if(negative){s.updateSeconds(-s.seconds)}
  return `${negative?'-':' '}${s.horloge}`
}

// ---------------------------------------------------------------------

/**
 * Méthode pour activer l'horloge qui dépend du début défini pour le
 * film (ou le début en cas d'erreur). Elle marche au frame près
 */
activateHorloge(){
  var my = this
  if (this.intervalTimer){
    this.desactivateHorloge()
  } else {

    // On construit la méthode d'actualisation en fonction des options et du
    // mode d'affichage.
    this.buildActualizeMainFunction()

    // === INTERVAL TIMER QUI DEMANDE L'ACTUALISATION DE L'AFFICHAGE ===
    this.intervalTimer = setInterval(my.actualizeMainFunction.bind(my), 1000/40)
  }
  my = null
}

desactivateHorloge(){
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
  this.actualiseBancTimeline(curt) // si on est en mode Ban Timeline
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
  if (this.a.options.get('video.running.updates.current_scene')){
    codeLines.push("this.actualizeCurrentScene(curt)")
  }
  if(this.a.options.get('video.running.updates.banc_timeline')){
    codeLines.push("this.actualiseBancTimeline(curt)")
  }

  this.actualizeMainFunction = new Function(codeLines.join(RC))
  this.actualizeMainFunction = this.actualizeMainFunction.bind(this)

}


actualiseBancTimeline(curt){
  BancTimeline.setCursorByTime(curt)
}

actualizeHorloge(curt){
  isDefined(curt) || (curt = this.currentTime)
  UI.mainHorloge.html(curt.horloge)
  UI.videoHorloge.html(curt.vhorloge)
}

actualizeReader(curt){
  isDefined(curt) || ( curt = this.currentTime )
  // Afficher les events autour du temps courant
  this.showEventsAt(curt)
  // Afficher les images autour du temps courant
  this.showImagesAt(curt)
  // Arrêter de jouer si un temps de fin est défini et qu'il est dépassé
  if(this.wantedEndTime && this.currentTime > this.wantedEndTime){
    this.togglePlay()
    if(isFunction(this.wantedEndTimeCallback)) this.wantedEndTimeCallback()
  }
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

  Cette méthode cherche la scène courante et la scène
  suivante. Elle met la scène courante en affichage (et
  dans current_analyse) et elle mémorise le temps suivant
  pour ne pas avoir à chercher toujours le temps.

  @param {Float} curt  Le temps vidéo courant (donc pas le temps "réel")

 */
actualizeCurrentScene(curt){
  log.info("-> actualizeCurrentScene")
  if((this.timeNextScene && curt < this.timeNextScene) || FAEscene.count === 0) return
  var resat = FAEscene.atAndNext(curt)
  if(resat){
    FAEscene.current = resat.current
    this.timeNextScene  = resat.next ? resat.next.time : resat.next_time
  }
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
