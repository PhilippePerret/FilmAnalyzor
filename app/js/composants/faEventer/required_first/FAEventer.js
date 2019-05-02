'use strict'
/**
 *  Classe FAEventer
 *  --------------
 *  Il permet d'afficher les events, filtrés ou non
 */

class FAEventer {
// ---------------------------------------------------------------------
//  CLASSE

/**
  Réinitialise tout (par exemple au chargement d'une nouvelle analyse)

  On remet le last_id à 0
  On efface tous les eventers qui peuvent exister
**/
static reset(){
  this.last_id = 0
  $('.eventer').remove()
}

static newId(){
  if(undefined === this.last_id) this.last_id = 0
  return ++ this.last_id
}

/**
  Méthode principale appelée pour créer un nouvel eventer

  @return {FAEventer} L'instance créée
**/
static createNew(){
  log.info("-> FAEventers::createNew")
  var newEventer = new FAEventer(current_analyse)
  newEventer.show()
  log.info(`<- FAEventers::createNew() (ID #${newEventer.id})`)
  // return newEventer // pour les tests MAIS ÇA PLANTE L'APPLICATION
}


// ---------------------------------------------------------------------
//  INSTANCE

constructor(analyse){
  this.analyse = this.a = analyse
  this.id = FAEventer.newId()

  this.built    = false
}

show(){
  log.info(`-> <<FAEventer #${this.id}>>#show()`)
  this.fwindow.show()
  log.info(`<- <<FAEventer #${this.id}>>#show()`)
}
beforeShow(){
  log.info(`-> <<FAEventer #${this.id}>>#beforeShow()`)
  this.peuplePersonnagesInFilter()
  log.info(`<- <<FAEventer #${this.id}>>#beforeShow()`)
}
close(){this.fwindow.hide()}
// close(){this.fwindow.remove()}

/**
 * On peuple l'eventer en respectant le filtre choisi
 */
peuple(){
  log.info(`-> <<FAEventer #${this.id}>>#peuple()`)
  var my  = this
    , o   = my.jqPanEvents
    , fe  = new EventsFilter(this, {filter: my.filter})
    ;
  o.html('')
  fe.forEachFilteredEvent(function(ev){
    o.append(ev.div)
    ev.show()
    ev.observe(o)
  })
  log.info(`<- <<FAEventer #${this.id}>>#peuple()`)
}

/**
 * Appelée par le bouton pour appliquer le filtre choisi
 */
applyFilter(){
  let domId = this.domId
  var checkType   = $(`input#${domId}-filter-type`)[0].checked
  var checkText   = $(`input#${domId}-filter-text`)[0].checked
  var checkPersos = $(`input#${domId}-filter-persos`)[0].checked
  var checkTime   = $(`input#${domId}-filter-time`)[0].checked
  this.filter = {
      eventTypes:       checkType ? this.getChosenTypes() : null
    , with_text:        checkText ? this.getChosenText() : null
    , with_personnages: checkPersos ? this.getChosenPersonnages() : null
    , fromTime:         checkTime ? this.getFromTime() : null
    , toTime:           checkTime ? this.getToTime() : null
  }
  // console.log("Filtre : ", this.filter)
  this.peuple()
}


getFromTime(){
  return parseFloat($(`horloge#${this.domId}-from-time`).attr('value'))
}
getToTime(){
  var toTime   = parseFloat($(`horloge#${this.domId}-to-time`).attr('value'))
  if ( isNaN(toTime) || toTime <= this.getFromTime() ) toTime = this.a.duree
  return toTime
}

/**
  Quand on clique sur le bouton « filtre » pour le définir
  (on bascule alors à l'arrière de la fenêtre)
 */
onToggleFiltre(){
  var showList = !!this.filtreDisplayed
  if(showList) this.applyFilter()
  this.jqObj.find('.pan-events')[showList?'show':'hide']()
  this.jqObj.find('.pan-filter')[showList?'hide':'show']()
  this.btnFiltre.html(showList?'Filtre':'Liste')
  this.filtreDisplayed = !this.filtreDisplayed
}

/**
 * Méthode appelée quand on clique sur le bouton 'Tous' dans le filtre des
 * types. Pour tout déselectionner ou non.
 */
onToggleFiltreAllTypes(e){
  let all = DGet(`${this.domId}-cb-type-ALL`).checked
    , invert = e.metaKey === true

  var ocontainer = this.jqObj.find('.pan-filter div.type-list')
  ocontainer.find('.cb-type > input').each(function(i, o){
    if(i == 0){
      if(invert){
        o.checked   = false
      }
      return // le bouton "tous"/"aucun"
    }
    if (all) {
      if(invert){
        // Le sens inversé, pour tout décocher
        o.disabled  = false
        o.checked   = false
      } else {
        // Le sens normal, pour tout cocher
        o.disabled  = true
        o.checked   = true
      }
    } else {
      o.disabled  = false
    }
  })
}

// Retourne la liste des types valides
getChosenTypes(){
  var checkedList = []
  var ocontainer = this.jqObj.find('.pan-filter div.type-list')
  ocontainer.find('.cb-type > input').each(function(i, o){
    if(i==0) return // bouton "Tous"
    if (o.checked) checkedList.push(o.getAttribute('data-type'))
  })
  return checkedList
}

// Retourne le texte qu'il faut chercher (if any)
getChosenText(){
  let stxt  = this.jqObj.find(`#${this.domId}-text-search`).val().trim()
    , isReg = this.jqObj.find(`#${this.domId}-text-search-regular`)[0].checked
    , caseS = this.jqObj.find(`#${this.domId}-text-search-sensitive`)[0].checked
  if(stxt === '') return
  return {search: stxt, regular: isReg, caseSensitive: caseS}
}
// Retourne la liste des personnages qu'il faut trouver dans l'event,
// if any.
// @return {Object|Undefined} {list: <liste des pseudo>, all: true/false pour
// savoir s'il faut que tous les personnages soient présents pour que l'event
// soit considéré valide}
getChosenPersonnages(){
  var checkedList = []
  var ocontainer = this.jqObj.find('.pan-filter div.personnages-list')
  ocontainer.find('.cb-personnage > input').each(function(i, o){
    if (o.checked) checkedList.push(o.getAttribute('data-id'))
  })
  if(checkedList.length === 0) return
  return {
    list: checkedList
  , all: this.jqObj.find(`#${this.domId}-cb-all-chosen`)[0].checked
  }
}

static toggleFilterPart(domId, affix){
  let ch = $(`input#${domId}-filter-${affix}`)[0].checked
  $(`fieldset#${domId}-fs-${affix}`)[ch?'show':'hide']()
}

/**
 * Construction de l'eventeur
 */
build(){
  log.info(`-> <<FAEventer #${this.id}>>#build()`)
  var div = DCreate('DIV', {id: this.domId})
  // var div = DCreate('DIV', {id: this.domId, class: 'eventer'})
  div.innerHTML = `
  <div class="toolbox">
    <button type="button" class="btn-close"></button>
    <button type="button" class="small btn-filtre">Filtre</button>
  </div>
  <div class="pan-events"></div>
  <div class="pan-filter" style="display:none;">
    <h3>Filtre des events</h3>
    <fieldset id="${this.domId}-fs-filters" class="fs-filters">
      <div class="small explication">Cliquer sur « Liste » ci-dessus après avoir réglé le filtre.</div>

      <div>
        <input type="checkbox" id="${this.domId}-filter-type" onclick="FAEventer.toggleFilterPart('${this.domId}','type')"/>
        <label for="${this.domId}-filter-type">Filtrage par le type d'event</label>
      </div>

      <div>
        <input type="checkbox" id="${this.domId}-filter-text" onclick="FAEventer.toggleFilterPart('${this.domId}','text')"/>
        <label for="${this.domId}-filter-text">Filtrage par le texte (contenu et titre)</label>
      </div>

      <div>
        <input type="checkbox" id="${this.domId}-filter-persos" onclick="FAEventer.toggleFilterPart('${this.domId}','persos')"/>
        <label for="${this.domId}-filter-persos">Filtrage par les personnages</label>
      </div>

      <div>
        <input type="checkbox" id="${this.domId}-filter-time" onclick="FAEventer.toggleFilterPart('${this.domId}','time')"/>
        <label for="${this.domId}-filter-time">Filtrage par les temps</label>
      </div>

    </fieldset>

    <fieldset id="${this.domId}-fs-type" style="display:none">
      <legend>Types affichés</legend>
      <div class="type-list"></div>
    </fieldset>

    <fieldset class="normal" id="${this.domId}-fs-text" style="display:none">
      <legend>Texte à rechercher</legend>
      <input type="text" id="${this.domId}-text-search" style="width:98%;" />
      <div>
        <input type="checkbox" id="${this.domId}-text-search-regular" />
        <label for="${this.domId}-text-search-regular">Expression régulière</label>
        <input type="checkbox" id="${this.domId}-text-search-sensitive" />
        <label for="${this.domId}-text-search-sensitive">Respecter la casse</label>
      </div>
    </fieldset>

    <fieldset id="${this.domId}-fs-persos" style="display:none">
      <legend>Personnages</legend>
      <div class="small explication">Cocher les personnages qui doivent se trouver mentionnés ou être en lien avec les events recherchés.</div>
      <div class="personnages-list"></div>
      <div>
        <input type="checkbox" id="${this.domId}-cb-all-chosen" />
        <label for="${this.domId}-cb-all-chosen">Tous ceux choisis (sinon, au moins un)</label>
      </div>
    </fieldset>

    <fieldset id="${this.domId}-fs-time" style="display:none">
      <legend>Temps</legend>
      Events entre <horloge id="${this.domId}-from-time" class="small horloge horlogeable" value="0">0:00:00.00</horloge> et
      <horloge id="${this.domId}-to-time" class="small horloge horlogeable" value="">...</horloge>
    </fieldset>

  </div>
  `

  this.built = true

  log.info(`<- <<FAEventer #${this.id}>>#build()`)
  return div // pour la FWindow
}
afterBuilding(){
  // Au tout début, on affiche seulement les scènes
  log.info(`-> <<FAEventer #${this.id}>>#afterBuilding()`)
  this.filter = {eventTypes: ['scene']}
  this.peuple()
  this.peupleTypesInFilter()
  // On doit régler la fin du film
  let o = $(`#${this.domId}-to-time`)
  o.attr('value', this.a.duree)
  o.html(new OTime(this.a.duree).horloge)

  // On doit peupler avec les personnages du film (CB non cochées)
  // TODO
  //
  log.info(`<- <<FAEventer #${this.id}>>#afterBuilding()`)
}


peuplePersonnagesInFilter(){
  log.info('-> peuplePersonnagesInFilter')
  let my = this
    , ocontainer = this.jqObj.find('.pan-filter div.personnages-list')
  var domId, cb

  FAPersonnage.forEachPersonnage(function(perso){
    domId = `${my.domId}-cb-personnage-${perso.id}`
    ocontainer.append(DCreate('SPAN',{class:'cb-personnage span-cb', append:[
        DCreate('INPUT', {id:domId, type:'checkbox', attrs:{'data-id': perso.id}})
      , DCreate('LABEL', {attrs:{for: domId}, inner: perso.pseudo})
    ]}))
  })
  log.info('<- peuplePersonnagesInFilter')
}

// Pour mettre les types avec des cases à cocher dans le panneau du filtre
peupleTypesInFilter(){
  // Note : on récupère tout simplement les types d'event du dossier FAEvents
  log.info(`-> <<FAEventer #${this.id}>>#peupleTypesInFilter()`)
  var my = this
  var ocontainer = this.jqObj.find('.pan-filter div.type-list')

  // Le choix "tous"
  my.buildCbType(ocontainer, `${this.domId}-cb-type-ALL`, 'Tous')
  $(`#${this.domId}-cb-type-ALL`).on('click', this.onToggleFiltreAllTypes.bind(this))

  glob('./app/js/common/FAEvents/*.js', (err, list) => {
    for(var fpath of list){
      var classe = eval(path.basename(fpath,path.extname(fpath)))
      var domid = `${this.domId}-cb-type-${classe.type}`
      my.buildCbType(ocontainer, domid, classe.shortName, classe.type)
    }
  })
  log.info(`<- <<FAEventer #${this.id}>>#peupleTypesInFilter()`)
}

/**
  Construit la case à cocher, l'ajoute au container +ocontainer+ et
  la retourne.
  @param {jqSet} ocontainer   Container dans lequel il faut mettre la cb
  @param {String} domId       ID de la case à cocher.
  @param {String} libelle     Le libellé affiché
  @param {String} type        Type de l'élément, par exemple 'scene' ou 'personnage'
**/
buildCbType(ocontainer, domid, libelle, type){
  var label = DCreate('LABEL', {attrs: {'for': domid}, inner: libelle})
  var cb = DCreate('INPUT', {id: domid, attrs:{type: 'checkbox', 'data-type': type}})
  cb.checked = true
  var span  = DCreate('SPAN', {class: 'cb-type span-cb', append: [cb, label]})
  ocontainer.append(span)
  return span
}

observe(){
  log.info(`-> <<FAEventer #${this.id}>>#observe()`)
  this.btnFiltre.on('click', this.onToggleFiltre.bind(this))
  this.btnClose.on('click', this.close.bind(this))
  var horloges = UI.setHorlogeable(DGet(this.domId))
  var dataHorloge = {
      // time: 0
      synchroVideo: true
    , parentModifiable: false
    , unmodifiable: true
  }
  this.horlogeFiltreFromTime = horloges[`${this.domId}-from-time`]
  this.horlogeFiltreToTime   = horloges[`${this.domId}-to-time`]
  this.horlogeFiltreToTime.time = this.a.videoController.video.duration
  this.horlogeFiltreFromTime.dispatch(dataHorloge)
  this.horlogeFiltreToTime.dispatch(dataHorloge)

  // Juste pour changer le libellé de "Tous", dans le filtre, et mettre "Aucun"
  this.fwindow.jqObj.on('keydown', this.onKeyDown.bind(this))
  this.fwindow.jqObj.on('keyup', this.onKeyUp.bind(this))
  log.info(`<- <<FAEventer #${this.id}>>#observe()`)
}

onKeyDown(e){
  if(e.metaKey !== true) return true
  $(`label[for="${this.domId}-cb-type-ALL"]`).html('Aucun')
}
onKeyUp(e){
  if(e.metaKey !== true){
    $(`label[for="${this.domId}-cb-type-ALL"]`).html('Tous')
  }
}

get fwindow(){return this._fwindow || defP(this,'_fwindow', new FWindow(this, {class: 'eventer', container: $('#section-eventers')}))}
get jqObj(){return this._jqObj||defP(this,'_jqObj', $(`#${this.domId}`))}
get jqPanEvents(){return this._jqPanEvents||defP(this,'_jqPanEvents',this.jqObj.find('div.pan-events'))}
get jqPanFilter(){return this._jqPanFilter||defP(this,'_jqPanFilter',this.jqObj.find('div.pan-filter'))}
get btnClose(){return this.jqObj.find('.toolbox .btn-close')}
get btnFiltre(){return this.jqObj.find('.toolbox .btn-filtre')}
get domId(){return this._domId||defP(this,'_domId', `eventer-${this.id}`)}

}
