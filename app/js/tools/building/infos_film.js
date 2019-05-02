'use strict'


class FAInfosFilm {
constructor(analyse){
  this.analyse = this.a = analyse || current_analyse
}
display(){ this.fwindow.show() }
close()  { this.fwindow.hide()}

/**
  Construit le corps de la fenêtre, qui doit servir aussi à afficher les
  informations dans l'application que dans le livre (infos du film)
**/
buildBody(){
  let divsInfos = []

  var arr = [
    ['H3', 'Fiche d’identité']
  , ['title', 'Titre du film']
  , ['title_fr', 'Titre français', 'optionnel']
  , ['realisation', 'Réalisation']
  , ['production', 'Production']
  , ['ecriture', 'Écriture']
  , ['date', 'Date de sortie']
  , ['H3', 'Vidéo/analyse']
  , ['EXPLAIN', 'Ces informations doivent permettre de synchroniser votre vidéo avec l’analyse.']
  , 'separator'
  , ['zero', '0:00:00 de l’analyse']
  , ['first_image', 'Première image']
  , ['end_time', 'Temps de fin']
  , ['generic_end_time', 'Fin du générique']
  , ['H3', 'Analyse']
  , ['date_debut', 'Début de l’analyse']
  , ['date_fin', 'Fin']
  , ['analystes', 'Analystes']
  , ['correcteurs', 'Correcteurs/rices']
  ]
  arr.map( duo => {
    if(duo === 'separator'){
      divsInfos.push(DCreate('DIV', {class:'separator', style:'height:12px;'}))
    } else if(duo[0] == 'H3') {
      divsInfos.push(DCreate('H3', {inner: duo[1]}))
    } else if(duo[0] == 'EXPLAIN') {
      divsInfos.push(DCreate('DIV', {inner: duo[1], class:'small explication'}))
    } else {
      if(this[`f_${duo[0]}`]){ divsInfos.push(this.libval(...duo)) }
      else if(duo[2]!='optionnel'){this.addError(duo[0])}
    }
  })
  return divsInfos
}
build(){

  if (this.errors && this.errors.length){
    F.error(this.errors.join(RC))
    delete this.errors
  }

  return [
    DCreate('DIV', {class: 'header', append:[
        DCreate('H3', {inner: 'INFORMATIONS TECHNIQUES SUR LE FILM'})
      ]})
  , DCreate('DIV', {class:'body', append: this.buildBody()})
  , DCreate('DIV', {class:'footer', append:[
      DCreate('BUTTON', {inner: 'Actualiser', class: 'btn-update small fleft'})
    , DCreate('BUTTON', {type:'button', inner: 'OK', class: 'btn-ok main-button small'})
    ]})
  ]
}
observe(){
  this.fwindow.jqObj.find('.btn-ok').on('click', this.close.bind(this))
  this.fwindow.jqObj.find('.btn-update').on('click', this.update.bind(this))
}
// ---------------------------------------------------------------------
// Méthodes d'helper

libval(prop, libelle){
  return DLibVal(this, `f_${prop}`, libelle, undefined, {class: 'w40-60'})
}

//  VERSIONS FORMATÉES DES DONNÉES
get f_title(){ return this.formate_prop_or_warning('title', ['TITRE DU FILM'])}
get f_title_fr(){ return this.data.title_fr}
get f_date(){return this.date}
get f_zero(){return this.zero}
get f_realisation(){return this._realisation||defP(this,'_realisation', this.formateAsPeopleList(this.realisation))}
get f_production(){return this._production||defP(this,'_production', this.formateAsPeopleList(this.production))}
get f_ecriture(){return this._ecriture||defP(this,'_ecriture', this.formateAsPeopleList(this.ecriture))}
get f_first_image(){
  if (this.first_image.time && this.first_image.description){
    return `à ${new OTime(this.first_image.time).horloge}, ${DFormater(this.first_image.description)}`
  } else {
    return DCreate('DIV', {class:'warning', inner:'Il faut définir le temps et la description de la première image du film.'}).outerHTML
  }
}
get f_end_time(){
  return this.formate_prop_time_or_warning('end_time')
}
get f_generic_end_time(){
  return this.formate_prop_time_or_warning('generic_end_time')
}
get f_analystes(){return this._analystes||defP(this,'_analystes', this.formateAsPeopleList(this.analystes))}
get f_correcteurs(){return this._correcteurs||defP(this,'_correcteurs', this.formateAsPeopleList(this.correcteurs))}
get f_date_debut(){return this.formate_prop_or_warning('date_debut')}
get f_date_fin(){return this.formate_prop_or_warning('date_fin')}

// ---------------------------------------------------------------------
//  TOUTES LES DONNÉES

get title(){return this.data.title}
get title_fr(){return this.data.title_fr}
get date(){return this._date||defP(this,'_date',this.dateOrNull('date'))}
get realisation(){return this.data.realisation}
get ecriture(){return this.data.ecriture}
get production(){return this.data.production}
get zero(){return this.data.zero}
get first_image(){return this.data.first_image}
get end_time(){return this._end_time||defP(this,'_end_time', this.timeOrNull('end_time'))}
get generic_end_time(){return this._generic_end_time||defP(this,'_generic_end_time', this.timeOrNull('generic_end_time'))}
get date_debut(){return this._date_debut||defP(this,'_date_debut',this.dateOrNull('date_debut'))}
get date_fin(){return this._date_fin||defP(this,'_date_fin',this.dateOrNull('date_fin'))}
get analystes(){return this.data.analystes}
get correcteurs(){return this.data.correcteurs}


get data(){
  if(undefined === this._data){
    this._data = YAML.safeLoad(fs.readFileSync(path.join(this.a.filePathOf('infos.yaml')), 'utf8'))
  }
  return this._data
}

/**
  Méthode qui répond au bouton 'Actualiser', pour actualiser l'affichage sans
  recharger la page.
**/
update(){
  delete this._data
  for(var prop in this.data /* rechargé */){
    if(undefined !== this[`_${prop}`]){ delete this[`_${prop}`]}
    // Effacer toutes les données
    delete this[prop]
    // Effacer toutes les versions formatées
    delete this[`f_${prop}`]
  }
  // On peut maintenant reconstruire la fenêtre
  this.fwindow.remove()
  delete this._fwindow
  this.display()
}

// ---------------------------------------------------------------------
// Méthodes fonctionnelles sur les data

addError(prop, msg){
  if(undefined === this.errors) this.errors = []
  msg = msg || `La propriété "${prop}" doit être définie.`
  this.errors.push(msg)
  return
}

formate_prop_or_warning(prop, bad_values){
  if(!this[prop] || (bad_values && bad_values.indexOf(this[prop]) > -1)) {
    // return this.addError(prop)
  } else {
    return DFormater(this[prop])
  }
}
formate_prop_time_or_warning(prop){
  if(!this[prop]){
    // return this.addError(prop, `Le temps "${prop}" doit être défini.`)
  } else {
    return new OTime(this[prop]).horloge_simple
  }
}

formateAsPeopleList(people){
  if(!people) return
  var arr = [], nom, prenom, fonction, patro
  people.map(real => {
    [nom, prenom, fonction] = real.split(',').map(n => n.trim())
    if(nom.toLowerCase()!= 'nom' && prenom.toLowerCase()!= 'prénom'){
      patro = `${prenom} ${nom}`
      if(fonction) patro += ` (${fonction})`
      arr.push(patro)
    }
  })
  if(arr.length){
    return arr.join(', ')
  } else {
    return null
  }
}

// Si la date est 'JJ/MM/YYYY', retourne null
dateOrNull(dateProp){
  if(!this.data[dateProp]) return this.data[dateProp]
  return this.data[dateProp].match(REG_DATE) ? this.data[dateProp] : null
}

// Si le temps est 'H:MM:SS' ou 'H:MM:SS.fr', return null, sinon, le temps
timeOrNull(timeProp){
  if(!this.data[timeProp]) return this.data[timeProp]
  return (this.data[timeProp].toLowerCase().substring(0,7) === 'h:mm:ss') ? null : this.data[timeProp]
}

// ---------------------------------------------------------------------
// AUTRES PROPRIÉTÉS

get fwindow(){return this._fwindow||defP(this,'_fwindow', new FWindow(this,{class:'fwindow-listing-type infos-film', x:10, y:10}))}

}

module.exports = FAInfosFilm
