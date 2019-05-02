'use strict'

module.exports = function(options){
  var my = this
  my.log("* Construction des statistiques…")
  let str = ''
  str += '<h1 id="statistiques-title">Statistiques</h1>'
  str += '<section id="statistiques">'
  str += my.generalDescriptionOf('statistiques')
  str += FAStatistiques.output()
  str += '</section>'
  my = null
  return str
}

const FAStatistiques = {
  class:  'FAStatistiques'
, type:   'object'
/**
  Méthode retournant le code final des statistiques telles
  qu'elles doivent être écrites dans le livre.
**/
, output(options){
    // Les "briques" des statistiques
    var appends = []
    FAPersonnage.count  && appends.push(this.divStatsPersonnages())
    FAEscene.count      && appends.push(this.divStatsScenes())
    FABrin.count        && appends.push(this.divStatsDecors())
    // Le div final (body)
    let div = DCreate('DIV', {class:'body', append:appends})

    // Garbage collector
    delete FAEscene.divscenesCount
    appends = null

    if(options && options.format === 'dom'){
      return div
    } else {
      return div.outerHTML
    }
  } // /output

/**
  Bloc principal de statistiques sur les personnages
**/
, divStatsPersonnages(){

    var pre = `

Nombre personnages   ${FAPersonnage.count}

    `
    return DCreate('DIV', {class: 'stats-personnages', append:[
      DCreate('H2', {inner: 'Statistiques sur les personnages'})
    , DLibVal(FAPersonnage, 'count', 'Nombre de personnages', 'w40-60')
    , DCreate('H3', {inner: 'Temps de présence des personnages'})
    , DCreate('DIV', {append: FAPersonnage.perPresenceTime()})
    ]})
  }

/**
  Bloc principal de statistiques sur les scènes
**/
, divStatsScenes(){
    var my = this
    return DCreate('DIV', {class: 'stats-scenes', append:[
      DCreate('H2', {inner: 'Statistiques sur les scènes'})
    , DLibVal(FAEscene, 'count', 'Nombre de scènes', 'w40-60')
    , DLibVal(FAEscene, 'dureeMoyenne', 'Durée moyenne', 'w40-60')
    , DLibVal(FAEscene, 'plusLongue', 'La plus longue')
    , DLibVal(FAEscene, 'plusCourte', 'La plus courte')
    , DCreate('H3', {inner: 'Les dix scènes les plus longues'})
    , DCreate('DIV', {class: 'div', append: FAEscene.perMaxLongueur()})
    , DCreate('H3', {inner: 'Les dix scènes les plus courtes'})
    , DCreate('DIV', {class: 'div', append: FAEscene.perMinLongueur()})
    ]})
}

/**
  Bloc principal des statistiques sur les DÉCORS

  Il consiste en la liste complète des décors et sous-décors avec,
  pour chacun d'eux, le temps d'utilisation dans le film.
**/
, divStatsDecors(){
    let my = this

    var decorsList = []
    decorsList.push(DCreate('DIV', {class:'libval w60-20-20', append:[
      DCreate('SPAN', {inner: 'Décor/sous-décor', class: 'label'})
    , DCreate('SPAN', {inner: 'Scènes', class: 'label center'})
    , DCreate('SPAN', {inner: 'Durée',   class: 'label center'})
    ]}))

    FADecor.forEachDecor(function(decor){
      decorsList.push(decor.asStats())
    })

    return DCreate('DIV', {class: 'stats-decors', append:[
      DCreate('H2', {inner:'Statistiques sur les décors'})
    , DLibVal(FAEscene, 'decorsCount', 'Nombre de décors', 'w40-60')
    , DCreate('DIV', {append: decorsList})
    ]})
}


}// /FAStatistiques

/** ---------------------------------------------------------------------
  Extension de la classe SCENE pour les STATISTIQUES
**/
Object.assign(FAEscene,{
  get dureeMoyenne(){
    return `${new OTime(FAEscene.a.duree / FAEscene.count).duree_sec} secs`
  }
, get plusLongue(){
    this._longest_scene || this.searchLongestShortest()
    return `${this._longest_scene.as('short', DUREE|FORMATED)}`
  }
, get plusCourte(){
    this._shortest_scene || this.searchLongestShortest()
    return `${this._shortest_scene.as('short', DUREE|FORMATED)}`
  }
, searchLongestShortest(){
    if (undefined === this._longest_scene){
      var sc_max = {duree: 0}
      var sc_min = {duree: 1000000}
      FAEscene.forEachScene(function(sc){
        if(sc.duree > sc_max.duree) sc_max = sc
        if(sc.duree < sc_min.duree) sc_min = sc
      })
      this._longest_scene   = sc_max
      this._shortest_scene  = sc_min
    }
  }
})

