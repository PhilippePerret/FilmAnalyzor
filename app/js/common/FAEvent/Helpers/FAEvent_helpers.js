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
    // this._tostring = `<<EVENT type=${this.type} id=${this.id}>>`
    this._tostring = `l'Event ${this.type} #${this.id}`
  }
  return this._tostring
}
/**
  Renvoie toutes les présentations possible de la scène

  @param {String} format  Le format de retour
  @param {Number} flag    Le drapeau permettant de déterminer les détails
                          du retour, comme la présence des boutons d'édition,
                          l'ajout de la durée, etc.
                          DUREE|TIME|LINKED|LABELLED
  @param {Object} options Options à utiliser
                          :no_warn    Si true, pas d'avertissement pour dire que
                                      c'est un modèle non personnalisé par
                                      la sous-classe.
                          :forBook    Si true, s'est une transformation pour le
                                      livre. Affecte les liens, pour le moment.
                          :altText    Texte alternatif pour le spanRef.
**/
, as(format, flag, opts){
  if (undefined === flag) flag = 0
  if (undefined === opts) opts = {}

  // La liste dans laquelle on va mettre tous les DOMElements fabriqués
  var domEls = []

  if(flag & LABELLED) domEls.push(this.spanRef(opts))

  switch (format) {
    case 'ref':
      domEls.push(this.asRef(opts))
      break
    case 'short':
      domEls.push(...this.asShort(opts))
      break
    case 'book':
      // Sortie pour le livre
      domEls.push(...this.asBook(opts))
      break
    case 'pitch':
      // Pour le méthode qui répondent à la méthode `asPitch`
      // à commencer par la scène
      domEls.push(...this.asPitch(opts))
      break
    case 'full':
      // Affiche complet, avec toutes les informations
      // TODO Pour le moment, c'est ce format qui est utilisé pour le reader,
      // mais ce n'est peut-être pas la meilleure option.
      domEls.push(...this.asFull(opts))
      break
    case 'associate':
      domEls.push(this.asAssociate(opts, flag))
      break
    default:
      domEls.push(DCreate('SPAN',{class:'titre',inner: this.title}))
  }


  // if(flag & DUREE) str += ` (${this.hduree})`
  if(flag & DUREE) domEls.push(DCreate('SPAN',{class:'duree', inner:` (${this.hduree})`}))

  if(flag & EDITABLE) domEls.push(this.editLink(opts))
  else if (flag & LINKED) domEls.push(this.showLink(opts))

  // --- LE DIV FINAL ---
  // Avec tous ses éléments ajoutés en fonction des choix
  // console.log("domEls:",domEls)
  let divAs = DCreate('DIV', {class:`${this.type} EVT${this.id}`, append: domEls})

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

// Comme une simple référence (ne pas confondre avec le label qui indique
// le type de l'event et son ID)
// Cette méthode devrait être propre aux events spéciaux, comme les QRDs par
// exemple
, asRef(opts){
    var str = DFormater(this.f_titre || this.titre || this.pitch || this.content)
    if(str.length > 100) str = `${str.substring(0,99)}…` // des balises peuvent être coupées…
    return DCreate('SPAN', {class:'ref', inner: str})
  }

// Version courte commune
, asShort(opts){
    let divs = []
    if(this.titre) divs.push(DCreate('SPAN',{class:'titre',inner: DFormater(this.titre)}))
    divs.push(DCreate('SPAN',{class:'content', inner: DFormater(this.content)}))
    if(!opts || !opts.no_warm) divs.push(this.warnCommonMethod)
    return divs
  }

/**
  Retourne le DOMElement du span indiquant la référence à l'élément
  C'est le span utilisé quand le drapeau contient LABELLED
**/
, spanRef(opts){
  if(undefined === opts) opts = {}
  let span = DCreate('SPAN', {class:'ref', inner: `${opts.altText || this.tinyName} #${this.id}`})
  if(opts.as === 'string') return span.outerHTML
  else return span
}

/**
  Retourne le DOMElement du lien permettant d'éditer l'élément
  C'est le lien utilisé quand le drapeau contient EDITABLE
**/
, editLink(){
  return DCreate('A', {class:'lkevent', inner:'[edit]', attrs:{onclick:`EventForm.editEvent.bind(EventForm)(${this.id})`}})
}

, showLink(){
  return DCreate('A', {class:'lkevent', inner:'[voir]', attrs:{onclick:`showEvent(${this.id})`}})
}

// Version livre commune
, asBook(opts){
    var divs = []
    divs.push(this.warnCommonMethod)
    return divs
  }
,
// Version complète (reader) commune
// C'est la version qui est ajoutée au `div` contenant les
// boutons d'édition, etc.
asFull(opts){
  var divs = []
  if(undefined === opts) opts = {}
  opts.no_warm = true // pour la version short
  divs.push(...this.asShort(opts))
  if(!opts || !opts.no_warm) divs.push(this.warnCommonMethod)
  let divAssos = this.divAssociates(opts)
  // console.log("divAssos:", divAssos)
  divAssos && divs.push(...divAssos)
  return divs
}
,
// Version associée, quand l'event est présenté en tant
// qu'associé dans un autre event
asAssociate(opts){
  var divs = []
  divs.push(this.spanRef(opts /* si texte alternatif */))
  if(this.titre){
    divs.push(DCreate('SPAN', {class:'titre', inner: this.f_titre || DFormater(this.titre)}))
  }
  divs.push(DCreate('SPAN', {class:'content', inner: DFormater(this.content)}))
  return DCreate('DIV', {class:`associate ${this.type} EVT${this.id}`, append:divs})
}

/**

  Retourne le div contenant les associés de type +type+ ou un
  string vide.

  @param  {String} type Le type ('event', 'document' ou 'time')
          {Object} Les options.
  @return {String} Le code HTML
**/
, divAssociates(type){
    let my = this
    var options
    switch (typeof type) {
      case 'string':
        options = {types: [type]}
        break
      case 'object':
        options = type
        if(undefined === options.types){
          options.types = ['events','documents','times']
        }
        break
      default:
        log.warn("Mauvais argument pour divAssociates: ", type)
        return // indefined
    }
    var divs = []
      , divsAss = []
    for(type of options.types){
      // console.log("Traitement du type", type)
      if(this[type].length === 0) continue
      divs.push(DCreate('H3', {inner:`${FATexte.htypeFor(type, {title: true, after: 'associé_e_s'})}`}))
      this.forEachAssociate(type, function(ev){
        if(undefined === ev){
          log.error(`[FAEvent#divAssociates] Event non défini dans la boucle "forEachAssociate" de l'event #${my.id}:${my.type}`)
        } else {
          options.owner = {type:'event', id: my.id}
          divsAss.push(ev.asAssociate(options))
        }
      })
      // console.log("[FAEvent#divAssociates] divsAss:", divsAss)
      divs.push(DCreate('DIV', {append:divsAss, class:`associates ${type}`}))
    }
    // console.log("divs associateds:", divs)
    if(divs.length) return divs
  }

})

