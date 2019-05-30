'use strict'
/**
 * Class OTime
 * -----------
 * Permet de gérer les temps

 Permet également de traiter un temps soit comme temps "réel" du film,
 c'est-à-dire pas comme le temps de la vidéo ou justement le temps de la vidéo
 grâce aux deux méthodes .rtime et .vtime
 */

class OTime {

/**
  Pour les associations
  Noter que c'est l'alias FATime qui est utilisé
**/
static get(time){
  return new OTime(time)
}

// Retourne une instance dont le temps est 0:00:00
static get ZERO(){return this._zero||defP(this,'_zero',new OTime(0))}

// Pour utiliser une instance OTime sans instancier un nouvel objet.
static vVary(time){
  isDefined(this._otimevar) || ( this._otimevar = new OTime(0) )
  this._otimevar.updateSeconds(time)
  return this._otimevar
}
static rVary(vtime){
  isDefined(this._otimevar) || ( this._otimevar = new OTime(0) )
  this._otimevar.rtime = vtime
  return this._otimevar
}
// ---------------------------------------------------------------------
// INSTANCE

as(format, flag, options){
  return this.asAssociate(options)
}

/**
 * Le temps est donné soit :
 *  - en nombre de secondes (Number) (ou string, attention)
 *  - en horloge (String)
 *  - en data (Object) avec :seconds, :duree
 *
 */
constructor(v){
  this.type = STRtime
  switch (typeof(v)) {
    case STRnumber:
      this.seconds = v
      break
    case STRstring:
      if (v.match(/^[0-9\.]+$/)){this.seconds = Math.round(v)}
      else {
        this.horloge = v
        this.seconds = this.h2s(v)
      }
      break
    case STRobject:
      if (v instanceof(OTime)){
        try {pourgenereuneerreur} catch (e) {
          console.error("On ne doit pas envoyer un OTime pour initialiser un OTime.")
          console.error(e)
        }
      }
      else {
        console.log("Le traitement par objet n'est pas encore implémenté")
      }
  }
}

reset(){
  delete this._toString
  delete this._rtime
  delete this._rhorloge
  delete this._rhorloge_simple
  delete this._horloge
  delete this._vhorloge
  delete this._horloge_simple
  delete this._vhorloge_simple
}

valueOf(){return this.seconds}
toString(){return this._toString || defP(this,'_toString', `le temps ${this.rhorloge_simple}`)}

// @return TRUE si le temps est entre les seconds +av+ et +ap+
between(av,ap){
  return this.seconds.between(av,ap)
}
get rtime(){ return this._rtime || defP(this, '_rtime', (this.seconds - current_analyse.filmStartTime).round(2)) }
set rtime(s){ this.updateSeconds(s + current_analyse.filmStartTime) }
get vtime(){ return this.seconds }
set vtime(s){ this.updateSeconds(s) }
/**
 * Permet d'actualiser le nombre de seconds de l'instance
 * Cette méthode est utile par exemple pour régler l'horloge de la vidéo,
 * pour ne pas créer intensivement des instances à chaque millisecondes
 */
updateSeconds(s){
  // console.log("s dans updateSeconds :",s)
  this.reset()
  this.seconds = s.round(2)
}

// horloge renvoie l'horloge relative, par rapport au début du film
get horloge()   {return this.rhorloge}
get rhorloge()  {return this._rhorloge || defP(this,'_rhorloge', this.s2h(this.rtime))}
get vhorloge()  {return this._vhorloge || defP(this,'_vhorloge', this.s2h(this.vtime))}
set horloge(v)  { this._horloge = v }
// Par défaut, l'horloge simple retourne l'horloge simple relative
// Pour avoir l'horloge de la vidéo, utiliser vhorloge_simple
get horloge_simple(){ return this.rhorloge_simple }
get rhorloge_simple(){
  isDefined(this._rhorloge_simple) || (
    this._rhorloge_simple = this.s2h(this.rtime, {no_frames: true})
  )
  return this._rhorloge_simple
}
get vhorloge_simple(){
  isDefined(this._vhorloge_simple) || (
    this._vhorloge_simple = this.s2h(this.vtime, {no_frames: true})
  )
  return this._vhorloge_simple
}

get horloge_as_duree(){return this.hduree}
get hduree(){return this.s2h(this.seconds,{as_duree: true, no_frames: true})}
get duree_sec(){ return Math.round(this.seconds) }

get id(){ return this.seconds } // pour les associations
/**
  Méthode qui permet de traiter les temps comme des events dans
  les associations. Pour afficher le temps courant et aussi pouvoir
  le dissocier de son élément propriétaire

  @param {Object} options  Des options (inutilisé ici pour le moment)

*/
asAssociate(opts){
  opts = opts || {}
  var dvs = []
  dvs.push(DCreate(A, {class:'lktime', inner: this.horloge_simple, attrs:{onclick:`showTime(${this.seconds})`}}))
  if(opts.owner){
    // Si les options définissent un owner, on ajoute un lien pour pouvoir
    // dissocier le temps de son possesseur
    dvs.push(this.dissociateLink({owner: opts.owner}))
  }
  return DCreate(SPAN, {class:'lktime', append: dvs})
}

set duree(v) { this.duree = v }
get duree()  { return this.duree || 1 }

get secondsInt() {
  return Math.round(this.seconds)
}
h2s(h){
  var d = h.split('.') // Séparer l'horloge de ses frames
  var frms = d.splice(1,1)[0] || 0
  h = d[0].split(/[,\:]/).reverse()
  var tps = 0
  tps =  frms * 40
  tps += parseInt(h[0]||0,10) * 1000
  tps += parseInt(h[1]||0,10) * 1000 * 60
  tps += parseInt(h[2]||0,10) * 1000 * 3600
  return tps / 1000
}
s2h(s, format){
  var r, hrs, mns, scs, frm ;
  s = s || this.seconds
  format = format || {}
  let isNegative = s < 0
  isNegative && ( s = -s )
  hrs = Math.floor(s / 3600)
  r = s - (hrs * 3600)
  mns = Math.floor(r / 60)
  if(!(format.as_duree && hrs == 0)){
    mns = mns > 9 ? mns : `0${mns}`
  }
  r = r - (mns * 60)
  scs = Math.floor(r)
  scs = scs > 9 ? scs : `0${scs}`
  frm = parseInt((r - scs) * 1000 / 40,10)
  frm = frm > 9 ? frm : `0${frm}`

  var hstr
  if(format.no_frames){
    hstr = `${mns}:${scs}`
  } else {
    hstr = `${mns}:${scs}.${frm}`
  }
  if(!format.as_duree){
    hstr = `${hrs}:${hstr}`
  }
  isNegative && ( hstr = `-${hstr}` )
  return hstr
}


}
const {
  ASSOCIATES_COMMON_METHODS
, ASSOCIATES_COMMON_PROPERTIES
} = require('./FA_associates.js')

Object.assign(OTime.prototype,ASSOCIATES_COMMON_METHODS)
Object.defineProperties(OTime.prototype,ASSOCIATES_COMMON_PROPERTIES)

module.exports = OTime
