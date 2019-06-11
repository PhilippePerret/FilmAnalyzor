'use strict'

class FAEscene extends FAEvent {
// ---------------------------------------------------------------------
//  CLASSE

// Les propriétés propres aux instances (constante de classe)
static get OWN_PROPS(){return [STRnumero, [STRdecor, 'shorttext1'], ['sous_decor', 'shorttext2'],'lieu','effet','sceneType']}
static get OWN_TEXT_PROPS(){ return [STRdecor, 'sous_decor']}
static get TEXT_PROPERTIES(){return this._tprops||defP(this,'_tprops',FAEvent.tProps(this.OWN_TEXT_PROPS))}

/**
 * Initialisation de la classe. Par exemple lorsque l'on change
 * d'analyse sans recharger l'application
 */
static init(analyse){
  this.analyse = this.a = analyse || current_analyse
  this.reset()
}

/**
  Méthode appelée systématiquement après la création ou la modification
  d'une scène, pour actualiser les numéros et les durées de toutes les
  scènes.
**/
static updateAll(){
  log.info("-> FAEscene::updateAll")
  this.reset()

  // On actualise la map par secondes
  TimeMap.update()

  // this.updateNumerosScenes() // sera automatiquement affecté en updatant les listes
  // this.updateDureeScenes() // sera automatiquement redéfini en updatant les listes
  this.a.modified = true

  log.info("<- FAEscene::updateAll")
}

static reset(){
  delete this._by_time
  delete this._by_id
  delete this._by_numero
  delete this._sortedByTime
  delete this._sortedByDuree
  delete this._count
  delete this._current
  delete this._klisting
}

/**
  Conserve la scène courante, c'est-à-dire la scène
  affichée à l'écran si elle existe.
  @returns {FAEscene} La scène courante dans le film visionné
**/
static get current(){return this._current||defP(this,'_current',this.getCurrent())}
// static set current(s){
//   if(s instanceof(FAEscene)) log.info(`Scène courante de FAEscene mise à ${s} (${s.numero})`)
//   this._current = s
//   s && this.a.locator.actualizeMarkScene(s)
// }
static getCurrent(){
  if (this.count === 0) return
  return this.at(this.a.locator.currentTime)
}

/**
  @returns {Number} Le nombre de scènes du film
**/
static get count(){return this._count||defP(this,'_count', Object.keys(this.scenes).length)}

// ---------------------------------------------------------------------
//  Les méthodes de récupération d'une scène

/**
  Retourne l'instance de scène de numéro +numero+ (l'instancie if needed)
  @param    {Number}  numero Le numéro de la scène à retourner
  @returns  {FAEscene} La scène de numéro +numero+
 */
static get(numero)      {return this.scenes[numero]}

/**
  Retoune la scène ayant l'ID +event_id+ (en ne perdant pas de vue que
  la scène est un event elle-même, à partir de la version 0.5 de l'application)

  @param    {Number}  event_id    ID de l'event de la scène
            Rappel : une scène, c'est aussi un event de class {FAEscene}
  @returns  {FAEscene} La scène d'event_id +event_id+
**/
static getById(event_id){return this.byId[event_id]}

/**
  Retourne la scène se trouvant exactement au temps +time+

  @param    {Float}   time    Le temps donné
  @returns  {FAEscene} La scène au temps +time+
**/
static getByTime(time)  {return this.byTime[time]}

static getByNumero(num){
  // console.log('[FAEscene] Je dois retourner la scène numéro', num)
  return this.byNumero[num]
}

// ---------------------------------------------------------------------
//  Les listes de scènes

/**
  La KWindow affichant les scènes pour les choisir et s'y rendre
**/
static get klisting(){return this._klisting || defP(this,'_klisting', this.defineKWindow())}
static defineKWindow(){
  return new KWindow(this, {
      id: 'scenes-list'
    , title: 'Se rendre à la scène…'
    , onChoose: this.goToSceneByNumero.bind(this)
    , items: this.scenesAsValueTitle()
  })
}
/**
  Méthode permettant de se rendre à la scène de numéro +numero+
  NOte : utilisé par la KWindow présentant la liste des scènes.
**/
static goToSceneByNumero(numero){
  this.a.locator.setTime(this.getByNumero(numero).otime)
}
/**
  Retourne la liste des scènes sous forme de listes de [clé, valeur] pour
  la KWindow
**/
static scenesAsValueTitle(){
  var arr = []
  this.forEachSortedScene( sc => arr.push([sc.numero, sc.pitch]))
  return arr
}

/**
  Retourne la table des scènes
  C'est un Hash avec en clé le numéro de la scène et en
  valeur l'instance FAEscene.
**/
static get scenes(){return this.byNumero}
// La méme, mais avec en clé l'ID de l'event de scène
static get byNumero(){return this._by_numero||defP(this,'_by_numero',this.doLists().numero)}
static get byId(){return this._by_id||defP(this,'_by_id',this.doLists().id)}
static get byTime(){return this._by_time||defP(this,'_by_time',this.doLists().time)}
static get sortedByTime(){return this._sortedByTime||defP(this,'_sortedByTime',this.doLists().sorted)}
static get sortedByDuree(){return this._sortedByDuree||defP(this,'_sortedByDuree', this.doLists().sorted_duree)}

static get dataDecors(){return FADecor.data}
static get decorsCount(){return FADecor.count}
/**
  Private méthode qui établit toutes les listes à savoir :
    FAEscene.byId      Hash avec en clé l'id de l'event
    FAEscene.byNumero  Hash avec en clé le numéro de la scène
    FAEscene.byTime    Array des scènes classées par temps
**/
static doLists(){
  let fe = new EventsFilter(this, {filter: {eventTypes:[STRscene]}})
    , _by_id          = {}
    , _by_numero      = {}
    , _by_time        = {}
    , _sortedByTime   = []
    , _sortedByDuree  = []

  fe.forEachFiltered(function(ev){
    if(ev.isGenerique) return
    _by_id[ev.id] = ev
    _by_time[ev.time] = ev
  })

  _sortedByTime = Object.assign([], Object.values(_by_id))
  _sortedByTime.sort(function(a, b){return a.time - b.time})
  // console.log("_sortedByTime", _sortedByTime)

  // On peut affecter les numéros de scènes et définir la liste
  // par numéro
  var num = 0, oldNum
  for(var sc of _sortedByTime){
    oldNum = parseInt(sc.numero,10)
    sc.numero = ++ num
    _by_numero[sc.numero] = sc
    sc.updateNumero()
    if (oldNum != num) sc.modified = true
  }

  // Avant de classer par durée, il faut corriger les durées
  if(this.a.options.get('option_duree_scene_auto')){
    var sc, prev_sc
    for(var isc in _sortedByTime){
      sc = _sortedByTime[isc]
      if(sc.numero > 1){
        prev_sc = _sortedByTime[isc - 1]
        prev_sc.duree = sc.time - prev_sc.time // arrondi plus tard
      }
    }
  }


  _sortedByDuree = Object.assign([], Object.values(_by_id))
  _sortedByDuree.sort(function(a, b){return b.duree - a.duree})

  this._by_id         = _by_id
  this._by_numero     = _by_numero
  this._by_time       = _by_time
  this._sortedByTime  = _sortedByTime
  this._sortedByDuree = _sortedByDuree

  _by_id = _by_numero = _by_time = _sortedByTime = null
  let res = {id: this._by_id, numero: this._by_numero, time: this._by_time, sorted: this._sortedByTime, sorted_duree: this._sortedByDuree}
  // console.log("LISTES:", res)
  return res
}

/**
  Détruit la scène de numéro +numero+
**/
static destroy(numero){
  if ( isUndefined(this.scenes[numero]) ) return
  delete this.scenes[numero]
  this.updateAll()
}

/**
  Boucle sur toutes les scènes
  On peut l'interrompre en faisant renvoyer false (et strictement
  false) à la fonction +fn+
**/
static forEachScene(fn){
  for(var num in this.scenes){
    if( isFalse(fn(this.scenes[num])) ) break // pour pouvoir interrompre
  }
}

/**
  Boucle sur chaque scène triée par temps
**/
static forEachSortedScene(fn){
  for(var scene of this.sortedByTime){
    // console.log("Boucle avec scène:", scene)
    if ( isFalse(fn(scene)) ) break // pour pouvoir interrompre
  }
}

/**
  Retourne l'instance FAEscene de la scène au temps +time+

  @param   {OTime} time  Le temps à considérer
  @returns {FAEscene|Undefined}  La scène ou undefined si pas de scène
 */
static at(otime){
  return TimeMap.sceneAt(otime)
}

// Retourne la scène qui commence avant le temps otime (ou rien)
static before(otime){
  return TimeMap.sceneBefore(otime)
}

// Retourne la scène qui commence après le temps otime (ou rien)
static after(otime){
  return TimeMap.sceneAfter(otime)
}

/**
  @returns {FAEscene} La dernière scène (ou undefined si inexistante)
**/
static get firstScene(){
  return this.sortedByTime[0]
}
static get lastScene(){
  return this.sortedByTime[this.count-1]
}

// ---------------------------------------------------------------------
//  INSTANCE

constructor(analyse, data){
  super(analyse, data)
}

// ---------------------------------------------------------------------
//  HELPERS

get hduree(){return this._hduree||defP(this,'_hduree', new OTime(this.duree).hduree)}


// ---------------------------------------------------------------------
//  MÉTHODES DE DONNÉES

get pitch(){return this.titre}
get resume(){return this.content || '--non défini--'}
get description(){
  console.error("DEPRECATED Il ne faut pas utiliser 'description', pour une scène, mais 'resume'")
  return this.content || '--non défini--'
} // TODO Remplacer par resume

// ---------------------------------------------------------------------
//  MÉTHODES D'ÉTAT

get isScene(){return true} // surclasse la méthode de FAEvent
get isAScene(){return true}
/**
 * Méthode qui retourne true si l'évènement est valide (en fonction de son
 * type) et false dans le cas contraire.
 */
get isValid(){
  var errors = []

  this.numero  || errors.push({msg:"Le numéro de la scène devrait être défini.", prop: 'numero'})
  this.titre   || errors.push({msg:"Le pitch doit être défini.", prop:'titre'})
  this.content || errors.push({msg:"Le résumé de la scène est indispensable.", prop:'longtext1'})

  if(errors.length){super.onErrors(this, errors)}
  return errors.length == 0
}

// ---------------------------------------------------------------------
//  MÉTHODES FONCTIONNELLES

reset(){
  super.reset()
  delete this._pitch
  delete this._numero
  delete this._hduree
  delete this._formated
  delete this._numeroFormated
}

// Méthode appelée après la création de la nouvelle scène
onCreate(){
  this.checkForDecor()
}
// Méthode appelée après la modification de la scène
onModify(){
  this.checkForDecor()
}

// Pour vérifier si c'est un nouveau décor
checkForDecor(){
  if(this.decor){
    if ( isUndefined(FADecor.data[this.decor]) ) {
      FADecor.resetAll()
    } else if (this.sous_decor && undefined === FADecor.data[this.decor].sousDecor(this.sous_decor)){
      FADecor.data[this.decor].reset()
      FADecor.resetAll()
    }
  }
}

/**
 * Actualisation du numéro de scène
 *
 * Noter que ça le change partout dans l'interface, si le numéro de scène
 * est bien formaté
 */
updateNumero(){
  $(`.numero-scene[data-id="${this.id}"]`).html(this.numero)
}

get isRealScene(){return this.sceneType !== STRgeneric}
get isGenerique(){return this.sceneType === STRgeneric}

} // Fin de FAEscene
