'use strict'
/**
  Méthodes d'helper des FAEvents

**/
Object.assign(FAEvent.prototype,{

/**
  Méthode pour
**/
toString(){
  if(undefined === this._tostring){
    this._tostring = `Event #${this.id} (${this.isScene ? `scène ${this.numero}` : this.type})`
  }
  return this._tostring
}


/**
  Renvoie toutes les présentations possible de l'event, quel que soit son
  type.

  Note
  ----
    Pour les affichages particuliers, on ne doit pas implémenter cette
    méthode pour le type d'event concerné, mais plutôt définir une
    méthode as<Format> qui retournera l'élément voulu.

  @param {String} format  Le format de retour
  @param {Number} flag    Le drapeau permettant de déterminer les détails
                          du retour, comme la présence des boutons d'édition,
                          l'ajout de la durée, etc.
                          DUREE|TIME|LINKED|LABELLED
                          Voir dans le fichier suivant la définition du flag
                          ./app/js/common/FAEvent/constants.js
  @param {Object} options Options à utiliser
                          :no_warn    Si true, pas d'avertissement pour dire que
                                      c'est un modèle non personnalisé par
                                      la sous-classe.
                          :forBook    Si true, s'est une transformation pour le
                                      livre. Affecte les liens, pour le moment.
                          :altText    Texte alternatif pour le spanRef.
                          as:   'dom' ou 'string'
**/
, as(format, flag, opts){
  // console.log("-> as", format, flag, opts)
  if (undefined === flag) flag = 0
  if (undefined === opts) opts = {}

  // La liste dans laquelle on va mettre tous les DOMElements fabriqués
  var domEls = []
  this.asDomList = []

  // L'event est-il lié à l'image courante de son temps ?
  // Si oui, on la met devant l'event
  this.needCurImage() && this.add2asDomList('curImageDiv', opts)

  flag & LABELLED && this.add2asDomList('spanRef', opts)

  switch (format) {
    case 'ref':
      this.add2asDomList('asRef', opts)
      break
    case STRshort:
      this.add2asDomList('asShort', opts)
      break
    case STRbook:
      // Sortie pour le livre
      this.add2asDomList('asBook', opts)
      break
    case 'pitch':
      this.add2asDomList('asPitch', opts)
      break
    case STRfull:
      this.add2asDomList('asFull', opts)
      flag = flag | ASSOCIATES
      break
    case STRassociate:
      this.add2asDomList('asAssociate', opts, flag)
      break
    default:
      throw(`Je ne connais pas le format "${format}"`)
  }

  (flag & ASSOCIATES) && this.hasAssociates() && this.add2asDomList('divsAssociates', Object.assign({},opts,{as:'dom',inDiv:true,}))
  if(flag & DUREE)      this.add2asDomList('spanDuree', opts)
  if (flag & LINKED)    this.add2asDomList('showLink', opts)
  if (flag & EDITABLE)  this.add2asDomList('editLink', opts)

  // --- LE DIV FINAL ---

  // Avec tous ses éléments ajoutés en fonction des choix
  // console.log("this.asDomList:",this.asDomList)
  let attrs = {}
  attrs[STRdata_type] = STRevent
  attrs[STRdata_id]   = this.id
  let divAs = DCreate(DIV, {class:`event ${this.type} EVT${this.id}`, append:this.asDomList, attrs: attrs})

  if(opts.as === 'dom') return divAs

  // --- LE STRING FINAL ---
  // La version string résultant du travail d'assemblage
  let str = divAs.outerHTML

  if(flag & ESCAPED){
    // Version escapée de l'élément, une version qui sert pour les attributs
    // title ou alt dans les balises HTML.
    str = str.replace(/<(.*?)>/g, '')
    str = str.replace(/\"/g, '\\\"')
    str = str.replace(/[\n\r]/,' --- ')
  }

  return str
}

/**
  Plutôt que de rentrer directement les éléments DOM dans la liste +domEls+
  de l'event, on l'ajoute par cette méthode qui permet de vérifier que les
  méthodes retournent bien les éléments voulus (à commencer par des DOMElements)
**/
, add2asDomList(buildProp, options, flag){
    var res = this[buildProp](options, flag)
    if(undefined === res){
      log.error(`La propriété de construction ${buildProp} de ${this} n'a rien retourné.`)
    } else if(Array.isArray(res)){
      this.asDomList.push(...res)
    } else {
      this.asDomList.push(res)
    }
}

// Comme une simple référence (ne pas confondre avec le label qui indique
// le type de l'event et son ID)
// Cette méthode devrait être propre aux events spéciaux, comme les QRDs par
// exemple
, asRef(opts){
    var str = DFormater(this.f_titre || this.titre || this.pitch || this.content)
    if(str.length > 100) str = `${str.substring(0,99)}…` // des balises peuvent être coupées…
    return DCreate(SPAN, {class:'ref', inner: str})
  }

// Version courte commune
, asShort(opts){
    let divs = []
    if(this.titre) divs.push(DCreate(SPAN,{class:'titre',inner: DFormater(this.titre)}))
    divs.push(DCreate(SPAN,{class:'content', inner: DFormater(this.content)}))
    return divs
  }

/**
  Retourne le DOMElement du span indiquant la référence à l'élément
  C'est le span utilisé quand le drapeau contient LABELLED
**/
, spanRef(opts){
  if(undefined === opts) opts = {}
  let span = DCreate(SPAN, {class:'ref', inner: `${opts.altText || this.tinyName} #${this.id}`})
  if(opts.as === 'string') return span.outerHTML
  else return span
}

, spanDuree(opts){
    return DCreate(SPAN,{class:'duree', inner:` (${this.hduree})`})
  }

/**
  Retourne le DOMElement du lien permettant d'éditer l'élément
  C'est le lien utilisé quand le drapeau contient EDITABLE
**/
, editLink(){
  return DCreate(A, {class:'lktool lkedit', inner:'edit', attrs:{onclick:`EventForm.editEvent.bind(EventForm)(${this.id})`}})
}

, showLink(){
  return DCreate(A, {class:'lktool btn', inner:'voir', attrs:{onclick:`showEvent(${this.id})`}})
}

// Version livre commune
, asBook(opts){
    if(undefined === opts) opts = {}
    opts.forBook = true
    return this.inItsDiv(this.asFull(opts))
  }
,
/**
  Version complète de l'event

  Pour le Reader, sauf si opts.forBook, c'est alors pour le livre d'analyse

  Noter que les associés seront ajoutés après, dans la méthode principale 'as'
**/
asFull(opts){
  var divs = []
  if(undefined === opts) opts = {}
  opts.no_warm = true // pour la version short
  divs.push(...this.asShort(opts))
  return divs
}
,
// Version associée, quand l'event est présenté en tant
// qu'associé dans un autre event
asAssociate(opts){
  var divs = []
  // divs.push(this.spanRef(opts /* si texte alternatif */))
  if(this.titre){
    divs.push(DCreate(SPAN, {class:'titre', inner: this.f_titre || DFormater(this.titre)}))
  }
  divs.push(DCreate(SPAN, {class:'content', inner: DFormater(this.content)}))
  if(opts.owner){
    // Si les options définissent un owner, on ajoute un lien pour pouvoir
    // dissocier le temps de son possesseur
    // divs.push(FAEvent.linkDissocier({owner: opts.owner, owned: this}))
    divs.push(this.dissociateLink({owner: opts.owner}))
  }
  return DCreate(DIV, {class:`associate ${this.type} EVT${this.id}`, append:divs})
}

/**
  Retourne l'event quelconque "dans son div" principal, avec les classes et
  l'identifiant requis
**/
, inItsDiv(divs, opts){
    var css = [this.type]
    if(undefined !== this.metaType) css.push(this.metaType)
    return DCreate(DIV,{id:this.domId, class:css.join(' '), append:divs})
  }


})

Object.defineProperties(FAEvent.prototype,{
  /**
    Retourne le div qui s'affichera dans le reader

    Son contenu propre provient de la méthode `as(STRfull)` donc
    de la méthode `asFull` qui peut être propre à l'event.

    @return {DOMElement} Le div à placer dans le reader
  **/
  div:{
    get(){
      if (isUndefined(this._div)){
        // flag pour la méthode 'as'
        var asFlag = FORMATED
        if(!this.isScene) asFlag = asFlag | LABELLED
        // L'horloge des outils
        var h = DCreate(SPAN,{
          class:'horloge horloge-event'
        , attrs:{STRdata_id: this.id}
        , inner: this.otime.horloge
        })
        var be = DCreate(BUTTON, {class: 'btn-edit', inner: '<img src="./img/btn/edit.png" class="btn" />'})
        var br = DCreate(BUTTON, {class: 'btnplay left', attrs: {'size': 22}})

        var attrs = {'data-time':this.time}
        attrs[STRdata_id]   = this.id
        attrs[STRdata_type] = STRevent
        this._div = DCreate(DIV,{
          id: this.domReaderId
        , class: `reader-event event ${this.type} EVT${this.id}`
        , attrs: attrs
        , append: [
            DCreate(DIV,{class: 'e-tools', append:[br, be, h]})
          , DCreate(DIV, {class:'content', inner: this.as(STRfull, asFlag)})
          ]
        })
      }
      return this._div
    }
  }
, link:{
    get(){return `-&gt; <a onclick="current_analyse.locator.setTime(${this.otime.vtime})">E #${this.id}</a>`}
  }

})
