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
  data:{
    get(){
      var spoints
      if(this.locator){
        spoints = (this.locator.stop_points||[]).map(sp => sp.seconds)
      } else { spoints = []}
      return {
          folder:             this.folder
        , title:              this.title
        , version:            this.version
        , locked:             !!this.locked
        , filmStartTime:      this.filmStartTime
        , filmEndTime:        this.filmEndTime
        , filmEndGenericFin:  this.filmEndGenericFin
        , videoPath:          this.videoPath
        , lastCurrentTime:    this.lastCurrentTime
        , stopPoints:         spoints
      }
    }
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

, modified:{
    get(){ return this._modified }
  , set(v){
      this._modified = v
      this.markModified[v ? 'addClass':'removeClass']('on')
    }
  }

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
  , set(v){ this._filmStTi = v ; this.duree = undefined }
  }

, filmEndTime:{
    get(){return this._filmEndTime || defP(this,'_filmEndTime',this.calcFilmEndTime())}
  , set(v){ this._filmEndTime = v ; this.duree = undefined }
}

, filmEndGenericFin:{
    get(){return this._filmEGF}
  , set(v){this._filmEGF = v ; this.modified = true }
  }

, lastCurrentTime:{
    get(){return this._lastCurT||defP(this,'_lastCurT',this.locator ? this.locator.getTime().seconds: 0)}
  , set(v){this._lastCurT = v}
  }
, lastCurrentOTime:{
    get(){return this._lastCurOTime||defP(this,'_lastCurOTime',new OTime(this.lastCurrentTime))}
  , set(v){
      v instanceof(OTime)||raise(T('otime-arg-required'))
      this._lastCurOTime = v
      this._lastCurT = v.seconds
    }
  }

})



Object.assign(FAnalyse.prototype, {

  calcDuration(){
    if(!this.filmEndTime) return null
    return this.filmEndTime - this.filmStartTime
  }

, calcFilmEndTime(){
    var endt = null
    if(this.videoPath){
      this._filmEndTime = this.videoController.video.duration
      endt = this._filmEndTime
    }
    return endt
  }

})
