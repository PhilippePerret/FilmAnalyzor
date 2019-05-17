'use strict'


class FAInfosFilm {
constructor(analyse){
  this.analyse = this.a = analyse || current_analyse
}
toggle(){ this.fwindow.toggle()}
display(){ this.fwindow.show() }
close()  { this.fwindow.hide()}

/**
  Construit le corps de la fenêtre, qui doit servir aussi à afficher les
  informations dans l'application que dans le livre (infos du film)
**/
buildBody(){

  if(false === this.dataExistent) return

  let divsInfos = []

  var arr = [
    [H3, 'Fiche d’identité']
  , ['title', 'Titre du film']
  , ['title_fr', 'Titre français', 'optionnel']
  , ['realisation', 'Réalisation']
  , ['production', 'Production', 'optionnel']
  , ['ecriture', 'Écriture']
  , ['date', 'Date de sortie', 'optionnel']
  , [H3, 'Vidéo/analyse']
  , ['EXPLAIN', 'Ces informations doivent permettre de synchroniser votre vidéo avec l’analyse.']
  , 'separator'
  , ['zero', 'Temps 0:00:00']
  , ['first_image', 'Première image', 'optionnel']
  , ['end_time', 'Temps de fin', 'optionnel']
  , ['generic_end_time', 'Fin du générique', 'optionnel']
  , [H3, 'Analyse']
  , ['date_debut', 'Début de l’analyse']
  , ['date_fin', 'Fin de l’analyse']
  , ['analystes', 'Analystes']
  , ['correcteurs', 'Correcteurs/rices', 'optionnel']
  ]
  arr.map( duo => {
    if(duo === 'separator'){
      divsInfos.push(DCreate(DIV, {class:'separator', style:'height:12px;'}))
    } else if(duo[0] == H3) {
      divsInfos.push(DCreate(H3, {inner: duo[1]}))
    } else if(duo[0] == 'EXPLAIN') {
      divsInfos.push(DCreate(DIV, {inner: duo[1], class:'small explication'}))
    } else {
      // Une propriété du film
      // Note : il faut qu'elle soit définie pour qu'on la marque
      if (this[duo[0]]){
        if(this[`f_${duo[0]}`]){ divsInfos.push(this.libval(...duo)) }
      } else if(duo[2]!='optionnel'){
        this.addError(duo[0])
      }
    }
  })
  return divsInfos
}
build(){

  if (this.errors && this.errors.length){
    F.error(this.errors.join(RC))
    delete this.errors
  }

  let divs = []
  // console.log("this.dataExistent:", this.dataExistent)
  if (this.dataExistent){
    divs = this.buildBody()
  } else {
    this.log('Pas de fichier analyse_files/infos.yaml => Je ne peux pas faire la fiche infos du film', {error: true})
    divs.push(DCreate(DIV,{class:'warning', inner: 'Aucune information n’a été donnée sur les films… Éditer le fichier infos pour y remédier'}))
  }

  return [
    DCreate(DIV, {class: STRheader, append:[
        DCreate(H3, {inner: 'INFORMATIONS TECHNIQUES SUR LE FILM'})
      ]})
  , DCreate(DIV, {class:STRbody, append: divs})
  , DCreate(DIV, {class:STRfooter, append:[
      DCreate(BUTTON, {inner: 'Actualiser', class: 'btn-update small fleft'})
    , DCreate(BUTTON, {type:BUTTON, inner: OK, class: 'btn-ok main-button small'})
    ]})
  ]
}
observe(){
  this.fwindow.jqObj.find('.btn-ok').on(STRclick, this.close.bind(this))
  this.fwindow.jqObj.find('.btn-update').on(STRclick, this.update.bind(this))
}
// ---------------------------------------------------------------------
// Méthodes d'helper

libval(prop, libelle){
  return DLibVal(this, `f_${prop}`, libelle, undefined, {class: `w40-60 ${prop}`})
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
    return DCreate(DIV, {class:'warning', inner:'Il faut définir le temps et la description de la première image du film.'}).outerHTML
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
  // console.log("people:",people)
  people.map(real => {
    [nom, prenom, fonction] = real.split(',').map(n => n.trim())
    if(nom && nom.toLowerCase() == 'nom') return
    if(prenom && prenom.toLowerCase() == 'prénom') return
    patro = `${prenom||''} ${nom||''}`
    if(fonction) patro += ` (${fonction})`
    arr.push(patro)
  })
  if(arr.length){
    return arr.join(', ')
  } else {
    return null
  }
}

// Si la date est 'JJ/MM/YYYY', retourne null
dateOrNull(dateProp){
  try {
    let val = this.data[dateProp]
    if(!val) return val
    if(isNumber(val)) return `${val}` // juste l'année, par exemple
    return val.match(REG_DATE) ? val : null
  } catch (e) {
    console.error(`Problème avec la propriété "${dateProp}" de valeur ${val} de typeof ${typeof(val)}`)
    console.error(e)
    return null
  }
}

// Si le temps est 'H:MM:SS' ou 'H:MM:SS.fr', return null, sinon, le temps
timeOrNull(timeProp){
  if(!this.data[timeProp]) return this.data[timeProp]
  return (this.data[timeProp].toLowerCase().substring(0,7) === 'h:mm:ss') ? null : this.data[timeProp]
}

}

module.exports = FAInfosFilm
