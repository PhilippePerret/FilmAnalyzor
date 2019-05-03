'use strict'

class FAEvent {
// ---------------------------------------------------------------------
//  CLASSE

static get OWN_PROPS(){return ['id', 'type', 'titre', 'time', 'duree', 'parent', ['content', 'longtext1'], 'events', 'documents', 'times', 'brins']}
static get TEXT_PROPERTIES(){return ['titre', 'content']}

static get ALL_PROPS(){
  if(undefined === this._all_props){
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
  return (this.a.ids[eid] !== undefined) || ($(`form#form-edit-event-${eid}`).length > 0)
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
  if(undefined === this.modifieds) this.modifieds = []
  this.modifieds.push(evt.id)
  this.a.modified = true
}

/**
  Méthode qui sauve dans le backup les events modifiés
**/
static saveModifieds(){
  var my = this
  if(undefined === this.modifieds || 0 === this.modifieds.length) return

  var dataModifieds = {}
  for(var mod_id of this.modifieds){
    if(undefined === this.a.ids[mod_id]){
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
  if(undefined === this._folderModifieds){
    this._folderModifieds = path.join(this.a.folderBackup, 'events')
    if(!fs.existsSync(this._folderModifieds)) fs.mkdirSync(this._folderModifieds)
  }
  return this._folderModifieds
}

/**
  Méthode qui permet de dissocier des éléments (pour le moment, des events)
  @param {Object} datadis   Données pour effectuer la dissociation. Doit
                            contenir : :owner_type, le type du propriétaire,
                            par exemple 'event' ou 'doc', :owner_id, l'id du
                            propriétaire, :type, le type de l'élément à disso-
                            cier, par exemple 'time'
                            :time ou :id suivant qu'il s'agit d'un temps ou
                            d'un autre élément
**/
static prepareDissociation(datadis){
  datadis.owner.type || raise('Il faut fournir le type du propriétaire.')
  datadis.owner.id !== undefined || raise("Il faut fournir l'id du propriétaire")
  let owner = ((typ, id) => {
    switch (typ) {
      case 'event':     return FAEvent.get(id)
      case 'document':  return FADocument.get(id)
      case 'brin':      return FABrin.get(id)
      default:
        throw(`Le type de possesseur "${typ}" n'est pas encore traité pour la dissociation`)
    }
  })(datadis.owner.type, datadis.owner.id)

  let owned = ((typ, id) => {
    switch (typ) {
      case 'time':      return new OTime(id)
      case 'event':     return FAEvent.get(id)
      case 'document':  return FADocument.get(id)
      case 'brin':      return FABrin.get(id)
      default:
      throw(`Le type de possédé "${typ}" n'est pas encore traité pour la dissociation`)
    }
  })(datadis.owned.type, datadis.owned.id)

  owner !== undefined || raise("Le possesseur est introuvable…")
  owned !== undefined || raise("L'élément possédé est introuvable…")

  // Demande de confirmation
  let msg = `Dois-je vraiment dissocier : ${owned} de : ${owner} ?`
  if(!confirm(msg)) return false

  // Dissociation confirmée, on peut procéder
  if('function' === typeof(owner.dissocier)){
    owner.dissocier(owned)
  } else {
    throw(`Il faut implémenter la méthode "dissocier" pour ${owner}`)
  }

}

static get a(){return this._a || current_analyse}
static set a(v){this._a = v}

static get type(){return this._type||defP(this,'_type', this.dataType.type)}
static get shortName(){return this._shortName||defP(this,'_shortName', this.dataType.name.short.cap.sing)}

// ---------------------------------------------------------------------
//  MÉTHODES POUR LES ASSOCIATIONS

/**
  Construit un lien pour casser une association et le retourne.
  @param {Object} datass  Données pour l'association. Doit contenir :
                          :owner    Définition du propriétaire (:type/:id)
                          :owned    Définition du possédé (:type/:id) ou objet
**/
static linkDissocier(datass){
  if(datass.owner.type == datass.owned.type && datass.owned.id == datass.owner.id){
    throw("Impossible de dissocier un élément de lui-même, voyons…")
  }
  let owner_id = datass.owner.id
  if('number' !== typeof(owner_id)) owner_id = `'${owner_id}'`
  let owned_id = datass.owned.id
  if('number' !== typeof(owned_id)) owned_id = `'${owned_id}'`

  return DCreate('A',{class:'lkdiss', inner: '[dissocier]', attrs:{onclick:`FAEvent.prepareDissociation.bind(FAEvent)({owned:{type:'${datass.owned.metaType||datass.owned.type}', id:${owned_id}}, owner:{type:'${datass.owner.metaType||datass.owner.type}', id:${owner_id}}})`}})
}
static associer(obj, asso){
  log.info(`-> FAEvent::associer`)
  let list_id = `${asso.type}s`
  let res = this.addToList(list_id, obj, asso.id)
  if (res == true){
    obj.modified = true
    if('function'===typeof(obj.updateInReader)){
      obj.updateInReader()
    }
  }
  log.info(`<- FAEvent::associer (return ${res})`)
  return res
}
// ATTENTION : LA MÊME MÉTHODE EXISTE PLUS HAUT
static dissocier(obj, asso){
  let list_id = `${asso.metaType||asso.type}s`
  let res = this.supFromList(list_id, obj, asso.id)
  if (res == true){
    obj.modified = true
    if('function'===typeof(obj.updateInReader)){
      obj.updateInReader()
    }
  }
  return res
}

static addToList(list_id, obj, asso_id){
  log.info(`-> FAEvent::addToList(list_id="${list_id}", obj={type:${obj.type},id:${obj.id}}, asso_id=${asso_id})`)
  // console.log("addToList:", list_id, foo_id)
  if(list_id == 'times' && (asso_id instanceof(OTime))) asso_id = asso_id.seconds
  if(obj[list_id].indexOf(asso_id) < 0){
    log.info(`   Ajout id #${asso_id} à liste ${list_id} de ${obj.toString()}`)
    obj[list_id].push(asso_id)
    return true
  } else {
    F.notify(`Les deux éléments sont déjà liés.`)
    return false
  }
}
static supFromList(list_id, obj, asso_id){
  if(list_id == 'times' && (asso_id instanceof(OTime))) asso_id = asso_id.seconds
  var off = obj[list_id].indexOf(asso_id)
  if(off > -1){
    obj[list_id].splice(off, 1)
    return true
  } else {
    return false
  }
}
// ---------------------------------------------------------------------
//  INSTANCE

/**

  [1] Certaines vieilles versions ne définissaient pas obligatoirement
      la durée de l'event.
**/
constructor(analyse, data){
  this.analyse  = this.a = analyse
  this.metaType = 'event' // alors que le type sera 'scene', 'dialog', etc.

  this.dispatch(data)

  this.id = parseInt(this.id,10)

  // Valeurs par défaut indispensables
  // Les associations possibles
  this.events     = this.events     || []
  this.documents  = this.documents  || []
  this.times      = this.times      || []
  this.brins      = this.brins      || []

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
get isADocument(){return false}
get isScene(){return false} // surclassé par FAEscene

// ---------------------------------------------------------------------
//  Méthodes d'helper


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
  if('string' === typeof(v)){
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
get duree(){return this._duree || (this.type === 'scene' ? 60 : 10)}

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
Méthode pour associer et dissocier l'élément +asso+ de l'event courant
**/
associer(asso) {return FAEvent.associer(this, asso)}
dissocier(asso){return FAEvent.dissocier(this, asso)}

/**

  Répète la méthode +fn+ sur tous les events associés de
  type +type+ (le nom du type au pluriel, comme la propriété)

  @param {String} type  Soit 'events', 'documents', 'times'
  @return {Void}

**/
forEachAssociate(type, fn){
  if(type==='times' || type === 'time'){
    for(var assoEvent of this[type]){
      if(false === fn(new OTime(assoEvent))) break;
    }
  } else {
    for(var assoEvent of this[type]){
      if(false === fn(this.a.ids[assoEvent])) break;
    }
  }
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
  this.makeAppear() // c'est l'opacité qui masque l'event affiché
  // Pour se mettre en exergue lorsqu'il est survolé
  this.startWatchingTime()
  // Trop mou ou trop rapide avec scrollIntoView. Rien de vaut la méthode
  // old-school
  this.domReaderObj.parentNode.scrollTop = this.domReaderObj.offsetTop
  this.shown = true
}

hide(){
  this.makeDesappear()
  this.jqReaderObj.hide()
  this.stopWatchingTime()
  this.shown = false
}

/**
  Toutes les secondes, l'event va véfiier si le temps courant le
  survole. Si c'est le cas, il se met en exergue.
**/
startWatchingTime(){
  // console.log("-> startWatchingTime de ", this.id)
  this.timerWatchingTime = setInterval(this.watchTime.bind(this), 1000)
  // console.log("<- startWatchingTime de", this.id)
}
stopWatchingTime(){
  // console.log("-> stopWatchingTime")
  clearInterval(this.timerWatchingTime)
  delete this.timerWatchingTime
}
watchTime(){
  if(undefined === this.a || undefined === this.a.locator) return
  var rtime = this.a.locator.currentTime
  let iscur = rtime >= this.time - 2 && rtime <= this.end + 2
  if(this.isCurrent != iscur){
    this.isCurrent = !!iscur
    this.jqReaderObj[this.isCurrent?'addClass':'removeClass']('current')
  }
}
get end(){
  if(undefined === this._end) this._end = this.time + this.duree
  return this._end
}
/**
 * Après édition de l'event, on peut avoir à updater son affichage dans
 * le reader. On va faire simplement un remplacement de div (le div du
 * contenu, pour ne pas refaire les boutons, etc.).
 */
updateInReader(new_idx){
  log.info(`-> <<FAEvent #${this.id}>>#updateInReader`)
  // Pour forcer la reconstruction
  delete this._div
  // Si l'event n'est pas affiché dans le reader (ou autre), on n'a rien
  // à faire. Par prudence, on réinitialise quand même le _div qui avait peut-
  // être été défini lors d'un affichage précédent
  if(undefined === this.jqReaderObj) return

  // On remplace l'objet reader par un nouvel updaté et on l'observe
  this.jqReaderObj.replaceWith($(this.div))
  delete this._jq_reader_obj
  this.observe()

  if (undefined !== new_idx /* peut être 0 */) {
    // Si le temps de l'event a changé de façon conséquente, il faut
    // le replacer au bon endroit dans le reader. C'est la valeur de `new_idx`
    // qui le définit, undefined si l'event reste en place ou le nouvel index
    //
    // Rappel : l'new_idx est "calculé" après retrait de l'event de la liste,
    // il faut en tenir compte ici.
    // On met d'abord le noeud en dehors du reader
    $('#section-reader').append(this.jqReaderObj)
    var reader = DGet('reader')
    reader.insertBefore(this.domReaderObj, reader.childNodes[new_idx])

  }
  log.info(`<- <<FAEvent #${this.id}>>#updateInReader`)

  this.div.style.opacity = 1
}

/**
 * Les données "communes" qu'on doit actualiser dans tous l'interface, quel
 * que soit l'élément.
 */
updateInUI(){

  // Le temps se trouve toujours dans une balise contenant data-time, avec
  // le data-id défini
  $(`*[data-time][data-id="${this.id}"]`).attr('data-time',this.time)
  // TODO Il faut traiter l'horloge aussi
  $(`.horloge-event[data-id="${this.id}"]`).html(this.horloge)

}


makeAppear(){
  this.jqReaderObj.animate({opacity:1}, 600)
}
makeDesappear(){
  this.jqReaderObj.animate({opacity:0}, 600)
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
  if (undefined === filtre.regulars){
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

get jqReaderObj(){
  if(undefined === this._jq_reader_obj ){
    this._jq_reader_obj = $(`#${this.domId}`)
  }
  if(this._jq_reader_obj.length == 0) this._jq_reader_obj = undefined
  return this._jq_reader_obj
}
get domReaderObj(){return this._domReaderObj||defP(this,'_domReaderObj',this.defineDomReaderObj())}

get domId(){ return `revent-${this.id}`}


get contenu(){return this._contenu||defP(this,'_contenu',this.defineContenu())}

// Définition du contenu, soit formaté d'une façon particulière par
// l'event propre, soit le content normal, dediminutivisé
defineContenu(){
  if('function' === typeof this.formateContenu){
    return this.formateContenu()
  } else {
    return this.fatexte.deDim(this.content)
  }
}

get fatexte(){return this._fatext||defP(this,'_fatext', new FATexte(this.content))}

/**
 * Les données qui seront enregistrées
 */
get data(){
  var d = {}, prop
  for(prop of this.constructor.ALL_PROPS){
    // cf. ci-dessous dans `dispatch`
    if('string' !== typeof(prop)) prop = prop[0]
    // On n'enregistre pas les données non définies ou null
    if(null === this[prop] || undefined === this[prop]) continue
    // On n'enregistre pas les listes vides
    if(Array.isArray(this[prop]) && this[prop].length == 0) continue
    d[prop] = this[prop]
  }
  return d
}

/**
 * Dispatch les données communes (autres que celles qui permettent à
 * l'instanciation et la création)
 Normalement, cette méthode ne devrait plus être utilisée.
 */
set data(d){
  var fieldName ;
  for(var prop of FAEvent.OWN_PROPS){
    if(undefined === d[prop] || null === d[prop]) continue
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
    if('string' === typeof(prop)){
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
    if(undefined === (d[fieldName] || d[prop])) continue
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

  // On rend actif les boutons d'édition
  o.find('.e-tools button.btn-edit').on('click', EventForm.editEvent.bind(EventForm, this))

  // On rend actif les boutons play
  BtnPlay.setAndWatch(this.jqReaderObj, this)

  /**
  * On rend l'event droppable pour qu'il puisse recevoir d'autres events
  * ainsi que des documents
  **/
  o.droppable(
    Object.assign({}, DATA_DROPPABLE, {drop: function(e,ui){
        my.a.associateDropped(my, ui.helper)
      }})
  )
  /**
   * On rend l'event draggable pour pouvoir le déplacer sur un élément
   * dans lequel il doit être ajouté.
   * Mais pour que ça fonctionne, il faut le overflow du container soit
   * momentanément retiré, sinon l'event passe "en dessous" quand on le
   * déplace.
   */
  o.draggable({
      revert: true
    , helper: 'clone'
    // , stack: 'section#section-eventers div.eventer div.pan-events'
    // , start: function(event, ui) { $(this).css("z-index", a++); }
    , classes:{
        'ui-draggable-dragging': 'myHighlight'
      }
    , start: ev => {
        if(container){
          container.old_overflow = container.css('overflow')
          container.css('overflow','visible')
        }
      }
    , stop: ev => {
        if(container){
          container.css('overflow', container.old_overflow)
        }
      }
  })
}

get locator(){return this.analyse.locator}

// ---------------------------------------------------------------------
// Gestion du Bouton BtnPlay
// Cf. Le manuel de développement
get btnPlay(){return this._btnPlay||defP(this,'_btnPlay',new BtnPlay(this))}

// Pour définir le dom obj de l'event dans le Reader
defineDomReaderObj(){
  var obj
  if (this.jqReaderObj) obj = this.jqReaderObj[0]
  return obj
}

}
