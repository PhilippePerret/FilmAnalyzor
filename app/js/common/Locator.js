'use strict'
/**
 * Class Locator
 * -------------
 * Pour la gestion d'un locateur vidéo
 */

const LocatorGotoMethods = require('./js/common/Locator/goto_methods')

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
  this.controller = this.a.videoController

  // Le bouton pour rejoindre le début du film. Il n'est défini que si
  // ce temps est défini pour l'analyse courante
  // TODO : régler tous les boutons d'un coup
  this.a.setButtonGoToStart()

  // L'horloge de la vidéo n'est visible que lorsque son temps est différent
  // du temps réel, donc lorsque le début du film est défini
  UI.videoHorloge.css('visibility', this.a.filmStartTime?STRvisible:STRhidden)

}

// ---------------------------------------------------------------------
//  Méthode de navigation dans la vidéo (play, stop, etc.)
/**
  Méthode qui met en route et arrête la vidéo

  Elle est notamment appelée quand on presse le bouton
  PLAY principal.

 */
togglePlay(ev){
  let my = this
  var pauser = isTrue(this.playing)
  if (pauser) {
    //
    // => PAUSE
    //
    UI.video.pause()
    $(my.controller.btnPlay).removeClass('actived')
    my.playing = false
    my.actualizeALL() // à l'arrêt, on actualise tout
    my.desactivateFollowers()
    my.controller.setPlayButton(this.playing)
    my.a.modified = true // pour le temps courant -- (?)
  } else {
    //
    // => PLAY
    //
    my.resetAllTimes()
    // stop.
    var curT = my.currentTime // {OTime}
    // Pour gérer l'Autoplay Policy de Chromium
    var videoPromise = UI.video.play()
    if (isDefined(videoPromise)) {
      videoPromise.then( _ => {

        // Autoplay started!

        // On mémorise le dernier temps d'arrêt pour y revenir avec le bouton
        my.lastStartTime = curT
        my.addStopPoint(curT)
        $(my.controller.btnPlay).addClass('actived')
        my.playing = true
        // On déclenche le suivi de l'horloge, curseur, etc.
        my.activateFollowers()
        my.controller.setPlayButton(my.playing)
      }).catch(error => {
        // Autoplay was prevented.
        // Show a "Play" button so that user can start playback.
        // Pouvoir mettre cette alerte, en cas de début fort
        console.warn("Autoplay prevented, ok.")
        my.controller.setPlayButton(my.playing)
      });
    }
  }
  // console.log("<- togglePlay")
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
  if ( isBoolean(options) ){
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

  updateTimes && this.resetAllTimes()

  // Réglage de la vidéo. L'image au temps donné doit apparaitre
  // + réglage des curseurs
  updateVideo && this.setVideoAt(time)

  // Réglage de l'horloge principale (toujours)
  this.actualizeHorloge(time)

  if ( playVideo && isFalse(this.playing) ) {
    // Si l'on n'a pas précisé explicitement qu'on ne voulait
    // pas démarrer la vidéo, on doit voir si on doit le
    // faire.
    // Et on doit le faire si :
    //  - elle n'est pas déjà en train de jouer
    //  - l'option de démarrer après le choix d'un temps est
    //    activée.
    isTrue(this.playAfterSettingTime) && this.togglePlay()
    log.info('<- Locator#setTime')
  }

  // Si la vidéo ne joue pas, on force l'actualisation de tous
  // les éléments, reader, horloge, markers de structure, etc.
  // Sauf si les options demandent de n'actualiser que la
  // vidéo et l'horloge.
  isNotTrue(options.updateOnlyVideo) && UI.video.paused && this.actualizeALL()

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


// OBSOLÈTE : ON UTILISE MAINTENANT LA TimeMap
// /**
//   Méthode qui arrête la surveillance des events affichés dans
//   le reader (quand on arrête la lecture)
// **/
// stopWatchTimerEvent(){
//   if (isEmpty(this.a.reader.watchedItems)) return
//   Object.values(this.a.reader.watchedItems).forEach(item => this.a.reader.stopWatchingItem(item))
// }

// OBSOLÈTE : ON UTILISE MAINTENANT LA TimeMap
// /**
//   Méthode contraire à la méthode précédente, qui relance la
//   surveillance des events affichés dans le reader, pour savoir
//   si on passe par leur temps.
// **/
// restartWatchTimerEvent(){
//   if (isEmpty(this.a.reader.watchedItems)) return
//   Object.values(this.a.reader.watchedItems).forEach(item => this.a.reader.restartWatchingItem(item))
// }

/**
  On peut déterminer quand la vidéo devra s'arrêter avec cette méthode

  Par exemple quand on ne doit lire qu'un event.

  @param {OTime} otime          Temps de fin
  @param {Function} fnOnEndTime Fonction à appeler à la fin (if any)
 */
setEndTime(otime, fnOnEndTime){
  this.wantedEndTime = otime
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


// ---------------------------------------------------------------------

/**
 * Méthode pour activer l'horloge qui dépend du début défini pour le
 * film (ou le début en cas d'erreur). Elle marche au frame près
 */
activateFollowers(){
  var my = this
  // On construit la méthode d'actualisation en fonction des options et du
  // mode d'affichage.
  this.buildActualizeMainFunction()
  // === INTERVAL TIMER QUI DEMANDE L'ACTUALISATION DE L'AFFICHAGE ===
  this.intervalTimer = setInterval(my.actualizeMainFunction.bind(my), 1000/40)
  // Watcher sur le reader. Toutes les secondes, il regardera les éléments
  // qui doivent être affichés dans le reader.
  this.a.reader.startWatchingItems()
  my = null
}

desactivateFollowers(){
  if(this.intervalTimer){
    clearInterval(this.intervalTimer)
    this.intervalTimer = null
  }
  // On finit de suivre le reader
  this.a.reader.timerWatchingItems && this.a.reader.stopWatchingItems()
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
  this.actualizeMarkersStt(curt)
  this.actualizeMarkScene(curt)
  this.a.reader.revealAndHideElementsAt(curt)
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
  codeLines.push("this.actualizeMarkScene(curt)")

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
  // On n'actualise pas le curseur, car on l'actualise dans `actualizeHorloge`
  // pour que le curseur soit toujours synchronisé avec le temps joué.
  // BancTimeline.setCursorByTime(curt)
  // TODO Qu'est-ce qu'on doit actualiser d'autres ?
}

actualizeHorloge(curt){
  UI.mainHorloge.html(curt.horloge)
  UI.videoHorloge.html(curt.vhorloge)
  BancTimeline.setCursorByTime(curt)
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

  TODO Utiliser la TimeMap pour gérer l'actualisation des markers.
  Et cette méthode deviendra normalement obsolète si on a une méthode
  générale qui gère toutes les actualisations.
 */
actualizeMarkersStt(curt){
  // console.log("-> actualizeMarkersStt", curt)
  var vid = this.controller
  isDefined(curt) || ( curt = this.currentTime )
  isDefined(this.a.PFA.TimesTables) || this.a.PFA.setTimesTables()
  // On doit répéter pour les quatre tables, heureusement petites,
  // pour trouver :
  //  - la partie absolue
  //  - la partie relative (if any)
  //  - la zone absolue
  //  - la zone relative si elle existe
  // TODO
}

/**
  On renseigne la scène courante.

  Maintenant, cette méthode ne sert plus que lorsqu'on est à l'arrêt.

  @param {Float} curt  Le temps vidéo courant (donc pas le temps "réel")

 */
actualizeMarkScene(curt){
  log.info("-> actualizeMarkScene")
  delete FAEscene._current
  UI.markCurrentScene.html(FAEscene.current?FAEscene.current.asPitch().innerHTML:'---')
}

// ---------------------------------------------------------------------
// Méthodes d'état

get playAfterSettingTime(){
  return this.a.options.get('option_start_when_time_choosed')
}

}

Object.assign(Locator.prototype, LocatorGotoMethods)
