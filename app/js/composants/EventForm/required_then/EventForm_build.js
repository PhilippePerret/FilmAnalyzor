'use strict'

EventForm.COMMON_HIDDEN_FIELDS = ['id', 'is_new', 'type']

Object.assign(EventForm.prototype,{
  /**
    @return {String} L'identifiant du champ pour la propriété +prop+
  **/
  fId(prop){ return `event-__EID__-${prop}` }

  /**
    Méthode qui retourne le formulaire propre au type +type+

    @param {String} type    Le type de l'event à retourner
    @return {String}        Le formulaire propre à l'event
  **/
, formsByType(type){
    if(undefined === this._formsByType) this._formsByType = {}
    if(undefined === this._formsByType[type]){
      this._formsByType[type] = this.buildFormOfType(type)
    }
    return this._formsByType[type]
  }

  /**
    Construction d'un modèle par type
  **/
, buildFormOfType(type){
    let my = this
    var str = ''
      , dom = []
      , prop
      , label
    let prefid = 'event-__EID__'

    for(prop of this.constructor.COMMON_HIDDEN_FIELDS){
      dom.push(DCreate(INPUT, {type:'hidden', id:`${prefid}-${prop}`}))
    }

    dom.push(DCreate(SECTION, {class: 'header no-user-selection', append:[
        DCreate(BUTTON, {type:BUTTON, class:'btn-close'})
      , DCreate(SPAN, {class:'event-type', inner: type.toUpperCase()})
      ]}))

    /*  Div supérieur avec temps, durée ou numéro */
    dom.push(DCreate(DIV, {class:'div-infos-temporelles no-user-selection', append:[
      // Le petit bouton droppable pour associer l'event nouveau ou modifié
        DCreate(SPAN, {class: 'event-btn-drop event', inner: '⎆', style: 'background:transparent;', attrs:{
          title: 'Pour glisser et déposer l’event et l’associer'
        , 'data-type':'event', 'data-id':'__EID__'
        }})
      , DCreate(BUTTON, {class:'btnplay right', attrs:{size:30}})
      , DCreate(LABEL, {inner: 'Position'})
      , DCreate('HORLOGE', {class:'small', id:my.fId('time'), value:'', inner: '...'})
      , DCreate(LABEL, {inner: 'Durée'})
      , DCreate('DUREE', {id: my.fId('duree'), class: 'small dureeable'})
      ]}))

    /*  Pour le type particulier de l'event */
    if(type != 'qrd'){
      var fieldsType = []
      fieldsType.push(
          DCreate(LABEL, {inner:type === 'stt' ? 'Type du nœud' : 'Type'})
        , DCreate(SELECT, {id: my.fId(`${type}Type`), class: `${type}-types`, style:'max-width:270px;'})
      )
      if(type !== 'stt'){
        fieldsType.push(
            DCreate(BUTTON, {type:BUTTON, class:'update btn-update-types', title: T('tit-update-type-list'), append:[
              DCreate(IMG, {src: 'img/update-2.png', alt: 'Actualiser la liste des types'})
            ]})
          , DCreate(BUTTON, {type:BUTTON, class:'modify btn-modify-types', title: T('tit-modify-type-list'), append:[
              DCreate(IMG, {src: 'img/btn-edit.png', alt: 'Modifier la liste des types'})
            ]})
          , DCreate(BUTTON, {type:BUTTON, class:'info btn-info-proc', append:[
              DCreate(IMG, {src: 'img/picto_info_dark.png', alt: 'Information sur le procédé courant', style:`visibility:${type === 'proc'?'visible':'hidden'}`})
            ]})
        )
      }
      dom.push(DCreate(DIV,{class:`div-form div-${type}-types`, append:fieldsType}))
    }

    if( type === 'scene' ){
      dom.push(DCreate(DIV, {class:'div-form', append:[
          DCreate(LABEL, {inner: 'Num.'})
        , DCreate(INPUT, {type:'text', id: my.fId('numero'), class:'temps-secondes', disabled:'DISABLED'})
        , DCreate(SELECT, {id:my.fId('lieu'), append:[
            DCreate(OPTION, {value: 'int', inner: 'INT.'})
          , DCreate(OPTION, {value: 'ext', inner: 'EXT.'})
          , DCreate(OPTION, {value: 'extint', inner: 'INT. & EXT.'})
          , DCreate(OPTION, {value: 'n/d', inner: 'N/D'})
          ]})
        , DCreate(SELECT, {id: my.fId('effet'), append: [
            DCreate(OPTION, {value:'jour',   inner:'JOUR'})
          , DCreate(OPTION, {value:'nuit',   inner:'NUIT'})
          , DCreate(OPTION, {value:'soir',   inner:'SOIR'})
          , DCreate(OPTION, {value:'matin',  inner:'MATIN'})
          , DCreate(OPTION, {value:'noir',   inner:'NOIR'})
          , DCreate(OPTION, {value:'n/d',    inner:'N/D'})
          ]})
        ]}))
    } // si scène

    dom.push(DCreate(DIV, {class:'div-form', append:[
        DCreate(LABEL, {for: my.fId('titre'), inner: type === 'scene' ? 'Pitch' : 'Titre générique (optionnel)'})
      , DCreate(INPUT, {type:'TEXT', id:my.fId('titre'), class:'bold'})
      ]}))

    // La case à cocher pour dire que l'event est lié à l'image de son
    // temps (qu'il faut donc l'afficher)
    dom.push(DCreate(DIV,{class:'div-form align-middle',append:[
        DCreate(INPUT,{type:'checkbox',id:my.fId('curimage')})
      , DCreate(LABEL,{attrs:{for:my.fId('curimage')}, inner:'Lié à l’image courante'})
      , DCreate(IMG, {src:'img/picto_info_dark.png', class:'info-curimage small', alt: '?'})
    ]}))


    var parentDesign = [DCreate(SPAN, {class:'small', inner:'PARENT (glisser ici l’event parent — '})]
    if(type==='dyna') parentDesign.push(DCreate(SPAN, {class:'small italic', inner:'l’objectif du sous-objectif ou du moyen, l’obstacle du conflit, etc. — '}))
    parentDesign.push(DCreate(SPAN, {class:'small italic', inner:'utilisez par exemple un Eventer)'}))
    dom.push(DCreate(DIV, {class:'div-form', append:[
        DCreate(DIV, {class:'event-parent cadre', append:[
          DCreate(DIV, {class:'parent-designation small', append:parentDesign})
        ]})
      , DCreate(INPUT, {type:'HIDDEN', id:my.fId('parent'), value:''})
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
      dom.push(DCreate(DIV, {class:'div-form', append:[
          DCreate(LABEL, {inner:label})
        , DCreate(SELECT, {class:'decors', style:`display:${type==='scene'?'block':'none'};`})
        , DCreate(INPUT, {type:'TEXT', id: my.fId('shorttext1')})
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
      var ds = [DCreate(LABEL,{inner:label})]
      if(type === 'scene') ds.push(DCreate(SELECT, {class:'sous_decors'}))
      ds.push(DCreate(INPUT, {type:'TEXT', id:my.fId('shorttext2')}))
      if(type === 'qrd'){
        ds.push(DCreate(DIV, {class:'right', append:[
                  DCreate(LABEL, {inner:'Temps'})
                , DCreate(INPUT, {type:'TEXT', class:'horloge', id:my.fId('tps_reponse')})
                ]})
        )
      }
      dom.push(DCreate(DIV, {class:'div-form', append:ds}))
    }

    label = (typ => {
      switch(typ){
        case 'brin'   :return 'Résumé'
        case 'info'   :return 'Information'
        case 'dialog' :return 'Commentaire'
        default: return 'Description'
      }
    })(type)
    dom.push(DCreate(DIV,{class:'div-form', append:[
        DCreate(LABEL, {inner:label})
      , DCreate('TEXTAREA', {id: my.fId('longtext1'), attrs:{rows: '4'}})
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
      dom.push(DCreate(DIV, {class:'div-form', append:[
          DCreate(LABEL, {inner:label})
        , DCreate('TEXTAREA', {id: my.fId('longtext2'), attrs:{rows:'4'}})
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
      dom.push(DCreate(DIV, {class:'div-form', append:[
          DCreate(LABEL, {inner:label})
        , DCreate('TEXTAREA', {id: my.fId('longtext3'), attrs:{rows:'4'}})
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
      dom.push(DCreate(DIV, {class:'div-form', append:[
          DCreate(LABEL, {inner:label})
        , DCreate('TEXTAREA', {id: my.fId('longtext4'), attrs:{rows:'4'}})
        ]}))
    }

    /*  Buttons de pas de page */
    dom.push(DCreate(DIV, {class:'event-form-buttons no-user-selection', append:[
        DCreate(BUTTON, {type:BUTTON, id:my.fId('destroy'), class:'btn-form-destroy warning small fleft', inner:'Détruire'})
      , DCreate(BUTTON, {inner:'Renoncer', class:'btn-form-cancel cancel small fleft', type:BUTTON})
      , DCreate(BUTTON, {inner:'__SAVE_BUTTON_LABEL__', class:'btn-form-submit main-button', type:BUTTON})
      ]}))

    /*  PIED DE PAGE */
    dom.push(DCreate(SECTION, {class:'footer no-user-selection', append:[
        DCreate(SPAN, {class:'event-type', inner: type.toUpperCase()})
      , DCreate(SPAN, {class:'event-id', inner: '...'})
      , DCreate(SPAN, {class:'event-time', inner: '...'})
      ]}))

    return (DCreate('FORM', {class:'form', id:'event-__EID__-form', append: dom})).outerHTML
  } // /buildFormOfType

  /**
    Place les observateurs
  **/
, observe(){
    let my = this
    this.jqObj.find('.btn-form-cancel').on('click', my.cancel.bind(my))
    this.btnSubmit.on('click', my.submit.bind(my))
    this.jqObj.find('.btn-form-destroy').on('click', my.destroy.bind(my))

    // Toutes les modifications de texte doivent entrainer une activation du
    // bouton de sauvegarde
    this.jqObj.find('textarea, input, select').on('change', ()=>{this.modified = true})

    // Quand le type de l'event est scene et que le résumé est vide,
    // on synchronise le pitch avec le résumé
    if(this.type === 'scene' && this.isNew){
      this.jqField('titre').on('keyup', my.synchronizePitchAndResume.bind(my))
      this.jqField('longtext1').on('keyup', my.checkIfSynchronizable.bind(my))
    }

    // Bouton pour actualiser le menu des types de tout élément et pour éditer
    // le fichier de données
    this.jqObj.find('.btn-update-types').on('click', my.updateTypes.bind(my))
    this.jqObj.find('.btn-modify-types').on('click', my.modifyDataTypes.bind(my))

    // Le petit picto pour associer tout de suite l'event édité ou créé
    // à un autre event ou document ou autre.
    /**
    // TODO C'est pas bon, ça, il faut utiliser aussi l'helper
    **/
    my.jqObj.find('.event-btn-drop').draggable({
        revert:true
      , zindex:1000
      , start:()=>{this.jqObj.css('z-index','1000')}
      , stop:()=>{this.jqObj.css('z-index', null)}
    })

    // On rend les champs de texte associable entre éléments
    this.setTextFieldsAssociableIn(this.jqObj)

    // On rend le div qui peut recevoir le parent sensible au drop
    let dataDrop = Object.assign({},DATA_ASSOCIATES_DROPPABLE,{drop:(e,ui) => {this.setParent(ui.helper)}})
    my.jqObj.find('div.event-parent').droppable(dataDrop)

    // On rend l'entête du formulaire sensible au drop
    my.jqObj.find('.header').droppable(DATA_ASSOCIATES_DROPPABLE)

    // Les champs d'édition répondent au cmd-enter pour soumettre le
    // formulaire (enfin… façon de parler)
    my.jqObj.find('textarea, input[type="text"], input[type="checkbox"], select').on('keydown', this.onKeyDownOnTextFields.bind(this))

    // Pour savoir si l'on doit éditer dans les champs de texte ou
    // dans le mini-writer
    UI.miniWriterizeTextFields(this.jqObj, this.a.options.get('option_edit_in_mini_writer'))

    // Pour tous les events, le champ permet d'associer à une image
    this.jqObj.find('img.info-curimage').on('click', this.showExplanationCurImage.bind(this))

    // Si l'event est une scène, on observe le menu décor et
    // sous décor
    if(this.type === 'scene'){
      this.menuDecors.on('change', this.onChooseDecor.bind(this))
      this.menuSousDecors.on('change', this.onChooseSousDecor.bind(this))
    } else if (this.type === 'proc'){
      $('button.btn-info-proc').on('click', FAProcede.showDescriptionOf.bind(FAProcede,this.id))// prop aux procédés, celui-là
      $('div.div-proc-types button.update').on('click', FAProcede.updateData.bind(FAProcede)) // ATTENTION : button commun
    }
    my = null
  }


})
