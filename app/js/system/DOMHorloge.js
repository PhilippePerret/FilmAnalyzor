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

  observe(){
    this.domObj.addEventListener('mousedown', this.onActivateEdition.bind(this))
  }

  onActivateEdition(ev){
    $('body').unbind('mouseup') // au cas où
    $('body').bind('mouseup', this.onEndMoving.bind(this))
    $('body').bind('mousemove', this.onMoving.bind(this))
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
    $('body').unbind('mouseup') // au cas om
    $('body').unbind('mousemove') // au cas om
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

  get startTime(){ return this._startTime }
  set startTime(v){ this._startTime = v }

  // Le temps de fin est toujours calculé en direct
  // C'est lui qui est affiché lorsqu'on change la durée à l'aide de la souris
  get endTime(){ return this.startTime + this.time }

  get duree(){
    if(undefined === this._duree){
      this._duree = parseFloat(this.domObj.getAttribute('value'))
    }
    return this._duree
  }
  set duree(v){
    // console.log("-> set duree", v)
    v = v.round(2)
    this._endTime = this.startTime + v
    this.domObj.setAttribute('value', v)
    this._duree = v
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
