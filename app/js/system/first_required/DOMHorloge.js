'use strict'
/**
  * Class DOMHorloge et DOMDuration
  * -------------------
  * Pour la gestion des horloges
  *
  * @usage
  *   - On place un élément <horloge id="..."></horloge> dans la page
  *   - On l'instancie avec var horloge = new DOMHorloge(<dom element>[, <options>])
  *   Et ensuite on peut utiliser tout un tas de fonction pratiques à commencer
  *   par horloge.showTime([<time>]) pour définir le temps à afficher.
  *
  * Si l'horloge appartient à un parent modifiable, par exemple un formulaire,
  * on peut définir ce parent qui sera lui aussi marqué modified si l'horloge
  * l'est.
  *   var ih = new DOMHorloge(el)
  *   ih.parentModifiable = theInstanceParent
  *
  * Si l'horloge doit suivre la vidéo courante (propre à l'application
  * Film-Analyzer), on l'indique par :
  *   ih.synchroVideo = true
  *
  * Les styles de l'horloge sont définis dans DOMHorloge.css
  */

class DOMHorloge {
// CLASSE

/**
  Prend un temps quelconque exprimé en horloge, en opération, en chiffres et
  virgules et retourne le nombre de secondes correspondant.
**/
static string2seconds(str){
  var members, n, m, frs
  // On commence par supprimer tous les espaces
  // console.log(`Traitement de : ${str}`)
  str = str.trim().replace(/ /g,'')
  // Le formatage doit être bon
  if ( str.replace(/[0-9\*\.\,\/\+\-\(\)]/g,'') !== '' ) raise("Le nombre fourni est mal formaté.")
  if ( str.match(/^[0-9]+$/) ) return parseFloat(str)
  // var members = str.split(',')
  str = str.replace(/\(([^)]+)\)/g, (tout, groupe) => {
    return this.string2seconds(groupe)
  })

  if ( str.match(/,/) ) {
    // console.log("Str avec virgule : ", str)
    members = str.split(',')
    if ( members[members.length-1].match(/\./) ) {
      [m, frs] = members[members.length-1].split('.')
      members[members.length-1] = m
      frs = (parseInt(frs,10) * 100/24) / 100 // 24 -> 100  => 1 = 100/24
    } else {
      // Pas de frames
      frs = 0
    }
    for(var i = 0, len = members.length; i < len ; ++i){
      // console.log("Traitement de ", members[i], typeof(members[i]))
      members[i] = this.string2seconds(members[i])
      // console.log("Résultat ", members[i], typeof(members[i]))
    }
    members.reverse()
    // console.log("members:", members)
    n = Math.round(members[0] + (members[1]||0) * 60 + (members[2]||0) * 3600) + frs
    // console.log("n final:", n)
    return n
  } else if ( str.match(/\./) ) {
    // <= le string contient un point mais pas de virgule, comme dans 20.12
    members = str.split('.')
    frs = (parseInt(members.pop(),10) * 100/24) / 100 // 24 -> 100  => 1 = 100/24
    n = 0
    members.map( m => n += this.string2seconds(m))
    return n + frs
  }

  if ( str.match(/\*/) ) {
    // console.log("Str contient *")
    members = str.split('*').map(m => this.string2seconds(m) )
    n = 1
    members.forEach(m => n = n * m )
    // console.log("[*] n = ", n)
    return n
  } else if ( str.match(/\//) ) {
    // console.log("Str contient /")
    members = str.split('/').map(m => this.string2seconds(m) )
    n = members.shift()
    members.forEach(m => n = n / m )
    // console.log("[/] n = ", n)
    return n
  } else if ( str.match(/\+/) ) {
    // console.log("Str contient +")
    members = str.split('+').map(m => this.string2seconds(m) )
    n = 0
    members.forEach(m => n += m )
    // console.log("n = ", n)
    return n
  } else if ( str.match(/\-/) ) {
    // console.log("Str contient -")
    members = str.split('-').map(m => this.string2seconds(m) )
    n = 0
    members.forEach(m => n -= m )
    // console.log("n = ", n)
    return n
  }
  return parseFloat(str)
}

// INSTANCE
  constructor(domElement){
    this.domObj = domElement

    // Valeurs par défaut
    this.synchroVideo     = false
    this.parentModifiable = undefined
  }

  // ID de l'horloge = ID du DomElement
  get id(){return this._id || defP(this,'_id', this.domObj.id)}
  get time(){return this._time || 0}
  set time(v){
    // console.log("-> set time", v, this.domObj)
    this._time = v
    this.domObj.setAttribute('value', v)
    this._otime = undefined
    if(undefined === this._initTime) this.initTime = this.otime.seconds
  }
  get modified(){return this._modified || false}
  set modified(v){
    this._modified = v
    if(v && this.parentModifiable) this.parentModifiable.modified = true
    if(!this.unmodifiable) this.jqObj[v?'addClass':'removeClass']('modified')
  }

  get unmodifiable(){return this._unmodifiable || false}
  set unmodifiable(v){this._unmodifiable = v}
  get jqObj(){return this._jqObj || defP(this,'_jqObj', $(this.domObj))}
  get otime(){return this._otime || defP(this,'_otime', new OTime(this.time))}

  get initTime(){return this._initTime}
  set initTime(v){this._initTime = v}

  // L'horloge à afficher
  // Sera surclassé pour la durée
  get horloge(){return this.otime.horloge}

  // ---------------------------------------------------------------------
  //  Méthodes d'action

  showTime(){ this.domObj.innerHTML = this.horloge }

