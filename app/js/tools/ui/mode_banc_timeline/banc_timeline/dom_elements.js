'use strict'
/**
  Définition de tous les éléments du DOM de BancTimeline
**/
module.exports = {

  markShortcuts:{get(){
    return this._markshortcuts || defP(this,'_markshortcuts',$('#banctime-mode-shortcuts'))
  }}

}
