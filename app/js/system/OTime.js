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
   * Le temps est donné soit :
   *  - en nombre de secondes (Number) (ou string, attention)
   *  - en horloge (String)
   *  - en data (Object) avec :seconds, :duree
   *
   */
  constructor(v){
    this.type = 'time'
    switch (typeof(v)) {
      case 'number':
        this.seconds = v
        break
      case 'string':
        if (v.match(/^[0-9\.]+$/)){this.seconds = Math.round(v)}
        else {
          this.horloge = v
          this.seconds = this.h2s(v)
        }
        break
      case 'object':
        if (v instanceof(OTime)){
          try {pourgenereuneerreur} catch (e) {
            console.error(e)
            console.error("On ne doit pas envoyer un OTime pour initialiser un OTime.")
          }
        }
        else {
          console.log("Le traitement par objet n'est pas encore implémenté")
        }
    }
  }

  valueOf(){return this.seconds}
  toString(){return this._toString || defP(this,'_toString', `le temps ${this.horloge_simple}`)}

  // @return TRUE si le temps est entre les seconds +av+ et +ap+
  between(av,ap){
    return this.seconds.between(av,ap)
  }
  get rtime(){ return this.seconds}
  set rtime(s){ this.updateSeconds(s.round(2))}
  get vtime(){ return this.seconds + current_analyse.filmStartTime}
  set vtime(s){ this.updateSeconds((s - current_analyse.filmStartTime).round(2))}


  set horloge(v)  { this._horloge = v }
  get horloge()   {return this._horloge || defP(this,'_horloge', this.s2h())}
  get horloge_simple(){
    if(undefined === this._horloge_simple){
      this._horloge_simple = this.s2h(this.secondsInt, {no_frames: true})
    }
    return this._horloge_simple
  }
  get horloge_as_duree(){return this.hduree}
  get hduree(){return this.s2h(this.seconds,{as_duree: true, no_frames: true})}
  get duree_sec(){ return Math.round(this.seconds) }


/**
  Méthode qui permet de traiter les temps comme des events dans
  les associations. Pour afficher le temps courant et aussi pouvoir
  le dissocier de son élément propriétaire

  @param {Object} options  Des options (inutilisé ici pour le moment)

*/
asAssociate(options){
  if(undefined === options) options = {}
  var dvs = []
  dvs.push(DCreate('A', {class:'lktime', inner: this.horloge_simple, attrs:{onclick:`showTime(${this.seconds})`}}))
  if(options.owner){
    // Si les options définissent un owner, on ajoute un lien pour pouvoir
    // dissocier le temps de son possesseur
    dvs.push(DCreate('A',{class:'lkdiss', inner: '[dissocier]', attrs:{onclick:`FAEvent.dissocier.bind(FAEvent)({owned:{type:'time', id:${this.seconds}}, owner:{type:'${options.owner.type}', id:${options.owner.id}}})`}}))
  }
  return DCreate('SPAN', {class:'lktime', append: dvs})
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
  if(undefined===format) format = {}
  var r, hrs, mns, scs, frm ;
  if(undefined==s){s = this.seconds}
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
  return hstr
}

/**
 * Permet d'actualiser le nombre de seconds de l'instance
 * Cette méthode est utile par exemple pour régler l'horloge de la vidéo,
 * pour ne pas créer intensivement des instances à chaque millisecondes
 */
updateSeconds(s){
  delete this._toString
  this.seconds = s
  this.horloge = this.s2h(s)
}


}
