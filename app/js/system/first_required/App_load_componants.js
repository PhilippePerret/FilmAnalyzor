'use strict'



  /**
    Méthode qui s'assure, avant de charger l'analyse choisie, que tous les
    composants sont bien chargés. Et les charge au besoin.
  **/
function loadAllComponants(){
    log.info("-> AppLoader::loadAllComponants")
    App.allComponantsLoaded = false
    // return
    if(NONE === typeof UI)            return this.loadComponant('ui/ui')
    if(NONE === typeof Helper)        return this.loadComponant('Helper')
    if(NONE === typeof BancTimeline)  return this.loadComponant('ui/banc_timeline')
    if(NONE === typeof DataEditor)    return this.loadComponant('DataEditor')
    if(NONE === typeof EventForm)     return this.loadComponant('EventForm')
    if(NONE === typeof FADocument)    return this.loadComponant('faDocument')
    if(NONE === typeof PorteDocuments)return this.loadComponant('PorteDocuments')
    if(NONE === typeof FAProtocole)   return this.loadComponant('faProtocole')
    if(NONE === typeof FAStater)      return this.loadComponant('faStater')
    if(NONE === typeof FAEventer)     return this.loadComponant('faEventer')
    if(NONE === typeof FABrin)        return this.loadComponant('faBrin')
    if(NONE === typeof FAPersonnage)  return this.loadComponant('faPersonnage')
    if(NONE === typeof FAProcede)     return this.loadComponant('faProcede')
    if(NONE === typeof FAReader)      return this.loadComponant('faReader')
    if(NONE === typeof FAStats)       return this.loadComponant('faStats')
    if(NONE === typeof FAImage)       return this.loadComponant('faImage')
    if(NONE === typeof Snippets)      return this.loadComponant('Snippets')
    if(NONE === typeof Markers)       return this.loadComponant('Markers')
    if(NONE === typeof PrevNext)      return this.loadComponant('PrevNext')
    if(NONE === typeof TimeMap)       return this.loadComponant('TimeMap')

    // Si tout est OK, on peut rappeler la méthode Fanalyse.load
    log.info("   Tous les composants sont chargés.")
    App.allComponantsLoaded = true
    this.onReady()
    log.info("<- AppLoader::loadAllComponants")
  }

module.exports = {loadAllComponants: loadAllComponants}
