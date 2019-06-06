'use strict'
/**
  Classe Marker
  Instance d'un marker
**/

class Marker {
  constructor(analyse, data){
    this.a = analyse
    this.id     = this.constructor.newId()
    this.time   = data.time
    this.title  = data.title || `Marqueur #${this.id}`
  }

get data(){
  return {
      id: this.id
    , time: this.time
    , title: this.title
  }
}

// Création d'un tout nouveau marqueur.
// Ne surtout pas appeler cette méthode au chargement de l'analyse
create(){
  this.build()
  this.a.markers.add(this)
}
// Construction du marker. La méthode est appelée aussi au chargement
// de l'analyse si l'analyse comporte des marqueurs.
build(){
  UI.timeRuler.append(this.buildDiv())
  this.observe()
}
edit(e){
  prompt({
      defaultAnswer: this.title
    , methodOnOK: this.endEdit.bind(this)
  })
  return stopEvent(e)
}
endEdit(newTitle, btnIdx){
  F.notify("Nouveau titre : " + newTitle)
  this.title = newTitle
  this.updateHTMLTitle()
  this.a.markers.save(/* no message */true)
}

/**
  Méthode appelée à la fin du drag, quand on change la position du marker
**/
onChangePosition(){
  this.time = BancTimeline.p2t(this.jqObj.offset().left)
  this.updateHTMLTitle()
  this.a.markers.save(/* no message */true)
  delete this._otime
}

// Actualise l'aide quand on survole le marqueur (titre formaté et horloge)
updateHTMLTitle(){
  delete this.htmltitle
  this.jqObj.attr(STRtitle, this.HTMLTitle)
}

selectAndGo(e){
  e && stopEvent(e) // sinon, click sur la timeruler
  this.select()
  this.a.locator.setTime(this.otime)
}
select(){
  this.a.markers.setCurrent(this)
  this.jqObj.addClass('selected')
}
deselect(){
  this.jqObj.removeClass('selected')
}

remove(){
  F.notify("Je dois détruire le marqueur")
  // Le détruire de la liste des markers, et l'enregistrer
  // TODO
}

// Observation du marker dans la timeline
observe(){
  this.jqObj
    // On peut déplacer ce marker sur l'axe horizontal
    .draggable({axis:STRx, stop:this.onChangePosition.bind(this)})
    // On peut éditer ce marker en double-cliquant dessus
    .on(STRdblclick, this.edit.bind(this))
    // On peut le sélectionner pour le détruire
    .on(STRclick, this.selectAndGo.bind(this))
}

/**
  Observation du marquer dans le reader
  (quand on clique dessus, on se rend à la position du marqueur)
**/
observeInReader(){
    this.jqReaderObj.on(STRclick, this.select.bind(this))
  }

/**
  Construction de la marque à placer dans la timeRuler
**/
buildDiv(){
  this.jqObj = $(DCreate(SPAN,{class:'marker', style:this.style, attrs:{title:this.HTMLTitle}}))
  return this.jqObj
}
get style(){
  return `left:${BancTimeline.t2p(this.time) - 2/* largeur marker / 2*/}px;`
}

get HTMLTitle(){
  isDefined(this._htmltitle) || (
    this._htmltitle = `${DFormater(this.title)} (${OTime.vVary(this.time).horloge})`
  )
  return this._htmltitle
}

get otime(){return this._otime||defP(this,'_otime',new OTime(this.time))}

} // /Class Marker
