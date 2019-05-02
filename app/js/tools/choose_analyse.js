'use strict'


module.exports = function(){
  log.info('-> [tool] choose_analyse')
  let openOptions = {
      defaultPath:  null // __dirname
    , message:      'Analyse à ouvrir'
    , properties:   ['openDirectory']
    // , properties:   ['openDirectory', 'createDirectory']
  }
  let files = DIALOG.showOpenDialog(openOptions)
  if (!files){
    log.info('<- [tool] choose_analyse [return false, pas de dossier choisi]')
    return false
  }
  var analyseFolder = files[0]
  if (FAnalyse.load(analyseFolder)){
    // <= L'analyse a pu être chargée
    // => On l'enregistre comme dernière analyse chargée
    Prefs.set({'last_analyse_folder': analyseFolder})
    log.info(`<- [tool] choose_analyse [OK: ${analyseFolder}]`)
  } else {
    log.info('<- [tool] choose_analyse [chargement de l’analyse raté]')
  }
}
