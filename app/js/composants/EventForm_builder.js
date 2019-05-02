'use strict'

/**
  @param {String} type    Le type de l'event à retourner
  @return {String}        Le formulaire propre à l'event
**/
module.exports = function(type){
  if(undefined === this.formsByType) this.formsByType = {}
  if(undefined === this.formsByType[type]){
    this.formsByType[type] = this.buildFormOfType(type)
  }
  return this.formsByType[type]
}

EventForm.COMMON_HIDDEN_FIELDS = ['id', 'is_new', 'type']

// @RETURN L'identifiant pour un élément de formulaire
function formId(prop){ return `event-__EID__-${prop}` }

/**
  Construction d'un modèle par type
**/
EventForm.buildFormOfType = function(type){
  var str = ''
    , dom = []
    , prop
    , label
  let prefid = 'event-__EID__'

  for(prop of this.COMMON_HIDDEN_FIELDS){
    dom.push(DCreate('INPUT', {type:'hidden', id:`${prefid}-${prop}`}))
  }

  dom.push(DCreate('SECTION', {class: 'header no-user-selection', append:[
      DCreate('BUTTON', {type:'button', class:'btn-close'})
    , DCreate('SPAN', {class:'event-type', inner: type.toUpperCase()})
    ]}))

  /*  Div supérieur avec temps, durée ou numéro */
  dom.push(DCreate('DIV', {class:'div-infos-temporelles no-user-selection', append:[
    // Le petit bouton droppable pour associer l'event nouveau ou modifié
      DCreate('SPAN', {class: 'event-btn-drop event', inner: '⎆', style: 'background:transparent;', attrs:{
        title: 'Pour glisser et déposer l’event et l’associer'
      , 'data-type':'event', 'data-id':'__EID__'
      }})
    , DCreate('BUTTON', {class:'btnplay right', size: 30})
    , DCreate('LABEL', {inner: 'Position'})
    , DCreate('HORLOGE', {class:'small', id:formId('time'), value:'', inner: '...'})
    , DCreate('LABEL', {inner: 'Durée'})
    , DCreate('DUREE', {id: formId('duree'), class: 'small dureeable'})
    ]}))

  /*  Pour le type particulier de l'event */
  if(type != 'qrd'){
    var fieldsType = []
    fieldsType.push(
        DCreate('LABEL', {inner:type === 'stt' ? 'Type du nœud' : 'Type'})
      , DCreate('SELECT', {id: formId(`${type}Type`), class: `${type}-types`})
    )
    if(type !== 'stt'){
      fieldsType.push(
          DCreate('BUTTON', {type:'button', class:'update btn-update-types', title: T('tit-update-type-list'), append:[
            DCreate('IMG', {src: 'img/update-2.png', alt: 'Actualiser la liste des types'})
          ]})
        , DCreate('BUTTON', {type:'button', class:'modify btn-modify-types', title: T('tit-modify-type-list'), append:[
            DCreate('IMG', {src: 'img/btn-edit.png', alt: 'Modifier la liste des types'})
          ]})
        , DCreate('BUTTON', {type:'button', class:'info btn-info-proc', append:[
            DCreate('IMG', {src: 'img/picto_info_dark.png', alt: 'Information sur le procédé courant', style:`visibility:${type === 'proc'?'visible':'hidden'}`})
          ]})
      )
    }
    dom.push(DCreate('DIV',{class:`div-form div-${type}-types`, append:fieldsType}))
  }

  if( type === 'scene' ){
    dom.push(DCreate('DIV', {class:'div-form', append:[
        DCreate('LABEL', {inner: 'Num.'})
      , DCreate('INPUT', {type:'text', id: formId('numero'), class:'temps-secondes', disabled:'DISABLED'})
      , DCreate('SELECT', {id:formId('lieu'), append:[
          DCreate('OPTION', {value: 'int', inner: 'INT.'})
        , DCreate('OPTION', {value: 'ext', inner: 'EXT.'})
        , DCreate('OPTION', {value: 'extint', inner: 'INT. & EXT.'})
        , DCreate('OPTION', {value: 'n/d', inner: 'N/D'})
        ]})
      , DCreate('SELECT', {id: formId('effet'), append: [
          DCreate('OPTION', {value:'jour',   inner:'JOUR'})
        , DCreate('OPTION', {value:'nuit',   inner:'NUIT'})
        , DCreate('OPTION', {value:'soir',   inner:'SOIR'})
        , DCreate('OPTION', {value:'matin',  inner:'MATIN'})
        , DCreate('OPTION', {value:'noir',   inner:'NOIR'})
        , DCreate('OPTION', {value:'n/d',    inner:'N/D'})
        ]})
      ]}))
  } // si scène

  dom.push(DCreate('DIV', {class:'div-form', append:[
      DCreate('LABEL', {for: formId('titre'), inner: type === 'scene' ? 'Pitch' : 'Titre générique (optionnel)'})
    , DCreate('INPUT', {type:'TEXT', id:formId('titre'), class:'bold'})
    ]}))


  var parentDesign = [DCreate('SPAN', {class:'small', inner:'PARENT (glisser ici l’event parent — '})]
  if(type==='dyna') parentDesign.push(DCreate('SPAN', {class:'small italic', inner:'l’objectif du sous-objectif ou du moyen, l’obstacle du conflit, etc. — '}))
  parentDesign.push(DCreate('SPAN', {class:'small italic', inner:'utilisez par exemple un Eventer)'}))
  dom.push(DCreate('DIV', {class:'div-form', append:[
      DCreate('DIV', {class:'event-parent cadre', append:[
        DCreate('DIV', {class:'parent-designation small', append:parentDesign})
      ]})
    , DCreate('INPUT', {type:'HIDDEN', id:formId('parent'), value:''})
    ]}))

  label = (typ => {
    switch(typ) {
      case 'dyna' : return 'Libellé'
      case 'scene': return 'Décor'
      case 'qrd'  : return 'Question'
      default: return
    }
  })(type)

  if(undefined !== label){
    dom.push(DCreate('DIV', {class:'div-form', append:[
        DCreate('LABEL', {inner:label})
      , DCreate('SELECT', {class:'decors', style:`display:${type==='scene'?'block':'none'};`})
      , DCreate('INPUT', {type:'TEXT', id: formId('shorttext1')})
    ]}))
  }


  label = (typ => {
    switch (typ) {
      case 'scene': return 'Sous-décor'
      case 'qrd':   return 'Réponse'
      default: return
    }
  })(type)

  if(undefined!==label){
    var ds = [DCreate('LABEL',{inner:label})]
    if(type === 'scene') ds.push(DCreate('SELECT', {class:'sous_decors'}))
    ds.push(DCreate('INPUT', {type:'TEXT', id:formId('shorttext2')}))
    if(type === 'qrd'){
      ds.push(DCreate('DIV', {class:'right', append:[
                DCreate('LABEL', {inner:'Temps'})
              , DCreate('INPUT', {type:'TEXT', class:'horloge', id:formId('tps_reponse')})
              ]})
      )
    }
    dom.push(DCreate('DIV', {class:'div-form', append:ds}))
  }

  label = (typ => {
    switch(typ){
      case 'brin'   :return 'Résumé'
      case 'info'   :return 'Information'
      case 'dialog' :return 'Commentaire'
      default: return 'Description'
    }
  })(type)
  dom.push(DCreate('DIV',{class:'div-form', append:[
      DCreate('LABEL', {inner:label})
    , DCreate('TEXTAREA', {id: formId('longtext1'), attrs:{rows: '4'}})
    ]}))

  label = (typ => {
    switch(typ){
      case 'idee':
      case 'proc':    return 'Installation'
      case 'dialog':  return 'Dialogue <span class="small">(les guillemets sont inutiles)</span>'
      default:        return
    }
  })(type)
  if(undefined !== label){
    dom.push(DCreate('DIV', {class:'div-form', append:[
        DCreate('LABEL', {inner:label})
      , DCreate('TEXTAREA', {id: formId('longtext2'), attrs:{rows:'4'}})
      ]}))
  }

  label = (typ => {
    switch(typ){
      case 'qrd':
      case 'idee':
      case 'proc': return 'Exploitations <span class="small">(time: description — sur chaque ligne)</span>'
      default:     return
    }
  })(type)
  if(undefined !== label){
    dom.push(DCreate('DIV', {class:'div-form', append:[
        DCreate('LABEL', {inner:label})
      , DCreate('TEXTAREA', {id: formId('longtext3'), attrs:{rows:'4'}})
      ]}))
  }

  label = (typ => {
    switch(typ){
      case 'idee': return 'Fonctions <span class="small">(une par ligne)</span>'
      case 'proc': return 'Résolution <span class="small">({{time:...}} description — ou raison de non résolution)</span>'
      default:     return
    }
  })(type)
  if(undefined !== label){
    dom.push(DCreate('DIV', {class:'div-form', append:[
        DCreate('LABEL', {inner:label})
      , DCreate('TEXTAREA', {id: formId('longtext4'), attrs:{rows:'4'}})
      ]}))
  }

  /*  Buttons de pas de page */
  dom.push(DCreate('DIV', {class:'event-form-buttons no-user-selection', append:[
      DCreate('BUTTON', {type:'button', id:formId('destroy'), class:'btn-form-destroy warning small fleft', inner:'Détruire'})
    , DCreate('BUTTON', {inner:'Renoncer', class:'btn-form-cancel cancel small fleft', type:'button'})
    , DCreate('BUTTON', {inner:'__SAVE_BUTTON_LABEL__', class:'btn-form-submit main-button', type:'button'})
    ]}))

  /*  PIED DE PAGE */
  dom.push(DCreate('SECTION', {class:'footer no-user-selection', append:[
      DCreate('SPAN', {class:'event-type', inner: type.toUpperCase()})
    , DCreate('SPAN', {class:'event-id', inner: '...'})
    , DCreate('SPAN', {class:'event-time', inner: '...'})
    ]}))

  return (DCreate('FORM', {class:'form', id:'event-__EID__-form', append: dom})).outerHTML
}
