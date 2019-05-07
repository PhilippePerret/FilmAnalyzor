'use strict'

Object.defineProperties(DataField.prototype,{

// ---------------------------------------------------------------------
//  Données définies dans l'objet qui utilise le DataEditor
//  (dans FAPersonnage par exemple )
  id:         {get(){return this.data.id}}
, label:      {get(){return this.data.label}}
, type:       {get(){return this.data.type}} // détermine le tag
, class:      {get(){return this.data.class}} // css du champ d'édition
, prop:       {get(){return this.data.prop}}
, validities: {get(){return this.data.validities||[]}}
, values:     {get(){return this.data.values}}
// Propriétés exceptionnelles
, observe:    {get(){return this.data.observe}}
, defValue:   {get(){return this.data.defValue}}
, exemple:    {get(){return this.data.exemple}}
, showLink:   {get(){return this.data.showLink}}
, editLink:   {get(){return this.data.editLink}}
, aide:       {get(){return this.data.aide}}
, setValueMethod:{get(){return this.data.setValueMethod}}
, getValueMethod:{get(){return this.data.getValueMethod}}
, checkValueMethod:{get(){return this.data.checkValueMethod}}

// ---------------------------------------------------------------------
//  DONNÉES VOLATILES

// La valeur dans le champ ou null si non définie
, fieldValue:     {get(){return this.getFieldValueOrNull()}}
  // La 'key' est une propriété plus développée qui tient compte du fait que la propriété
  // est définie dans un panneau.
, key:            {get(){return this._key||defP(this,'_key', `${this.panel?(this.panel.id+'-'):''}${this.prop}`)}}
, domId:          {get(){return this._domid||defP(this,'_domid', `${this.dataEditor.id}-item-${this.key}`)}}
, tagName:        {get(){return this._tagname || defP(this,'_tagname',this.tagNameAndType[0])}}
, tagAttributes:  {get(){return this._tagattrs||defP(this,'_tagattrs',this.defineTagAttributes())}}
, tagNameAndType: {get(){return this._tagnameNtype||defP(this,'_tagnameNtype',this.defineTagNameAndType())}}

// ---------------------------------------------------------------------
//  DOM

, field:{get(){return this.dataEditor.jqObj.find(`#${this.domId}`)}}

// ---------------------------------------------------------------------
//  DONNÉES D'ÉTAT VOLATILES

, isRequired:{get(){return this._isrequired||defP(this,'_isrequired', !!(this.validities&REQUIRED))}}
, isUniq:{get(){return this._isuniq||defP(this,'_isuniq',!!(this.validities&UNIQ))}}
, isOnlyAscii:{get(){return this._isascii||defP(this,'_isascii',!!(this.validities&ASCII))}}

, isSelectUpdatable:{get(){return this.type === 'select' && 'function' === typeof(this.values)}}
})

Object.assign(DataField.prototype,{

/**
  Méthode qui checke la validité de la donnée et retourne true si elle est valide,
  false si elle ne l'est pas.
**/
  isValid(){
    try {
      let v = this.fieldValue
      this.isRequired && v === null && raise(`La valeur de ${this.prop} est requise.`)
      this.isUniq && DataEditor.checkUnicite(this) === false && raise(`La valeur ${this.prop} doit être unique.`)
    } catch (e) {
      return e
    }
    return // rien donc OK
  }

/**
  Place la valeur dans le champ
**/
, set(value){
    this.field.val(value)
  }
/**
  Réinitialise le champ
  (en fonction de son type)
**/
, reset(){
    switch (this.type) {
      case 'checkbox':
        this.field[0].checked = false
        break
      default:
        this.field.val('') // TODO : traiter les autres types
    }
    this.field.removeClass('error')
  }
/**
  Retourne la valeur dans le champ ou null si elle est vide
**/
, getFieldValueOrNull(){
    var v
    switch (this.type) {
      case 'checkbox':
        v = this.field[0].checked
        break
      default:
        v = this.field.val()
        if(v === '') v = null
    }
    return v
  }
/**
  Retourne un array contenant [tagName, {premiers attrs}]
**/
, defineTagNameAndType(){
    switch (this.type) {
      case 'text':      return ['INPUT', {type: 'text'}]
      case 'textarea':  return ['TEXTAREA', {}]
      case 'checkbox':  return ['INPUT', {type:'checkbox'}]
      case 'hidden':    return ['INPUT', {type:'hidden'}]
      case 'select':    return ['SELECT', {append: this.optionsSelect()}]
    }
  }
/**
  Méthode qui définit les attributs se trouvant dans la balise
  field du field courant
**/
, defineTagAttributes(){
    var tagAtt = this.tagNameAndType[1] // :type est peut-être défini
    tagAtt.id     = this.domId
    if(this.class) tagAtt.class = this.class
    tagAtt.attrs  = {}
    if(this.exemple) tagAtt.attrs.placeholder = this.exemple
    return tagAtt
  }

/**
  Pour un menu (select), retourne les balises options d'après les valeurs

  C'est la propriété `values` qui définit les valeurs.
  C'est :
    - soit un array [ [val1, inner1], [val2, inner2]...]
    - soit un hash {val1: inner1, val2: inner2, ...}
    - soit un fonction retournant la liste des valeurs dans un de ces formats
      Noter que si `values` est une fonction, un bouton 'update' permettra
      d'actualiser le menu.
**/
, optionsSelect(){
    let hoptions = {}
      , opts = []
      , valuesWithFunction = 'function' == typeof(this.values)
      , optionsValues

    if (valuesWithFunction) {
      optionsValues = this.values()
    } else {
      optionsValues = this.values
    }

    if(Array.isArray(optionsValues)){
      optionsValues.map(duo => hoptions[duo[0]] = duo[1])
    } else {
      hoptions = optionsValues
    }
    for(var val in hoptions){
      opts.push(DCreate('OPTION',{value: val, inner: hoptions[val]}))
    }
    return opts
  }
})