/**
  Retourne les divs des 10 SCÈNES les plus longues
**/
FAEscene.perMaxLongueur = function(){
  var my = this
  let divs = []
    , lignesScenes = []
  for(var i = 0; i < 10; ++i){
    let sc = this.sortedByDuree[i]
    if(undefined === sc) break
    // divs.push(DCreate('DIV', {class: 'libval first-small', append:[
    //     DCreate('LABEL',  {class:'bold', inner: sc.hduree})
    //   , DCreate('SPAN',   {inner: sc.as('short', FORMATED)})
    // ]}))
    lignesScenes.push(`${sc.hduree.padStart(7)}   ${sc.as('short', FORMATED)}`)
  }
  // return divs
  return DCreate('PRE', {inner: lignesScenes.join(RC)})
}
FAEscene.perMinLongueur = function(){
  var my = this
    , divs = []
    , arr = Object.assign([], this.sortedByDuree)
    , sc
    , lignesScenes = []
  arr.reverse()
  for(var i = 0; i < 10; ++i){
    sc = arr[i]
    if(undefined === sc) break
    // divs.push(DCreate('DIV', {class: 'libval first-small', append:[
    //   DCreate('LABEL',  {class:'bold', inner: sc.hduree})
    // , DCreate('SPAN',   {inner: sc.as('short', FORMATED)})
    // ]}))
    lignesScenes.push(`${sc.hduree.padStart(7)}   ${sc.as('short', FORMATED)}`)
  }
  // return divs
  return DCreate('PRE', {inner: lignesScenes.join(RC)})
}

/**
  Extension de la classe PERSONNAGES pour les STATISTIQUES
**/
// Retourne les DIV des dix personnages les plus présents
// dans le film.
FAPersonnage.perPresenceTime = function(){
  let divs = []
    , persos = Object.assign([], this.personnages)

  persos.sort(function(a,b){a.presence - b.presence})

  for(var i = 0 ; i < 10 ; ++i){
    if(undefined === persos[i]) break
    divs.push(DLibVal(persos[i], 'f_presence', persos[i].pseudo))
  }
  return divs
}
Object.defineProperties(FAPersonnage.prototype,{
  /**
    Renvoie le temps de présence du personnage dans le film. Ce temps
    est calculé en fonction de sa présence dans la scène, qu'on trouve
    par le biais de son diminutif dans la description ou le pitch.
  **/
  presence:{
    get(){return this._presence||defP(this,'_presence', this.calcPresence())}
  }
, f_presence:{
    get(){return this._f_presence||defP(this,'_f_presence', this.formatePresence())}
  }
})
/**
  Calcule le temps de présence du personnage dans le film en
  fonction de sa présence dans les scènes.
**/
FAPersonnage.prototype.calcPresence = function(){
  let time = 0
    , reg = new RegExp(`(^|[^a-zA-Z0-9_])@${this.dim}([^a-zA-Z0-9_]|$)`)
  FAEscene.forEachScene(function(scene){
    if(scene.pitch.match(reg) || scene.resume.match(reg)){
      time += scene.duree
    }
  })
  return time
}
/**
  Méthode qui met en forme le temps de PRÉSENCE du PERSONNAGE pour
  les statistiques.
  On doit afficher la durée totale et le pourcentage de temps
  que sa représence.
**/
FAPersonnage.prototype.formatePresence = function(){
  let otime = new OTime(this.presence)
  return `${otime.hduree} (${asPourcentage(this.a.duree, this.presence)})`
}


FADecor.prototype.asStats = function(){
  var divsSousDecors = []
  for(var sdecor in this.sousDecors){
    divsSousDecors.push(this.sousDecors[sdecor].asStats())
  }
  return DCreate('DIV', {append:[
    DCreate('DIV', {class: 'libval w60-20-20', append:[
        DCreate('SPAN', {inner: this.name})
      , DCreate('SPAN', {inner: this.scenesCount, class: 'center'})
      , DCreate('SPAN', {inner: this.hduree, class: 'center'})
      ]})
  , DCreate('DIV', {append: divsSousDecors})
  ]})
}

FASousDecor.prototype.asStats = function(){
  return DCreate('DIV', {class: 'libval w10-50-20-20', append:[
    DCreate('SPAN', {inner: ' '})
  , DCreate('SPAN', {inner: this.name})
  , DCreate('SPAN', {inner: this.scenesCount, class: 'center'})
  , DCreate('SPAN', {inner: this.hduree, class: 'center'})
  ]})
}

function dureeAndPctForScenesNumeros(numeros){
  var d = 0
  console.log("Numéros de scènes à traiter : ", numeros.join(', '))
  numeros.forEach(num => {
    console.log("Traitement de la scène numéro ", num[0])
    d += FAEscene.getByNumero(num[0]).duree
  })
  // numeros.forEach(num => d += FAEscene.getByNumero(num).duree)
  d = new OTime(d)
  return [d, asPourcentage(current_analyse.duree, d.seconds)]
}

Object.defineProperties(FADecor.prototype,{
  hduree:{
    get(){
      if (undefined === this._hduree){
        let [otime, pourcentage] = dureeAndPctForScenesNumeros(this.scenes)
        this._hduree = `${otime.hduree} (${pourcentage})`
      }
      return this._hduree
    }
  }
})
Object.defineProperties(FASousDecor.prototype,{
  hduree:{
    get(){
      if (undefined === this._hduree){
        let [otime, pourcentage] = dureeAndPctForScenesNumeros(this.scenes)
        this._hduree = `${otime.hduree} (${pourcentage})`
      }
      return this._hduree
    }
  }
})
