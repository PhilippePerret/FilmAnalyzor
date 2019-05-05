'use strict'

Object.defineProperties(DataField.prototype,{

// ---------------------------------------------------------------------
//  Données définies dans l'objet qui utilise le DataEditor
//  (dans FAPersonnage par exemple )
  id:         {get(){return this.data.id}}
, label:      {get(){return this.data.label}}
, type:       {get(){return this.data.type}} // détermine le champ
, prop:       {get(){return this.data.prop}}
, validities: {get(){return this.data.validities||[]}}
, values:     {get(){return this.data.values}}
// Propriétés exceptionnelles
, defValue:   {get(){return this.data.defValue}}
, exemple:    {get(){return this.data.exemple}}
, aide:       {get(){return this.data.aide}}
, setValueMethod:{get(){return this.data.setValueMethod}}
, getValueMethod:{get(){return this.data.getValueMethod}}

// ---------------------------------------------------------------------
//  DONNÉES VOLATILES

// La valeur dans le champ ou null si non définie
, field:          {get(){return $(`#${this.domId}`)}}
, fieldValue:     {get(){return this.getFieldValueOrNull()}}
, domId:          {get(){return this._domid||defP(this,'_domid', `${this.dataEditor.id}-item-${this.prop}`)}}
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
    tagAtt.attrs  = {}
    if(this.exemple) tagAtt.attrs.placeholder = this.exemple
    return tagAtt
  }

/**
  Pour un menu (select), retourne les balises options d'après les valeurs
**/
, optionsSelect(){
    let hoptions = {}
      , opts = []
    if(Array.isArray(this.values)){
      this.values.map(duo => h[duo[0]] = duo[1])
    } else {
      hoptions = this.values
    }
    for(var val in hoptions){
      opts.push(DCreate('OPTION',{value: val, inner: hoptions[val]}))
    }
    return opts
  }
})
