'use strict'

// ---------------------------------------------------------------------
//  CLASS

/**
  Méthode de classe qui charge l'analyse dont le dossier est +aFolder+
  et en fait l'analyse courante.
 */
FAnalyse.classMethod = function(){
  // ... Code
}

// ---------------------------------------------------------------------
//  INSTANCE

Object.defineProperties(FAnalyse.prototype,{
  reader:{get(){return this._reader || defP(this,'_reader', new FAReader(this))}}
, locator:{get(){return this._locator || defP(this,'_locator', new Locator(this))}}
, videoController:{get(){return this._videoctrl || defP(this,'_videoctrl', new VideoController(this))}}
  // LES DONNÉES (I/O)
, data:{
    get(){
      var spoints
      if(this.locator){
        spoints = (this.locator.stop_points||[]).map(sp => sp.seconds)
      } else { spoints = []}
      delete this._lastCurT // pour actualiser le dernier temps
      return {
          folder:             this.folder
        , title:              this.title
        , version:            this.version
        , locked:             !!this.locked
        , filmStartTime:      this.filmStartTime
        , filmEndTime:        this.filmEndTime
        , filmEndGenericFin:  this.filmEndGenericFin
        , videoPath:          this.videoPath // this.videoPathAsRelative
        , lastCurrentTime:    this.lastCurrentTime
        , stopPoints:         spoints
      }
    }
  /**
    Méthode appelée au chargement de l'analyse, pour dispatcher
    ses données.
  **/
  , set(v){
      this.title                = v.title
      this.version              = v.version
      this.locked               = !!v.locked || false
      this.filmStartTime        = v.filmStartTime || 0
      this.filmEndTime          = v.filmEndTime
      this.filmEndGenericFin    = v.filmEndGenericFin
      this._videoPath           = v.videoPath
      this.lastCurrentTime      = v.lastCurrentTime || 0
      this.stopPoints           = (v.stopPoints || []).map(st => new OTime(st))
    }
  }

, DFILES:{get(){
    isDefined(this._dfiles) || (
      this._dfiles = [
          {type: 'events', path: this.eventsFilePath, dataMethod: 'eventsIO', iofile:this.iofileEvent}
        , {type: 'data',   path: this.dataFilePath,   dataMethod: 'data', iofile: this.iofileData}
      ]
    )
    return this._dfiles
  }}

, modified:{
    get(){ return this._modified }
  , set(v){
      this._modified = v
      this.markModified[v ? 'addClass':'removeClass']('on')
    }
  }

/**
  Si la vidéo est contenu dans le dossier, on enregistre son path
  relatif. L'avantage, c'est que le dossier peut être alors déplacé
  sans problème.
**/
, videoPathAsRelative:{get(){
    if(!this.videoPath) return
    let reg = new RegExp(`^${this.folder}`)
    return this.videoPath.replace(reg, '.')
  }}
, title: {
    get(){return this._title || defP(this,'_title', path.basename(this.folder))}
  , set(v){this._title = v ; this.modified = true}
  }

, version: {
    get(){return this._version || defP(this,'_version', '0.0.1')}
  , set(v){this._version = v ; this.modified = true}
  }

, filmId:{get(){return this._filmId||defP(this,'_filmId',this.title.camelize())}}

// ---------------------------------------------------------------------
//  Les données temporelles

, duree:{
    // avant de le calculer vraiment :
    get(){ return this._duree || defP(this,'_duree', this.calcDuration()) }
  , set(v){ this._duree = v ; this.modified = true }
  }

, filmStartTime:{
    get() {return this._filmStTi || defP(this,'_filmStTi', 0)}
  , set(v){
      this._filmStTi = v
      delete this._duree
    }
  }

, filmEndTime:{
    get(){return this._filmEndTime || defP(this,'_filmEndTime',this.calcFilmEndTime())}
  , set(v){
      this._filmEndTime = v
      delete this._duree
    }
}

, filmEndGenericFin:{
    get(){return this._filmEGF}
  , set(v){this._filmEGF = v ; this.modified = true }
  }

, lastCurrentTime:{
    get(){return this._lastCurT||defP(this,'_lastCurT',this.locator?this.locator.currentTime.vtime: 0)}
  , set(v){this._lastCurT = v}
  }

})

Object.assign(FAnalyse.prototype, {

  calcDuration(){
    // Note : filmEndTime essaie déjà d'être défini en prenant
    // la fin de la vidéo. Mais si la vidéo n'est pas définie,
    // filmEndTime ne l'est pas non plus.
    if ( isNaN(UI.video.duration) ) {
      console.error("Problème avec la vidéo : sa durée est NaN…")
    }
    return (this.filmEndTime||UI.video.duration) - this.filmStartTime
  }

, calcFilmEndTime(){
    delete this._filmEndTime
    this.videoPath && (this._filmEndTime = UI.video.duration)
    return this._filmEndTime
  }

})
