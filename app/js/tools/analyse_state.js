'use strict'


const PFA = require('../common/PFA/PFA-mini')

Object.assign(PFA,{
  NombreNoeudsTotal: 9
, RequiredNodes: []
, initRequiredNodes:function(){
    this.RequiredNodes = []
    for(var stt_id in this.DATA_STT_NODES){
      this.RequiredNodes.push(stt_id)
    }
  }
, nbNoeudPFADone:function(){
    if(undefined === this._nbDone){
      var dones = []
      this.initRequiredNodes()
      current_analyse.forEachEvent(function(ev){
        if(ev.type == 'stt'){
          var idx = this.RequiredNodes.indexOf(ev.sttID)
          if (idx < 0) return
          dones.push(this.RequiredNodes.splice(idx,1))
        }
      })
      this._nbDone = dones.length
    }
    return this._nbDone
  }
, nbNoeudPFAUndone:function(){
    if (undefined === this._nbDone) this.nbNoeudPFADone()
    return this.RequiredNodes.length // ceux qui restent
  }
})

const AnalyseState = {
    class: 'AnalyseState'

  , built: false

    /**
     * Les données qui seront affichées
     */
  , DATA:{
        'events-count':   {label: 'Nombre d’events'}
      , 'docs-count':     {label: 'Documents rédigés'}
      , 'fonds-state':    {label: 'Avancement Fondamentales', expected: 1000}
      , 'pfa-done':       {label: 'Paradigme de Field Augmenté'}
      , 'pfa-detail':     {label: 'Nœuds définis/nœuds à définir'}
    }

  , display:function(){
      if(this.built === false) {
        this.build()
        this.observe()
      }
      this.jqObj.show()
    }
  , hide:function(){this.jqObj.hide()}

  // ---------------------------------------------------------------------
  //  Méthodes de calcul

    /**
     * Méthode principale qui calcule la valeur d'une propriété de this.DATA
     * consigne la valeur et la renvoie.
     */
  , calcValueOf:function(prop){
      var   value = null
          , pData = this.DATA[prop]
          , expected = pData.expected // si existe
          ;
      switch (prop) {
        case 'events-count':
          value = current_analyse.events.length;
          break
        case 'docs-count':
          value = fs.readdirSync(current_analyse.folderFiles).length;
          break
        case 'fonds-state':
          var fpath = this.a.filePathOf('fondamentales')
          if (fs.existsSync(fpath)){
            var size = fs.statSync(fpath).size
            if(size > expected) value = '> 100%'
            else value = asPourcentage(expected, size)
          } else { value = '0%'}
          break
        case 'pfa-done':
          value = 'non' // TODO pour le momemnt
          break
        case 'pfa-detail':
          value = `${PFA.nbNoeudPFADone()}/${PFA.nbNoeudPFAUndone()}`
          break
        default:
          return 'indéfini'
      }
      this.DATA[prop].value = value
      return value
    }

  // ---------------------------------------------------------------------
  //  Méthodes de construction DOM

  , build(){
      // Construction du div principal
      var div, n, prop, data, d, l, v ;
      div = DCreate('DIV',{
        id: 'div-analyse-state'
      , style: 'display:none;'
      })
      n = document.createElement('H1')
      n.innerHTML = 'État d’avancement de l’analyse'
      div.appendChild(n)
      for(prop in this.DATA){
        data = this.DATA[prop]
        d = document.createElement('DIV')
        d.className = 'info'
        l = document.createElement('LABEL')
        l.innerHTML = data.label
        d.appendChild(l)
        v = document.createElement('SPAN')
        v.className = 'value'
        v.innerHTML = this.calcValueOf(prop)
        d.appendChild(v)
        div.appendChild(d)
      }
      // Le bouton de fermeture
      n = document.createElement('BUTTON')
      n.className = 'close'
      v = document.createElement('IMG')
      v.src = './img/btn-window/b_close.png'
      n.appendChild(v)
      div.appendChild(n)

      $('body').append(div)
      this.built = true
    }
    // /build

    , observe(){
        $('#div-analyse-state').draggable()
        $('#div-analyse-state button.close').on('click', this.hide.bind(this))
      }
}
Object.defineProperties(AnalyseState,{
    domObj:{
      get:function(){return DGet('div-analyse-state')}
    }
  , jqObj:{
      get:function(){return $(this.domObj)}
    }
})

module.exports = function(){
  var my = this
  AnalyseState.display()
}