  reset(){
    this.time = this.initTime
    this.showTime()
    if(this.synchroVideo) current_analyse.locator.setTime(this.otime)
    this.modified = false
    return this // chainage
  }

  /**
   * Dispatcher les données +data+ dans l'instance
   */
  dispatch(data){
    for(var p in data){this[p] = data[p]}
    return this // chainage
  }

  // ---------------------------------------------------------------------
  //  Méthodes d'évènements

  // Note : maintenant, cette méthode ne sert plus que pour les horloges, pas
  // les durée, qui ont leur propre traitement
  observe(){
    this.domObj.addEventListener(STRmousedown, this.onActivateEdition.bind(this))
  }

  onActivateEdition(ev){
    $(STRbody).unbind(STRmouseup) // au cas où
    $(STRbody).bind(STRmouseup, this.onEndMoving.bind(this))
    $(STRbody).bind(STRmousemove, this.onMoving.bind(this))
    // console.log(ev)
    this.initStartMoving(ev, this.time)
    // console.log("this.movingStartTime=",this.movingStartTime)
    ev.stopPropagation() // pour empêcher de draguer la fenêtre
  }

  initStartMoving(ev, time){
    this.startMoveX = ev.clientX
    this.startMoveY = ev.clientY
    this.movingStartTime  = parseFloat(time)
  }
  /**
   * Méthode appelée au déplacement de souris (sur le body)
   */
  onMoving(ev){
    this.moveX = ev.clientX
    var divisor = function(e){
      if (e.shiftKey){
        if(e.metaKey) return 0.1
        else return 10
      } else if(e.ctrlKey) return 1000
      else return 50
    }(ev)
    var newCombKeys = 0
    if(ev.shiftKey) newCombKeys += 1
    if(ev.metaKey)  newCombKeys += 2
    if(ev.ctrlKey)  newCombKeys += 4
    if(newCombKeys != this.currentCombKeys){
      // console.log("Changement de combinaisons de touches:", newCombKeys, this.currentCombKeys)
      this.initStartMoving(ev, this.time)
    }
    this.currentCombKeys = newCombKeys
    this.time = this.movingStartTime + ((this.moveX - this.startMoveX) / divisor)
    this.showTime()
    if(this.synchroVideo) this.synchronizeVideo()
  }
  // Surclassé pour la class DOMDuration
  synchronizeVideo(){
    current_analyse.locator.setTime(this.otime)
  }
  onEndMoving(ev){
    // console.log(ev)
    this.endMoveX = ev.clientX
    this.endMoveY = ev.clientY
    if (this.startMoveX == this.endMoveX){
      this.reset()
    } else {
      this.modified = true
    }
    $(STRbody).unbind('mouseup') // au cas om
    $(STRbody).unbind('mousemove') // au cas om
    ev.stopPropagation() // pour être cohérent ?
  }

}

/**
 * Presque identique à DOMHorloge, mais pour la gestion de la durée
 *
 * this.time, ici, correspond au temps de fin (endTime), c'est le temps
 * qu'on fait varier
 */
class DOMDuration extends DOMHorloge {
  constructor(domEl){
    super(domEl)
  }

/**
  Méthode d'observation propre
**/
observe(){
  this.domObj.addEventListener(STRclick, this.onActivateEdition.bind(this))
}
onActivateEdition(){
  prompt({
      message: 'Nouvelle durée :'
    , defaultAnswer: this.duree
    , methodOnOK: this.changeDuree.bind(this)
    , helper: 'On peut utiliser les opérations ("2 * 60", "(30 + 12).2" pour 30 + 12 secondes et 2 frames) ou les virgules ("1,20,3.12" pour "une heure, vingt minutes, 3 secondes et 12 frames")'
  })
}
changeDuree(newDuree){
  try {
    let dureeSecond = DOMHorloge.string2seconds(newDuree)
    if ( isDefined(dureeSecond) && dureeSecond != this.duree ) {
      // TODO Il faut vérifier que la durée ne dépasse pas la fin du film
      if ( this.startTime + dureeSecond > current_analyse.duree ) raise("Durée trop longue. Elle déborde de la fin du film.")
      this.duree = dureeSecond
      this.modified = true
    }
  } catch (e) {
    F.notify(e, {error:true})
  }

}

  get startTime(){ return this._startTime }
  set startTime(v){ this._startTime = v }

  // Le temps de fin est toujours calculé en direct
  // C'est lui qui est affiché lorsqu'on change la durée à l'aide de la souris
  get endTime(){ return this.startTime + this.time }

  get duree(){
    return parseFloat(this.domObj.getAttribute(STRvalue))
  }
  set duree(v){
    // console.log("-> set duree", v)
    v = v.round(2)
    this._endTime = this.startTime + v
    this.domObj.setAttribute(STRvalue, v)
    this._duree = v
    this.showTime()
  }

  // Surclasse la méthode principale
  set time(v){
    // console.log("-> set time (Durationable)", v, this.domObj)
    if(v <= 0 || undefined === v) return
    this.duree = v
  }
  get time(){return this.duree}

  get otime(){return new OTime(this.duree)}

  get horloge(){return this.otime.horloge_as_duree}

  // Surclassé pour la class DOMDuration
  synchronizeVideo(){
    current_analyse.locator.setTime(this.oEndTime())
  }
  oEndTime(){
    if(undefined === this._oendtime) this._oendtime = new OTime(this.endTime)
    this._oendtime.rtime = this.endTime
    return this._oendtime
  }
}

module.exports = {
  DOMHorloge:   DOMHorloge
, DOMDuration:  DOMDuration
}
