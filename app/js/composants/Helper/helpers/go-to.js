'use strict'

// const GOTODATA = App.require('system/prefs/gotodata')
// Normalement, cette constante est chargée par shortcuts.js

module.exports = {
  observeSup: function(){
    this.jqObj.find('INPUT[data-goto]')
      .on(STRkeydown, this.onKeyDownOnUShortcut.bind(this))

    // Le bouton pour remettre les raccourcis par défaut
    this.jqObj.find('#set-default-arrows-shortcuts')
      .on(STRclick, this.setDefaultArrowComb.bind(this))
  }
/**
  Méthode qui remet tous les raccourcis par défaut
**/
, setDefaultArrowComb:function(e){
    for(var dsc of GOTODATA){
      this.jqObj.find(`INPUT[data-goto="${dsc.type}"]`).val(dsc.defaultArrowComb)
      dsc.arrowComb = dsc.defaultArrowComb
    }
    return stopEvent(e)
  }

/**
  Méthode qui observe les touches pressées quand on se trouve
  dans un champ d'édition du shortcut
  C'est notamment cette méthode qui affecte le nouveau raccourci
**/
, onKeyDownOnUShortcut:function(e){
    // F.notify(`Touches pressées : ${e.key} meta:${e.metaKey}, alt:${e.altKey}, ctrl:${e.ctrlKey}, shift:${e.shiftKey}`)
    if (e.key === STRTab) {
      return true // On passe au champ suivant
    } else if (e.key === STRArrowLeft || e.key === STRArrowRight){
      let target = $(e.target)
        , data_shortcut = {meta:e.metaKey, alt:e.altKey, ctrl:e.ctrlKey, shift:e.shiftKey, key: e.key}
        , gototype = target.data('goto')
        , sens = gototype.split('-')[0]

      if (sens === 'prev' || sens === 'start') {
        data_shortcut.key = STRArrowLeft
      } else {
        data_shortcut.key = STRArrowRight
      }
      //  ⌃ ⇧ ⌥ ⌘ ← →
      let shortcut = this.data2comb(data_shortcut)
      // Pour retenir les changements à affecter aux préférences
      // générales
      var new_prefs = {}
      // Il faut vérifier que le raccourci n'est pas
      // affecté ailleurs. Si c'est le cas, on le désaffecte
      for(var dsc of GOTODATA){
        if ( dsc.arrowComb === shortcut ) {
          dsc.arrowComb = {key:null}
          this.jqObj.find(`[data-goto="${dsc.type}"]`).val('')
          new_prefs[`goto-${dsc.type}`] = {type:'user', value:null}
        } else if ( dsc.type === gototype) {
          // Affectation de la nouvelle combinaison
          dsc.arrowComb = shortcut
          $(e.target).val(shortcut)
          new_prefs[`goto-${dsc.type}`] = {type:'user', value:data_shortcut}
        }
      }
      // On peut enregistrer les nouvelles préférences
      Prefs.set(new_prefs)
    } else if (e.key === STREscape) {
      $(e.target).blur()
    }
    return stopEvent(e)
  }


, onKeyUp: function(e){// NE PAS UTILISER () => {...} (scope)
    if ( e.key === STRTab ) {
      this.jqObj.find(TEXT_TAGNAMES).first().focus()
      return stopEvent(e)
    }
    let type = this.shortcut2type[e.key]
    if ( isUndefined(type) ){
      if(e.key === STREnter){this.close()}
      return
    }
    let [sens, suff] = type.split('-')
    switch (suff) {
      case undefined:
        return stopEvent(e)
      case 'scene':
        this.a.locator[`goTo${sens.titleize()}Scene`].bind(this.a.locator).call()
        break
      case 'image':
      this.a.locator[`goTo${sens.titleize()}Image`].bind(this.a.locator).call()
        break
      case 'second':
        this.a.locator[`goTo${sens.titleize()}Second`].bind(this.a.locator).call()
        break
      case 'tenseconds':
        this.a.locator[`goTo${sens.titleize()}Tenseconds`].bind(this.a.locator).call()
        break
      case 'minute':
        this.a.locator[`goTo${sens.titleize()}Minute`].bind(this.a.locator).call()
        break
      case 'film': // attention, sens = start/end
        this.a.locator[`goTo${sens.titleize()}Film`].bind(this.a.locator).call()
        break
      case 'sttnode':
        this.a.locator[`goTo${sens.titleize()}Sttnode`].bind(this.a.locator).call()
        break
      case 'stoppoint':
        this.a.locator[`goTo${sens.titleize()}Stoppoint`].bind(this.a.locator).call()
        break
      case 'markers':
        this.a.locator[`goTo${sens.titleize()}Marker`].bind(this.a.locator).call()
        break
    }
    // TODO: REMETTRE :
    // this.close() // on referme la fenêtre après avoir choisi
    return stopEvent(e)
  }
, title: 'Aller à…'
/**
  Méthode qui met dans GOTODATA les données de préférences actuelles,
  en composant aussi le raccourci
**/
, prepareCurrentCombinaisons(){
    var listePrefs = GOTODATA.map(dsc => `goto-${dsc.type}`)
    var prefs = Prefs.get(listePrefs)
    // console.log("prefs:", prefs)

    for(var dsc of GOTODATA){
      var pref = prefs[`goto-${dsc.type}`]
      dsc.dataArrowComb = pref
      dsc.arrowComb     = this.data2comb(pref)
    }
  }
, data2comb(dsc){
    if ( isNullish(dsc) ) return ''
    var sc = []
    dsc.shift && sc.push('⇧')
    dsc.ctrl  && sc.push('⌃')
    dsc.alt   && sc.push('⌥')
    dsc.meta  && sc.push('⌘')
    sc.push(dsc.key === STRArrowLeft ? '←' : '→')
    return sc.join('')
  }
, body: function(){
    var divs = []
      , dev
      , tabindex = 1

    this.prepareCurrentCombinaisons()
    this.shortcut2type = {}
    for(var dgo of GOTODATA){
      dgo.defaultArrowComb = dgo.arrowComb // pour pouvoir les remettre
      divs.push(DCreate(DIV, {append:[
          DCreate(INPUT, {type:'text', value:(dgo.arrowComb || ''), class:'fright tiny short', style:'width:60px;', attrs:{'data-goto':dgo.type, tabindex:tabindex++}})
        , DCreate(LABEL, {inner: dgo.shortcut, class:'shortcut'})
        , DCreate(SPAN,  {inner: dgo.hname})
      ]}))
      this.shortcut2type[dgo.shortcut] = dgo.type
    }
    return divs
  }
, footer:function(){
    return [
      DCreate(BUTTON,{type:STRbutton, id:'set-default-arrows-shortcuts', inner:'Raccourcis flèches par défaut', class:'tiny'})
    ]
  }
}
