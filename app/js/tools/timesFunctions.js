'use strict'

// Pour définir le début du film
const setFilmStartTimeAt = function(vtime){
  let my = this

  // On prend le temps actuel pour pouvoir corriger les events et autres temps
  let initStartTime = my.filmStartTime ? parseFloat(my.filmStartTime) : 0

  // On prend le nouveau temps
  vtime = vtime || my.locator.getTime().round(2)
  my.filmStartTime = vtime
  BancTimeline.positionneMarkFilmStartEnd()

  // Différence, le temps qui sera AJOUTÉ aux temps déjà définis.
  let diff = initStartTime - my.filmStartTime

  if(diff === 0) return F.notify(T('same-start-time'))

  if(FAEvent.count || FABrin.count || FADocument.count){
    confirm({
        message:T('confirm-on-change-start-time')
      , width: '30%'
      , buttons:['Renoncer', 'Corriger tous les temps']
      , defaultButtonIndex:1
      , cancelButtonIndex:0
      , okButtonIndex:1
      , methodOnOK: my.execSetFilmStartTimeAt.bind(my,diff)
      , methodOnCancel: my.notExecSetFilmStartTimeAt.bind(my)
    })
  } else {
    this.endSetFilmStartTimeAt()
  }
}

/**
  Après confirmation, on procède vraiment au changement
**/
FAnalyse.prototype.execSetFilmStartTimeAt = function(diff){
  current_analyse.forEachEvent(ev => ev.time += diff)
  // Corriger toutes les balises {{time:...}} qu'on
  // peut trouver dans les documents.
  var cont
  FADocument.forEachDocument(function(doc){
    if ( isUndefined(doc.contents) ) return
    if(!doc.contents.match(/\{\{time\:/)) return
    cont = doc.contents
    cont = cont.replace(/\{\{time\: ?([0-9]+)\}\}/g,function(tout,temps){
      return `{{time:${parseFloat(temps) + diff}}}`
    })
    doc.save() // asynchrone
  })
  this.endSetFilmStartTimeAt()
}
/**
  Quand l'utilisateur décide de ne pas procéder au changement de temps
**/
FAnalyse.prototype.notExecSetFilmStartTimeAt = function(){
  F.notify('OK, je ne change pas les temps.')
}


FAnalyse.prototype.endSetFilmStartTimeAt = function(){
  this.modified = true
  this.setButtonGoToStart()
  F.notify(T('confirm-start-time', {time: new OTime(this.filmStartTime).horloge}))
}

// Pour définir le début du film
let setFilmEndTimeAt = function(vtime){
  vtime = vtime || this.locator.getTime().vtime
  this.filmEndTime = vtime
  this.modified = true
  F.notify(`J'ai pris le temps ${new OTime(this.filmEndTime).horloge} comme fin du film.`)
}

// Pour définir la fin du générique de fin
let setEndGenericFin = function(){
  this.filmEndGenericFin = this.locator.getTime()
  this.modified = true
  F.notify(`J'ai pris le temps ${new OTime(this.filmEndGenericFin).horloge} comme fin du générique de fin.`)
}

module.exports = {
    _setFilmStartTimeAt: setFilmStartTimeAt
  , _setFilmEndTimeAt:   setFilmEndTimeAt
  , _setEndGenericFinAt: setEndGenericFin
}
