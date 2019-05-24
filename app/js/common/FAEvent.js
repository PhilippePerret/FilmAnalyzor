'use strict'

class FAEvent {
// ---------------------------------------------------------------------
//  CLASSE

static get OWN_PROPS(){return ['id', 'type', 'titre', STRtime, 'duree', 'parent', 'curimage', ['content', 'longtext1'], 'associates']}
static get TEXT_PROPERTIES(){return ['titre', 'content']}

static get ALL_PROPS(){
  if(isUndefined(this._all_props)){
    var arr = []
    arr.push(...FAEvent.OWN_PROPS)
    arr.push(...this.OWN_PROPS)
    this._all_props = arr
    arr = null
    // console.log("this.type, ALL_PROPS", this.type, this._all_props)
  }
  return this._all_props
}

/**
  @return {Instance} L'instance d'identifiant event_id
**/
static get(event_id){
  return this.a.ids[parseInt(event_id,10)]
}

/**
  Méthode qui reçoit les données (enregistrées) d'un event et le
  retourne comme classe de son type.
  La méthode sert lors de la lecture du fichier events.json
**/
static instanceOf(edata){
  // var eClass = eval(`FAE${eventData.type}`)
  // var ev = new eClass(current_analyse, edata)

  return new (eval(`FAE${edata.type}`))(current_analyse, edata)
}

/**
  Pour mettre l'event +event_id+ en édition

  Se souvenir aussi que cette méthode est appelée par le "+" dans les
  boite de listing de FAListing. Dans ce cas-là, +event_id+ est indéfini

**/
static edit(event_id){
  var typeOrInstance = isDefined(event_id) ? this.get(event_id) : this.type
  console.log("typeOrInstance:",typeOrInstance)
  return EventForm.editEvent.bind(EventForm, typeOrInstance)()
}

/**
  @return {Number} Le nombre d'events actuels
**/
static count(){
  return this.a.events.length
}

/**
  Retourne true si l'event d'identifiant +eid+ existe ou est en cours
  de création
**/
static exists(eid){
  return (isDefined(this.a.ids[eid])) || ($(`form#form-edit-event-${eid}`).length > 0)
}

/**
  @return {Array} La liste des propriétés pour une sous-classe
  précise.
  La sous-classe doit appeler :
  defP(this,'_TEXT_PROPERTIES',FAEvent.tProps(this.OWN_TEXT_PROPS))
**/
static tProps(own_text_properties){
  var arr = []
  arr.push(...FAEvent.TEXT_PROPERTIES)
  arr.push(...own_text_properties)
  return arr
}


/**
  Mémorise tous les events qui ont été créés ou modifiés au cours
  de la séance pour les enregistrer de façon séparée dans un dossier
  de backup, histoire d'avoir une copie en cas de problème. Ce backup
  contiendra donc une sorte d'historique des modifications.
**/
static addModified(evt){
  if(isUndefined(this.modifieds)) this.modifieds = []
  this.modifieds.push(evt.id)
  this.a.modified = true
}

/**
  Méthode qui sauve dans le backup les events modifiés
**/
static saveModifieds(){
  var my = this
  if(isUndefined(this.modifieds) || isEmpty(this.modifieds.length)) return

  var dataModifieds = {}
  for(var mod_id of this.modifieds){
    if(isUndefined(this.a.ids[mod_id])){
      // <= L'event mod_id n'est pas défini
      // => C'est une destruction qui a été effectuée
      dataModifieds[mod_id] = 'DESTROYED'
    } else {
      dataModifieds[mod_id] = this.a.ids[mod_id].data
    }
  }
  // On peut enregistrer cette liste
  fs.writeFile(my.pathModifieds(), JSON.stringify(dataModifieds), 'utf8', (err) => {
    if(err) throw(err)
    // Sinon, tout est OK, les modifiés ont été sauvegardés
    delete my.modifieds
  })
  dataModifieds = null
}
/**
  Retourne le path du fichier ou mettre les modifiés du moment
**/
static pathModifieds(){return path.join(this.folderModifieds,`${new Date().getTime()}.json`)}
static get folderModifieds(){
  if(isUndefined(this._folderModifieds)){
    this._folderModifieds = path.join(this.a.folderBackup, 'events')
    if(!fs.existsSync(this._folderModifieds)) fs.mkdirSync(this._folderModifieds)
  }
  return this._folderModifieds
}

static get a(){return this._a || current_analyse}
static set a(v){this._a = v}

static get dataType(){return this._dataType || defP(this,'_dataType', EVENTS_TYPES_DATA[this.type])}
static get type(){return this._type || defP(this,'_type',this.defineType())}
static get shortName(){return this._shortName||defP(this,'_shortName', this.dataType.name.short.cap.sing)}
static defineType(){
  let idx = this.name.startsWith('FAE') ? 3 : 2
  return this.name.substring(idx,this.name.length)
}

// ---------------------------------------------------------------------
//  INSTANCE

/**

  [1] Certaines vieilles versions ne définissaient pas obligatoirement
      la durée de l'event.
**/
constructor(analyse, data){
  this.analyse  = this.a = analyse
  this.dispatch(data)
  this.metaType = STRevent // alors que le type sera STRscene, STRdialog, etc.
  this.type     = this.constructor.type
  this.id = parseInt(this.id,10)

}

// Les données récupérées du static.dataType de chaque type d'event
get type(){return this.dataType.type}
set type(v){}// juste parce qu'elle est appelée au chargement
get hname(){return this.dataType.name.plain.cap.sing}
get shortName(){return this.dataType.name.short.cap.sing}
get tinyName(){return this.dataType.name.tiny.cap.sing}
get dataType(){return this.constructor.dataType}

// Dès qu'on marque l'event modifié, ça marque l'analyse modifiée
// On utilise aussi les sauvegardes de protection en mémorisant l'identiant
// de cet event qu'il faudra sauvegarder
set modified(v){
  // console.log(`-> modified de ${this.id} (${this.titre})`)
  this._modified = v
  if(v){
    FAEvent.addModified(this)
    this.a.modified = true
  }
}

reset(){
  delete this._f_titre
  delete this._asLink
  delete this._endAt
  delete this._otime
  delete this._horl
  delete this._div
  delete this._contenu
}

// Méthode pratique pour reconnaitre rapidement l'element
get isAEvent(){return true}
get isEvent(){return true}
get isADocument(){return false}
get isDocument(){return false}
get isAScene(){return false} // surclassé par FAEscene
get isScene(){return false} // surclassé par FAEscene
get isAnImage(){return false}
get isImage(){return false}

// ---------------------------------------------------------------------
//  Propriétés temporelles

// Pour la correspondance de nom, aussi
get startAt(){return this.time}
get endAt(){return this._endAt || defP(this,'_endAt',this.time + this.duree)}

// On utilise un getter et un setter pour réinitialiser d'autres propriétés
get time(){return this._time}
set time(v){ this._time = v ; delete this._horl ; delete this._otime }

get scene(){return this._scene||defP(this,'_scene',FAEscene.at(this.time))}

get otime(){return this._otime || defP(this,'_otime',new OTime(this.time))}
get horloge(){return this._horl||defP(this,'_horl',this.otime.horloge)}

/**
 * Définition de la durée
 */
set duree(v){
  if(isString(v)){
    // <= la valeur est un string
    // => on vient du formulaire, il faut traiter
    v = v.trim();
    v = new OTime(v)
    v = v.seconds
  }
  v = v.round(2)
  if (v != this._duree){
    this._duree  = v
    this.modified   = true
    this.reset()
  }
}
get duree(){return this._duree || (this.type === STRscene ? 60 : 10)}

// Alias
get description(){return this.content}

// ---------------------------------------------------------------------
//  Méthodes d'association

/**
  Pour définir que l'event d'id +event_id+ est le parent de l'event
**/
setParent(event_id){
  this.parent = event_id
  this.modified = true
}
unsetParent(){
  delete this.parent
  this.modified = true
}

/**
  Méthode qui permet de boucler sur toutes les
  propriétés textuelles de l'event, pour rechercher
  des choses dans les textes, par exemple.

  La méthode fonctionne avec la proprité TEXT_PROPERTIES de
  l'event.

**/
forEachTextProperty(fn){
  let my = this
  for(var prop of my.constructor.TEXT_PROPERTIES){
    if(false === fn(prop, my[prop])) break
  }
}
// ---------------------------------------------------------------------

/**
 * Méthode appelée en cas d'erreur.
 * +evt+ FAEvent concerné
 * +errors+ est une liste de tables qui doivent contenir :
 * :msg     Le message d'erreur
 * :prop    Le nom de la propriété, qui permettra de montrer le champ
 */
onErrors(evt, errors){
  var focusPrefix  = `#event-${evt.id}-`
  var focusFieldId = `${focusPrefix}${errors[0].prop}`
  F.notify(errors.map(function(d){
    $(`${focusPrefix}${d.prop}`).addClass('error')
    return d.msg
  }).join(RC), {error: true, duree: 'auto'})
  if($(focusFieldId).length) evt.firstErroredFieldId = focusFieldId
}
/**
 * Méthode qui affiche l'évènement de manière différée, en tenant compte du
 * temps courant
 */
showDiffere(){
  var my = this
  this.div //pour le construire
  var diff = ((my.time - this.analyse.locator.currentTime) * 1000) - 300
  if ( diff < 0 ){ // ne devrait jamais arriver
    this.show()
  } else {
    this.timerShow = setTimeout(my.show.bind(my), diff)
  }
}

// Comme la méthode show(), mais en plus, place le curseur à l'endroit
// du film. C'est la méthode utilisée par le bouton 'voir'
reveal(){
  this.a.locator.setTime(this.otime)
}
/**
 * Pour afficher l'évènement dans le reader de l'analyse
 */
show(){
  // console.log("-> show", this.id)
  if(this.shown === true) return
  if(this.jqReaderObj && this.jqReaderObj.length){
    // <= l'objet DOM existe déjà
    // => On a juste à l'afficher
    this.jqReaderObj.show()
  } else {
    // <= L'objet DOM n'existe pas encore
    // => Il faut le construire en appelant this.div
    this.a.reader.append(this)
    this.observe()
  }
  // SI vraiment on a besoin de montrer cet event,
  //  on doit appeler la méthode FAReader.reveal(this)

  this.shown = true
}

hide(){
  this.jqReaderObj && this.jqReaderObj.hide()
  this.shown = false
}

get end(){
  if(isUndefined(this._end)) this._end = this.time + this.duree
  return this._end
}

remove(){
  delete this._div
  isEmpty(this.jqReaderObj) || this.jqReaderObj.remove()
  delete this._domreaderobj
  delete this._jqreaderobj
  this.shown = false
  this.observed = false
}
/**
 * Après édition de l'event, on peut avoir à updater son affichage dans
 * le reader. On va faire simplement un remplacement de div (le div du
 * contenu, pour ne pas refaire les boutons, etc.).
 */
updateInReader(new_idx){
  log.info(`-> <<FAEvent #${this.id}>>#updateInReader`)
  // On détruit complètement l'objet reader (ce qui forcera sa reconstruction
  // et son observation)
  this.remove()
  this.a.reader.append(this)
  this.div.style.opacity = 1

  log.info(`<- <<FAEvent #${this.id}>>#updateInReader`)

}

/**
 * Les données "communes" qu'on doit actualiser dans tous l'interface, quel
 * que soit l'élément.
 */
updateInUI(){
  // Le temps se trouve toujours dans une balise contenant data-time, avec
  // le data-id défini
  $(`*[data-time][data-id="${this.id}"]`).attr(STRdata_time,this.time)
  // TODO Il faut traiter l'horloge aussi
  $(`.horloge-event[data-id="${this.id}"]`).html(this.horloge)
}

// ---------------------------------------------------------------------
// Méthodes de recherche ou de filtre

/**
  Méthode qui retourne true si l'event contient les personnages

  @param {Object} filtre
                    :regulars Liste des expressions régulières à évaluer, si
                              elles ont été préparées (comme pour le filtre
                              par exemple). Dans ce cas, les deux autres props
                              sont inutiles, puisque tous les cas sont considé-
                              rés par ces expressions régulières (par exemple,
                              il n'y en a qu'une seule pour le cas `all: false`)
                    :list   Liste des identifiants
                    :all    Si true, tous les personnages doivent se trouver
                            dans l'event, si false, un seul personnage suffit
**/
hasPersonnages(filtre){
  var pid, stxt
  if (isUndefined(filtre.regulars)){
    for(pid of filtre.list){
      stxt = new RegExp(`@${FAPersonnage.get(pid).dim}[^a-zA-Z0-9_]`)
      if(!!this.content.match(stxt) && false === filtre.all){
        return true
      } else if(true === filtre.all && !this.content.match(stxt)) {
        return false
      }
    }

    // Moins sémantique :
    // return filtre.all

    if(filtre.all){
      // Si on arrive ici c'est que tous les personnages ont été trouvés
      return true
    } else {
      // Si on arrive ici, c'est qu'aucun personnage n'a été trouvé
      return false
    }
  } else {
    for(var reg of filtre.regulars){
      let notInContent = !this.content  || !this.content.match(reg)
      let notInTiter   = !this.titre    || !this.titre.match(reg)
      if( notInContent && notInTiter ) return false
    }
    return true // dans tous les cas
  }
}

// ---------------------------------------------------------------------

get domId(){ return `event-${this.id}`}


get contenu(){return this._contenu||defP(this,'_contenu',this.defineContenu())}

// Définition du contenu, soit formaté d'une façon particulière par
// l'event propre, soit le content normal, dediminutivisé
defineContenu(){
  if(isFunction(this.formateContenu)){
    return this.formateContenu()
  } else {
    return this.fatexte.deDim(this.content)
  }
}

get fatexte(){return this._fatext||defP(this,'_fatext', new FATexte(this.content))}

/**
 * Les données qui seront enregistrées (épurées)
 */
get data(){
  var d = {}, prop
  for(prop of this.constructor.ALL_PROPS){
    if(isNotString(prop)) prop = prop[0] // quand définition par paire
    if(isFunction(this[`${prop}Epured`])){
      d[prop] = this[`${prop}Epured`]()
    } else {
      d[prop] = this[prop]
    }
  }
  return Hash.compact(d)
}

/**
 * Dispatch les données communes (autres que celles qui permettent à
 * l'instanciation et la création)
 Normalement, cette méthode ne devrait plus être utilisée.
 */
set data(d){
  var fieldName ;
  for(var prop of FAEvent.OWN_PROPS){
    if(isUndefined(d[prop]) || isNull(d[prop]) ) continue
    this[prop] = d[prop]
  }
}

/**
  Dispatch les données +d+ dans l'instance
  Cette méthode sert aussi bien pour l'édition de l'event, ou les 'prop'
  ci-dessous correspondent à des champs d'édition (par exemple 'longtext1' pour
  la vraie propriété 'content') qu'à dispatcher les données à la lecture du
  fichier de l'analyse (ou donc les propriétés portent leur nom).
**/
dispatch(d){
  var fieldName, prop ;
  for(prop of this.constructor.ALL_PROPS){
    if(isString(prop)){
      // <= Seulement le nom de la propriété donnée
      // => Le champ s'appelle comme la propriété
      fieldName = prop
    } else {
      // <= Own prop donnée sous forme de array avec en première valeur le
      //    nom de la propriété dans l'évènement et en seconde valeur le
      //    nom du champ
      // => On met dans la propriété la valeur du champ
      fieldName = prop[1]
      prop      = prop[0]
    }
    if(isUndefined(d[fieldName] || d[prop])) continue
    this[prop] = d[fieldName] /* depuis le formulaire */ || d[prop] /* depuis le fichier */
  }
  // rectification de certaines données
  if (this.time)      this.time     = this.time.round(2)
  if (this.duree)  this.duree = this.duree.round(2)
}

togglePlay(){
  if(this.playing){
    this.locator.stop()
  } else {
    // On met en route
    var t = this.time
    if(current_analyse.options.get('option_start_3secs_before_event')){t -= 3}
    this.locator.setTime.bind(this.locator)(new OTime(t))
    // On détermine la fin du jeu
    this.locator.setEndTime(new OTime(t + this.duree), this.togglePlay.bind(this))
  }

  this.playing = !this.playing
  if(current_analyse.options.get('option_start_when_time_choosed')){
    this.imgBtnPlay[this.playing?'hide':'show']()
    this.imgBtnStop[this.playing?'show':'hide']()
  }
}

// ---------------------------------------------------------------------
//  DOM ÉLÉMENTS

get imgBtnPlay(){
  return this._imgBtnPlay || defP(this,'_imgBtnPlay',this.btnPlayETools.find('img.btn-play'))
}
get imgBtnStop(){
  return this._imgBtnStop || defP(this,'_imgBtnStop',this.btnPlayETools.find('img.btn-stop'))
}
get btnPlayETools(){
  return this._btnPlayETools || defP(this,'_btnPlayETools', this.jqReaderObj.find('.e-tools .btn-play'))
}

/** ---------------------------------------------------------------------
* Méthodes d'évènements
**/

// Pour observer l'event dans son container.
observe(container){
  var my = this
    , o = this.jqReaderObj

  if(isUndefined(o)){
    log.warn(`BIZARREMENT, le jqReaderObj de l'event #${this.id} est introuvable dans le reader. recherché avec domReaderId:${this.domReaderId}`)
  } else {

    if(o.attr(STRobserved) == STROBSERVED) return

    // On rend actif les boutons d'édition
    o.find('.e-tools button.btn-edit').on(STRclick, EventForm.editEvent.bind(EventForm, this))

    // On rend actif les boutons play
    BtnPlay.setAndWatch(this.jqReaderObj, this)

    /**
    * On rend l'event droppable pour qu'il puisse recevoir d'autres events
    * ainsi que des documents
    **/
    o
      .droppable(DATA_ASSOCIATES_DROPPABLE)
      .draggable(DATA_ASSOCIATES_DRAGGABLE)

    o.attr(STRobserved, STROBSERVED)
  }
}

get locator(){return this.analyse.locator}

// ---------------------------------------------------------------------
// Gestion du Bouton BtnPlay
// Cf. Le manuel de développement
get btnPlay(){return this._btnPlay||defP(this,'_btnPlay',new BtnPlay(this))}

// Les events n'étant pas tout à fait des FAElement(s), il faut définir
// ces méthodes
domC(prop){return `${this.domClass}-${prop}`}
get domClass(){return this._domid || defP(this,'_domid',`event-${this.id}`)}
get domReaderId(){return this._domreaderid||defP(this,'_domreaderid',`reader-${this.domId}`)}
get domReaderObj(){return this._domreaderobj||defP(this,'_domreaderobj',this.jqReaderObj?this.jqReaderObj[0]:undefined)}
get jqReaderObj(){
  if(isUndefined(this._jqreaderobj)){
    this._jqreaderobj = $(`#${this.domReaderId}`)
    if(isEmpty(this._jqreaderobj)) delete this._jqreaderobj
  }
  return this._jqreaderobj
}

// ---------------------------------------------------------------------
//  MÉTHODES CONCERNANT L'IMAGE COURANTE

/**
  @return {FAImage} Instance de l'image de curimage, si l'event est lié
**/
get faimage(){
  if(!this.needCurImage()) return
  if(isUndefined(this._faimage)) this._faimage = FAImage.get(this.curImageId)
  return this._faimage
}

// Retourne le code pour afficher l'image
curImageDiv(options){
  this.existsCurImage() || FAImage.shotFrame(this.otime, {message:false})
  if(!this.faimage) return
  if(isUndefined(options)) options = {}
  options.imgClass = this.domC('curimage')
  let div = this.faimage.asDiv(options)

  if(options && options.as === STRstring) return div.outerHTML
  return div
}
// retourne true si l'event est liée à son image courante
needCurImage(){return !!this.curimage}
// retourne true si l'image courante de l'event existe
existsCurImage(){
  return fs.existsSync(this.curImagePath)
}
// retourne le path de l'image courante
get curImageId(){ return this._curimageid    || defP(this,'_curimageid',   FAImage.fname2id(this.curImageName))}
get curImageName(){return this._curimagename || defP(this,'_curimagename', FAImage.time2fname(this.otime))}
get curImagePath(){return this._curimagepath || defP(this,'_curimagepath', FAImage.pathOf(this.curImageName))}


} // /class FAEvent

Object.assign(FAEvent.prototype,ASSOCIATES_COMMON_METHODS)
Object.defineProperties(FAEvent.prototype,ASSOCIATES_COMMON_PROPERTIES)
