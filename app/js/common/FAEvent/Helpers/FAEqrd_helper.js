'use strict'
/**
  Helpers pour les QRD
**/


Object.assign(FAEqrd.prototype,{
/**
  Version courte de l'event
  Appeler `this.as('short', flag)`
**/
asShort(options){
  var divs = []
  divs.push(DCreate(SPAN, {class:'question', append:[
        DCreate(LABEL, {inner: 'Question'})
      , DCreate(SPAN, {class: 'value question', inner: DFormater(this.question)})
    ]}))
  divs.push(DCreate(SPAN, {class:'reponse', append:[
      DCreate(LABEL, {inner: 'Réponse'})
    , DCreate(SPAN, {class: 'value reponse', inner: this.f_reponse})
    ]}))

  return divs
}

/**
  Version complète de la QRD
**/
, asFull(options){
    return [
      DCreate(DIV, {class:'div-question', append: [
          DCreate(LABEL, {inner: 'Question'})
        , DCreate(SPAN, {class:this.domC('question'), inner: this.f_question})
        ]})
    , DCreate(DIV, {class:'div-reponse', append:[
          DCreate(LABEL, {inner: 'Réponse'})
        , DCreate(SPAN, {class:this.domC('reponse'),inner: this.f_reponse})
        ]})
    , DCreate(DIV, {class:'div-description', append:[
          DCreate(LABEL, {inner:'Description'})
        , DCreate(SPAN, {class:`${this.domC('description')}`, inner: DFormater(this.description)})
        ]})
    ]
  }

})


Object.defineProperties(FAEqrd.prototype,{
  /**
    Pour la cohérence avec les autres méthodes
    NON ! TITRE EXISTE POUR LES QRD
  **/
  f_titre:{
    get(){
      if(undefined === this._f_titre){
        if(this.titre) this._f_titre = DFormater(this.titre)
        else this._f_titre = `<span class="question">${this.question}</span>`
      }
      return this._f_titre
    }
  }
  // @return {String} La question formatée, ou 'requise'
, f_question:{get(){return DFormater(this.question)}}
, f_reponse:{
    get(){
      if(this.reponse && this.reponse.length){
        return `${DFormater(this.reponse)} (${new OTime(this.tps_reponse).horloge_simple})`
      } else {
        return '<span class="warning">REQUISE</span>'
      }
    }
  }
})
