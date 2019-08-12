'use strict'


module.exports = async function(){
  log.info('-> [tool] choose_analyse')
  let openOptions = {
      message:      'Analyse à ouvrir'
    , properties:   ['openDirectory']
    // , properties:   ['openDirectory', 'createDirectory']
  }
  let lastAnalyseFolder = Prefs.get('last_analyse_folder')
  if ( lastAnalyseFolder ) {
    Object.assign(openOptions,{defaultPath: lastAnalyseFolder})
  }
  let files = DIALOG.showOpenDialogSync(openOptions)
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
