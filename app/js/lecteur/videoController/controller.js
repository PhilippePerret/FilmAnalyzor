'use strict'
/**
  Extension pour l'instance videoController de l'analyse
  Méthode qui gère le contrôleur vidéo, les rembobinages, avancée, etc.
**/
module.exports = {
methods:{
  stop(){
    this.loc.playing && this.loc.togglePlay()
  }
/**
 * Méthode pour rembobiner au début du film (si on est après et qu'il est
 * défini) ou au début de la vidéo
 *
 * Note : le -5 ci-dessous permet de cliquer deux fois sur le bouton pour
 * revenir tout au début (sinon, on revient toujours au début défini du
 * film)
 */
, stopAndRewind(){
    var curOTime = this.loc.currentTime // {OTime}
    var newOTime = new OTime(0)

    // Si le film jouait, on doit l'arrêter
    if(this.loc.playing) this.loc.togglePlay()

    if (curOTime > this.loc.lastStartTime) { // instances {OTime}
      // <= Le temps courant est supérieur au dernier temps de départ
      // => on revient au dernier temps de départ
      newOTime.rtime = this.loc.lastStartTime.seconds
    } else if (this.a.filmStartTime && curOTime > (this.a.filmStartTime + 5)){
      // <= le temps courant est au-delà des 5 secondes après le début du film
      // => On revient au début du film
      newOTime.rtime = 0
    } else {
      // Sinon, on revient au début de la vidéo
      newOTime.vtime = 0
    }
    this.loc.setTime(newOTime)
  }


/**
  TROIS MÉTHODES pour gérer le rewind

  Méthode appelée par les boutons pour rembobiner ou avancer, quand
  on tient dessus.
  Elle doivent être utilisées avec les méthode `stop` correspondantes
  pour stoper l'avance ou le recul.
**/
, startRewind(sec){
    this.timerRewind = setInterval(() => {this.rewind(sec)}, 100)
  }
  /**
   * Méthode pour rembobiner de +secs+ seconds (on continue de jouer si
   * on jouait, ou alors on remet en route)
   */
, rewind(secs){
    // console.log("-> rewind")
    var newtime = UI.video.currentTime - secs
    if(newtime < 0){
      newtime = 0
      if(this.timerRewind) this.stopRewind()
    }
    let ontime = new OTime(0)
    ontime.vtime = newtime
    this.loc.setTime(ontime)
  }
, stopRewind(){
    clearInterval(this.timerRewind)
    delete this.timerRewind
  }

/**
  TROIS MÉTHODES pour gérer le forward
**/
, startForward(sec){
    this.timerForward = setInterval(()=>{this.forward(sec)}, 100)
  }

, forward(secs){
    // console.log("-> forward")
    var newtime = UI.video.currentTime + secs
    if(newtime > UI.video.duration){
      this.timerForward && this.stopForward()
      return
    }
    let ontime = new OTime(0)
    ontime.vtime = newtime
    this.loc.setTime(ontime)
  }
, stopForward(){
    clearInterval(this.timerForward)
    delete this.timerForward
  }

// // Réglage du bouton PLAY en fonction de +running+ (qui est locator.playing)
// // NOTE : il n'y a plus de bouton de contrôle (tout-clavier)
// , setPlayButton(running){
//     this.btnPlay.innerHTML = running ? this.imgPauser : this.imgPlay
//   }

}// /methods

/**
  DÉFINITION DES PROPRIÉTÉS
**/
, properties:{

  imgPauser:{get(){return '<img src="./img/btns-controller/btn-pause.png" />'}}
, imgPlay:{get(){return '<img src="./img/btns-controller/btn-play.png" />'}}

}
}// /Object.assign
