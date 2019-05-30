'use strict'

// Constante qui sera exportée et ajouté à InfosFilm.prototype
const INFOSFILM_METHS = {

  display(){ this.fwindow.show() }
, close()  { this.fwindow.hide()}

/**
  Construit le corps de la fenêtre, qui doit servir aussi à afficher les
  informations dans l'application que dans le livre (infos du film)
**/
, buildBody(){

    if(isFalse(this.dataExistent)) return

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
    , ['frame1', 'Première image', 'optionnel']
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

, build(){

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
      , DCreate(BUTTON, {inner: 'Éditer', class: 'btn-edit small fleft'})
      , DCreate(BUTTON, {type:BUTTON, inner: OK, class: 'btn-ok main-button small'})
      ]})
    ]
  }

, observe(){
    this.fwindow.jqObj.find('.btn-ok').on(STRclick, this.close.bind(this))
    this.fwindow.jqObj.find('.btn-edit').on(STRclick, this.edit.bind(this))
    this.fwindow.jqObj.find('.btn-update').on(STRclick, this.update.bind(this))
  }

// ---------------------------------------------------------------------
// Méthodes d'helper

, libval(prop, libelle){
    return DLibVal(this, `f_${prop}`, libelle, undefined, {class: `w40-60 ${prop}`})
  }

/**
  Méthode qui répond au bouton 'Éditer' pour mettre les informations en
  édition.
**/
, edit(e){
  this.a.openDocInDataEditor('infos')
  return stopEvent(e)
}
/**
  Méthode qui répond au bouton 'Actualiser', pour actualiser l'affichage sans
  recharger la page.
**/
, update(){
    delete this._data
    for(var prop in this.data /* rechargé */){
      isDefined(this[`_${prop}`]) && ( delete this[`_${prop}`] )
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
// Méthodes fonctionnelles et de formatage des data

, addError(prop, msg){
    isDefined(this.errors) || ( this.errors = [] )
    msg = msg || `La propriété "${prop}" doit être définie.`
    this.errors.push(msg)
    return
  }

, formate_prop_or_warning(prop, bad_values){
    if(!this[prop] || (bad_values && bad_values.indexOf(this[prop]) > -1)) {
      // return this.addError(prop)
    } else {
      return DFormater(this[prop])
    }
  }

, formate_prop_time_or_warning(prop){
    if(!this[prop]){
      // return this.addError(prop, `Le temps "${prop}" doit être défini.`)
    } else {
      return new OTime(this[prop]).horloge_simple
    }
  }

, formateAsPeopleList(people){
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
, dateOrNull(dateProp){
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
, timeOrNull(timeProp){
    if(!this.data[timeProp]) return this.data[timeProp]
    return (this.data[timeProp].toLowerCase().substring(0,7) === 'h:mm:ss') ? null : this.data[timeProp]
  }


} // /INFOSFILM_METHS

const INFOSFILM_PROPS = {
  version:{get(){'version formatée des données'}}
, f_title:{get(){ return this.formate_prop_or_warning('title', ['TITRE DU FILM'])}}
, f_title_fr:{get(){ return this.data.title_fr}}
, f_date:{get(){return this.date}}
, f_zero:{get(){return this.zero}}
, f_realisation:{get(){return this._realisation||defP(this,'_realisation', this.formateAsPeopleList(this.realisation))}}
, f_production:{get(){return this._production||defP(this,'_production', this.formateAsPeopleList(this.production))}}
, f_ecriture:{get(){return this._ecriture||defP(this,'_ecriture', this.formateAsPeopleList(this.ecriture))}}
, f_frame1:{get(){
    if (this.frame1_time && this.frame1_description){
      return `à ${new OTime(this.frame1_time).horloge}, ${DFormater(this.frame1_description)}`
    } else {
      return DCreate(DIV, {class:'warning', inner:'Il faut définir le temps et la description de la première image du film.'}).outerHTML
    }
  }}
, f_analystes:{get(){return this._analystes||defP(this,'_analystes', this.formateAsPeopleList(this.analystes))}}
, f_correcteurs:{get(){return this._correcteurs||defP(this,'_correcteurs', this.formateAsPeopleList(this.correcteurs))}}
, f_date_debut:{get(){return this.formate_prop_or_warning('date_debut')}}
, f_date_fin:{get(){return this.formate_prop_or_warning('date_fin')}}
}

module.exports = {
  INFOSFILM_METHS:INFOSFILM_METHS
, INFOSFILM_PROPS:INFOSFILM_PROPS
}
