const electron = require('electron')
const { app, BrowserWindow } = require('electron')
const log = require('electron-log')
const { Menu, MenuItem } = require('electron')
const path = require('path')
const ipc = electron.ipcMain

log.transports.console.level = 'warn'

global.MODE_TEST = process.env.MODE_TEST == 'true'
if(MODE_TEST) log.info("--- Mode Tests ---")

const Prefs = require('./app/js/main-process/Prefs.js')

global.screenWidth   = null
global.screenHeight  = null

global.ObjMenus   = require('./app/js/main-process/menu.js')
global.FAWindows  = require('./app/js/main-process/windows.js')


global.mainW          = null
global.pubW           = null // fenêtre de publication
global.userPrefsPath  =
global.userPrefs      = null

app.on('ready', () => {

  // Chargement des préférences
  Prefs.init().load()

  // Construction des menus
  // Note : on a besoin de `mainMenuBar` pour retrouver les menus par
  // leur identifiant (cf. le modules modules/menus.js)
  ObjMenus.mainMenuBar = Menu.buildFromTemplate(ObjMenus.data_menus)
  Menu.setApplicationMenu(ObjMenus.mainMenuBar)
  Prefs.setMenusPrefs()

  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize
  screenWidth   = width
  screenHeight  = height

  mainW = new BrowserWindow({
      height: screenHeight - 40
    , width:  screenWidth - 40
    , icon:   "../dist/icons/macos/icon.icns"
  })
  mainW.loadURL(`file://${path.resolve('./app/analyser.html')}`)
  if (MODE_TEST) mainW.toggleDevTools();
  // ou pour débuguer
  mainW.toggleDevTools();

  mainW.on('close', (ev) => {
    // Maintenant, on sauve toujours car 1/ les données sauvées sont maigres
    // et 2/ elles contiennent le dernier temps
    mainW.webContents.executeJavaScript('current_analyse && current_analyse.saveData()')
    // ev.preventDefault() // pour empêcher la fermeture
  })

})
.on('quit', () => {
  // Si des préférences ont été modifiées, on les enregistré (en synchrone)
  Prefs.saveIfModified()
})


ipc.on('get-screen-dimensions', ev => {
  ev.returnValue = {width: screenWidth, height: screenHeight}
})

// Ça ne fonctionne pas :
// process.on('uncaughtException', function (error) {
//   console.error(error)
//   mainW.webContents.send('uncaught-exception', {error: error, source: 'process.on'})
// })
// var oldConsoleError = console.error
// console.error = function(error){
//   mainW.webContents.send('uncaught-exception', {error: error, source: 'console.error'})
//   oldConsoleError(`Envoyé : ${error}`)
// }
