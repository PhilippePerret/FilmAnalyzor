'use strict'
/**
 * Définition et gestion des fenêtre
 */

const electron = require('electron')
const { app, BrowserWindow } = electron // require('electron')
const path = require('path')
const ipc = electron.ipcMain

const FAWindows = {

    displayAnalyse: function(){
      if(undefined === this._pubW) this.makePublishingWindow()
      else this._pubW.show()
    }
    /**
     * Ouverture de la fenêtre qui permet de lire, construire et publier
     * l'analyse courante
     */
  , makePublishingWindow:function(){
      if (undefined === this._pubW){
        pubW = new BrowserWindow({
            height: screenHeight - 40
          , width:  screenWidth / 2
          , x: 40
          // , icon:   "../dist/icons/macos/icon.icns"
        })
        pubW.loadURL(`file://${path.resolve('./app/blank_publisher.html')}`)
        if (MODE_TEST) pubW.toggleDevTools();
        // ou pour débuguer
        // pubW.toggleDevTools();

        // ---------------------------------------------------------------------
        //  Méthodes évènement

        pubW.on('closed', (e) => {
          delete this._pubW
        })
        pubW.on('load-url', (e, data) => {
          pubW.loadURL(`file://${data.path}`)
        })

        // ---------------------------------------------------------------------
        this._pubW = pubW
        pubW = null
      } else {
        this._pubW.show()
      }
    }
}

ipc.on('load-url-in-pubwindow', (e, data) => {
  FAWindows._pubW.loadURL(`file://${data.path}`)
})

module.exports = FAWindows