Object.defineProperties(FAEvent.prototype,{
  /**
    Retourne le div qui s'affichera dans le reader

    Son contenu propre provient de la méthode `as('full')` donc
    de la méthode `asFull` qui devrait être propre à l'event.

    @return {DOMElement} Le div à placer dans le reader
  **/
  div:{
    get(){
      if (undefined === this._div){
        // flag pour la méthode 'as'
        var asFlag = FORMATED
        if(this.type !== 'scene') asFlag = asFlag | LABELLED
        // L'horloge des outils
        var h = DCreate('SPAN',{
          class:'horloge horloge-event'
        , attrs:{'data-id': this.id}
        , inner: this.otime.horloge
        })
        var be = DCreate('BUTTON', {class: 'btn-edit', inner: '<img src="./img/btn/edit.png" class="btn" />'})
        var br = DCreate('BUTTON', {class: 'btnplay left', attrs: {'size': 22}})

        var etools = DCreate('DIV',{class: 'e-tools', append:[br, be, h]})
        var cont = DCreate('DIV', {class:'content', inner: this.as('full', asFlag)})

        this._div = DCreate('DIV',{
          id: this.domId
        , class: `reader-event event ${this.type} EVT${this.id}`
        , style: 'opacity:0;'
        , attrs: {'data-time':this.time, 'data-id':this.id, 'data-type': 'event'}
        , append: [etools, cont]
        })
      }
      return this._div
    }
  }
, link:{
    get(){return `-&gt; <a onclick="current_analyse.locator.setTime(${this.otime.vtime})">E #${this.id}</a>`}
  }
// Méthode de warning pour indiquer que la version d'affichage courante
// est une version commune à tous les events, pas adaptée à l'event en
// particulier. Elle s'affichera jusqu'à ce que l'event en particulier
// possède sa propre méthode d'helper.
, warnCommonMethod: {
    get(){
      if (undefined === this._warnCommonMethod){
        this._warnCommonMethod = DCreate('DIV', {class:'tiny', inner: "Cette version est la version commune d’affichage de l’event. Pour une version personnalisée, créer la méthode `asFull`."})
      }
    }
  }

})
