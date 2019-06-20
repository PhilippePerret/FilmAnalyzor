'use strict'
/**
 * Gestion du menu principal de l'application
 *
 * Grâce à la méthode ObjMenus.getMenu('<identifiant>'), on peut atteindre
 * un menu particulier s'il définit son ID (id: <valeur unique>)
 * On peut donc alors faire des choses comme :
 *
 *  var m = ObjMenus.getMenu('monIdDeMenu')
 *  m.label = "Un nouveau label"
 *  m.checked = true // pour le sélectionner
 *  m.enabled = false // pour le désactiver
 *  etc.
 */
// const electron = require('electron')
const { app } = require('electron')
const path    = require('path')
const ipc     = require('electron').ipcMain
const log     = require('electron-log')
log.transports.console.level = 'warn'

const CURRENT_THING_MENUS = [
  'save-analyse', 'save-as-analyse', 'export-as-pdf', 'export-as-epub',
  'export-as-kindle', 'export-as-docbook', 'display-infos-film',
  'display-full-analyse', 'display-full-analyse-forcer',
  'display-fondamentales', 'display-statistiques', 'new-eventer', 'open-porte-documents',
  'display-analyse-state', 'display-last-report', 'display-documents',
  'display-protocole', 'option-locked', 'new-version', 'display-brins',
  'goto-last-scene', 'display-decors', 'check-data-validity',
  'display-personnages', 'display-images', 'open-in-finder', 'calc-pfa',
  'display-pfa-1', 'display-pfa-2', 'display-pfa-3', 'display-pfa-4'

]
// Note : les ID des menus de documents seront ajoutés "à la volée"

// Les submenus du porte_documents, qui doivent être calculés en fonction des types
// de documents.
const PorteDocumentsSubmenus = [
      {
          label: "Ouvrir/fermer le Porte-documents"
        , id: 'open-porte-documents'
        , accelerator: 'CmdOrCtrl+Alt+Shift+W'
        , enabled: false
        , click: () => {execJsOnCurrent('editDocumentInPorteDocuments')}
      }
    , {type:'separator'}
  ]

const DATA_DOCS = require('../composants/faDocument/required_first/data_documents')

function editDocumentInPorteDocuments(docId){
  mainW.webContents.executeJavaScript(`current_analyse && current_analyse.editDocumentInPorteDocuments(${docId})`)
}
function openDocInDataEditor(docId){
  mainW.webContents.executeJavaScript(`current_analyse && current_analyse.openDocInDataEditor(${docId})`)
}
var curType = null
for(var docDim in DATA_DOCS){
  if ( DATA_DOCS[docDim].menu === false ) continue
  else if (DATA_DOCS[docDim] === 'separator') {
    PorteDocumentsSubmenus.push({type:'separator'})
    continue
  }
  var ddoc = DATA_DOCS[docDim]
  var menu_id = `open-doc-${docDim}`
  // CURRENT_THING_MENUS.push(menu_id) // ça ne marche plus…
  var method  = editDocumentInPorteDocuments.bind(null, ddoc.id)
  if ( ddoc.dataeditor ) {
    // CURRENT_THING_MENUS.push(`${menu_id}-de`)  // ça ne marche plus…
    var deMethod  = openDocInDataEditor.bind(null, ddoc.id)
    PorteDocumentsSubmenus.push({
        label:    ddoc.hname
      , submenu:[
            {
              label: "Éditeur de données"
            , id:     `${menu_id}-de`
            , enabled: true
            , accelerator: ddoc.accelerator
            // , enabled: false// ça ne marche plus…
            , click: deMethod
            }
          , {
              label:  "Fichier complet"
            , id:     menu_id
            // , enabled: false // ça ne marche plus
            , enabled: true
            , click: method
            }
        ]
    })
  } else {
    PorteDocumentsSubmenus.push({
        label:    ddoc.hname
      , id:       menu_id
      , enabled:  true
      // , enabled:  false // ça ne marche plus
      , click:    method
      , accelerator: ddoc.accelerator
    })
  }
}

// console.log("PorteDocumentsSubmenus:", FAWriterSubmenus)

const ObjMenus = {
    class: 'ObjMenus'
  , mainMenuBar: null // défini par le main.js
  , getMenuData: null
  , getMenu(id) {
      var d = this.getMenuData[id]
      if('undefined' === typeof(d)){
        log.error(`Menu <${id}> is not defined…`)
        throw("Menu introuvable",id)
        return null
      }
      var m = this.mainMenuBar.items[d[0]].submenu.items[d[1]] ;
      if ('undefined' === typeof(m)){
        console.error("this.mainMenuBar.items[d[0]].submenu.items[d[1]] EST INDÉFINI")
        console.error("\n\nd = ", d)
        console.log("\n\nthis.mainMenuBar.items[d[0]]:",this.mainMenuBar.items[d[0]])
        console.log("\n\nthis.mainMenuBar.items[d[0]].submenu.items",this.mainMenuBar.items[d[0]].submenu.items)
      }
      // Si hiérarchie plus profonde
      try {
        if (d.length > 2){ m = m.submenu.items[d[2]] }
      } catch (e) {
        console.error("Impossible d'obtenir le menu id (d)", id, d)
        console.error(e)
        return null
      }
      // console.log("m final:", m)
      return m ;
    }
  , enableMenus(ids_list) {
      this.setMenusState(ids_list, true)
    }
  , disableMenus(ids_list) {
      this.setMenusState(ids_list, false)
    }
  , setMenusState(id_menus, state) {
      var my = this
      for(var mid of id_menus){
        // console.log("----> réglage du menu ", mid)
        my.getMenu(mid).enabled = state
      }
    }

    /**
     * Méthode qui actualise les menus par exemple lorsqu'on change
     * un label.
     *
     * Note : ne fonctionne pas encore vraiment, car l'état n'est pas
     * conservé, par exemple les menus enabled ou disabled ne conservent pas
     * leur état, il faudrait tout reprendre.
     */
  , updateMenus(){
      let { Menu } = require('electron')
      global.mainMenuBar = Menu.buildFromTemplate(this.data_menus)
      Menu.setApplicationMenu(global.mainMenuBar);
    }

    // les menus à activer quand un élément principal est ouvert (une analyse)
  , setMenuCurrentThing(on){
      var my = this
      my[on?'enableMenus':'disableMenus'](CURRENT_THING_MENUS)
    }

    /**
     * Pour modifier le label d'un menu
     */
  , setLabelMenu(menu_id, menu_label){
      var m = this.getMenu(menu_id).label = menu_label
      this.updateMenus();
      // var cloneM = m.clone()
    }
}

// Fonctions pratiques

function execJsOnCurrent(method, arg){
  if(arg){
    // console.log("execJsOnCurrent()",`current_analyse && current_analyse.${method}('${arg}')`)
    if ('string'==typeof arg) arg = `'${arg}'`
    mainW.webContents.executeJavaScript(`current_analyse && current_analyse.${method}(${arg})`)
  } else if(method.match(/\)$/)) {
    // La méthode avec ses arguments
    mainW.webContents.executeJavaScript(`current_analyse && current_analyse.${method}`)
  } else {
    mainW.webContents.executeJavaScript(`current_analyse && current_analyse.${method}()`)
  }
}
function execJS(methodAndArgs){
  mainW.webContents.executeJavaScript(methodAndArgs)
}

/**
 * Définition des menus
 */
const DATA_MENUS = [
  {
      label: 'Analyse'
    , enabled: true
    , submenu: [
          {
              label: 'Nouvelle…'
            , accelerator: 'CmdOrCtrl+N'
            , click: () => { mainW.webContents.executeJavaScript('FAnalyse.onWantNewAnalyse()')}
          }
        , {type: 'separator'}
        , {
              label: 'Ouvrir…'
            , accelerator: 'CmdOrCtrl+O'
            , click: () => {
                mainW.webContents.executeJavaScript('FAnalyse.chooseAnalyse()')
              }
          }
        , {
              label: 'Recharger'
            , accelerator: 'CmdOrCtrl+R'
            , click: () => {mainW.reload()}
          }
        , { type: 'separator' }
        , {
              label: 'Enregistrer'
            , id: 'save-analyse'
            , enabled: false
            , accelerator: 'CmdOrCtrl+S'
            , click: () => {execJsOnCurrent('saveIfModified')}
          }
        , {
              label: 'Enregistrer sous…'
            , id: 'save-as-analyse'
            , enabled: false
            , click: () => { mainW.webContents.send('save-as-analyse')}
          }
        , {type:'separator'}
        , {
              label: 'Nouvelle version…'
            , id: 'new-version'
            , enabled: false
            , click:() => {execJsOnCurrent('newVersionRequired')}
          }
        , {type:'separator'}
        , {
              label: 'Verrouiller'
            , id: 'option-locked'
            , type: 'checkbox'
            , checked: false
            , enabled: false
            , click: () => {execJsOnCurrent('toggleLock')}
          }
        , {type:'separator'}
        , {
              label: 'Choisir la vidéo du film…'
            // , click: () => {mainW.webContents.send('change-film-video')}
            , click: () => {mainW.webContents.executeJavaScript('FAnalyse.redefineVideoPath()')}
          }

        , {type: 'separator'}
        , {
              label: 'Exporter comme…'
            , submenu:[
                  {
                      label: 'PDF…'
                    , id: 'export-as-pdf'
                    , enabled: false
                    , click:()=>{execJsOnCurrent('exportAs', 'pdf')}
                  }
                , {
                      label: 'Livre ePub…'
                    , id: 'export-as-epub'
                    , enabled: false
                    , click:()=>{execJsOnCurrent('exportAs', 'epub')}
                  }
                , {
                      label: 'Livre Kindle…'
                    , id: 'export-as-kindle'
                    , enabled: false
                    , click:()=>{execJsOnCurrent('exportAs', 'kindle')}
                  }
                , {
                      label: 'DocBook…'
                    , id: 'export-as-docbook'
                    , enabled: false
                    , click:()=>{execJsOnCurrent('exportAs', 'docbook')}
                  }
            ]
          }
        , {
              label:'Ouvrir sur le bureau'
            , enabled:false
            , id:'open-in-finder'
            , click:()=>{execJsOnCurrent('openAnalyseInFinder')}
          }
        , {type: 'separator'}
        , {role: 'quit', label: 'Quitter', accelerator: 'CmdOrCtrl+Q'}
      ] // submenu du menu "Analyse"
  }
  /**
   * MENU ÉDITION
   */
 , {
     label: 'Édition'
   , role: 'edit'
   , submenu:[
        {label: 'Annuler', role: 'undo'}
      , {label: 'Refaire', role: 'redo'}
      , {type:'separator'}
      , {label: 'Tout sélectionner', role: 'selectAll'}
      , {label: 'Copier', role: 'copy'}
      , {label: 'Couper', role: 'cut'}
      , {label: 'Coller', role: 'paste'}
      , {type:'separator'}
      , {label: 'Console web', role:'toggleDevTools'}
   ]
 }

  /**
   * MENU AFFICHAGE
   */
  , {
        label: "Affichage"
      , enabled: true
      , submenu: [
            {
                label: "Analyse complète"
              , id: 'display-full-analyse'
              , accelerator: 'CmdOrCtrl+Alt+Shift+A'
              , enabled: false
              , click: () => {execJsOnCurrent('displayFullAnalyse')}
            }
          , {
              label: "Analyse complète (actualiser)"
              , id: 'display-full-analyse-forcer'
              , accelerator: 'CmdOrCtrl+Shift+A'
              , enabled: false
              , click: () => {execJsOnCurrent('displayFullAnalyse', true)}
            }
          , {type:'separator'}
          , {
                label: 'Protocle de l’analyse'
              , id: 'display-protocole'
              , enabled: false
              , click: ()=>{execJsOnCurrent('toggleProtocole')}
            }
          , {type:'separator'}
          , {
                label: "Informations sur le film"
              , id: 'display-infos-film'
              , accelerator: 'CmdOrCtrl+Shift+I'
              , enabled: false
              , click: () => {execJsOnCurrent('togglePanneauInfosFilm')}
            }
          , {type:'separator'}
          , {
                label: "Paradigmes de Field Augmenté"
              , enabled: true
              , submenu:[
                  {
                    label: 'PFA principal'
                  , id: 'display-pfa-1'
                  , accelerator: 'CmdOrCtrl+Alt+Shift+P'
                  , enabled: false
                  , click: ()=>{execJsOnCurrent('displayPFA', 1)}
                  }
                , {
                    label: 'PFA secondaire'
                  , id: 'display-pfa-2'
                  , enabled: false
                  , click: ()=>{execJsOnCurrent('displayPFA', 2)}
                  }
                , {
                    label: 'PFA tertiaire'
                  , id: 'display-pfa-3'
                  , enabled: false
                  , click: ()=>{execJsOnCurrent('displayPFA', 3)}
                  }
                , {
                    label: 'PFA quaternaire'
                  , id: 'display-pfa-4'
                  , enabled: false
                  , click: ()=>{execJsOnCurrent('displayPFA', 4)}
                  }
                ]
            }
          , {
                label: "Fondamentales"
              , id: 'display-fondamentales'
              , accelerator: 'CmdOrCtrl+Shift+F'
              , enabled: false
              , click: ()=>{execJsOnCurrent('togglePanneauFondamentales')}
            }
          , {
                label: "Personnages"
              , id: 'display-personnages'
              , accelerator: 'CmdOrCtrl+Shift+C'
              , enabled: false
              , click: ()=>{execJsOnCurrent('togglePanneauPersonnages')}
            }
          , {
                label: "Brins"
              , id: 'display-brins'
              , accelerator: 'CmdOrCtrl+Shift+B'
              , enabled: false
              , click: ()=>{execJsOnCurrent('togglePanneauBrins')}
            }
          , {
                label: 'Documents'
              , id: 'display-documents'
              , accelerator: 'CmdOrCtrl+Shift+W'
              , enabled: false
              , click: _ => {execJsOnCurrent('togglePanneauDocuments')}
            }
          , {
                label: "Décors"
              , id: 'display-decors'
              , accelerator: 'CmdOrCtrl+Shift+D'
              , enabled: false
              , click: ()=>{execJsOnCurrent('togglePanneauDecors')}
            }
          , {
                label: "Images"
              , id: 'display-images'
              , accelerator: 'CmdOrCtrl+Shift+G'
              , enabled: false
              , click: ()=>{execJsOnCurrent('togglePanneauImages')}
            }
          , {
                label: "Statistiques"
              , id: 'display-statistiques'
              , accelerator: 'CmdOrCtrl+Shift+S'
              , enabled: false
              , click: ()=>{execJsOnCurrent('togglePanneauStatistiques')}
            }
          , {type:'separator'}
          , {
                label: "Avancement de l'analyse"
              , id: 'display-analyse-state'
              , accelerator: 'CmdOrCtrl+Alt+S'
              , click: () => {execJsOnCurrent('toggleAnalyseState')}
            }
          , {
                label: "Dernier rapport produit"
              , id: 'display-last-report'
              , click: () => {execJsOnCurrent('displayLastReport')}
            }
          , {type:'separator'}
          , {
                label: 'Calque du PFA'
              , id: 'calc-pfa'
              , accelerator: 'CmdOrCtrl+Shift+P'
              , enabled: false
              , click:() => {execJsOnCurrent('displayCalcPFA')}
            }
      ]
    }
  /**
   * MENU DOCUMENTS
   */
  , {
        label: "Documents"
      , enabled: true
      , submenu: PorteDocumentsSubmenus
    }
  /**
   * MENU VIDÉO
   */
  , {
        label: "Vidéo"
      , enabled: true
      , submenu: [
            {
                label: 'Vitesse de lecture'
              , submenu: [
                    {label: 'Image/image', id: 'video-speed-rx0.07', type:'radio', click:()=>{setVideoSpeed(0.07)}}
                  , {label: 'Ralenti / 8', id: 'video-speed-rx0.12', type:'radio', click:()=>{setVideoSpeed(0.12)}}
                  , {label: 'Ralenti / 4', id: 'video-speed-rx0.25', type:'radio', click:()=>{setVideoSpeed(0.25)}}
                  , {label: 'Ralenti / 2', id: 'video-speed-rx0.5', type:'radio', click:()=>{setVideoSpeed(0.5)}}
                  , {label: 'Normale', id: 'video-speed-rx1', type:'radio', click:()=>{setVideoSpeed(1)}, selected: true}
                  , {label: 'x 2', id: 'video-speed-rx2', type:'radio', click:()=>{setVideoSpeed(2)}}
                  , {label: 'x 4', id: 'video-speed-rx4', type:'radio', click:()=>{setVideoSpeed(4)}}
                  , {label: 'x 8', id: 'video-speed-rx8', type:'radio', click:()=>{setVideoSpeed(8)}}
                  , {label: 'x 12', id: 'video-speed-rx12', type:'radio', click:()=>{setVideoSpeed(12)}}
                  , {label: 'x 16', id: 'video-speed-rx16', type:'radio', click:()=>{setVideoSpeed(16)}}
                ]
            }
          , {type: 'separator'}
          , {
                label: 'Temps courant…'
              , click:()=>{execJsOnCurrent('getAndShowCurrentTime')}
          }
          , {type: 'separator'}
          , {
                label: 'Temps courant comme début du film…'
              , click: () => {execJsOnCurrent('runTimeFunction', 'FilmStartTime')}
            }
          , {
                label: 'Temps courant comme fin du film (avant générique)…'
              , click: () => {execJsOnCurrent('runTimeFunction','FilmEndTime')}
            }
          , {
                label: 'Temps courant comme fin du générique de fin…'
              , click: () => {execJsOnCurrent('runTimeFunction','EndGenericFin')}
            }
          , {type: 'separator'}
          , {
                label: 'Prendre l’image courante'
              , click:() => {execJsOnCurrent('createShotWithCurrentPicture')}
            }
          , {
                label: 'Image courante comme vignette de scène courante…'
              , click:()=>{mainW.webContents.send('current-image-for-current-scene')}
            }
        ]
    }
  /**
    * Menu des events
    */
  , {
    label: 'Events'
  , submenu: [
        {
            label: 'Nouvel Eventer…'
          , id: 'new-eventer'
          , accelerator: 'CmdOrCtrl+Shift+E'
          , enabled: false
          , click: () => {execJsOnCurrent('createNewEventer')}
        }
      , {type:'separator'}
      , {
            label: 'Nouveau…'
          , submenu: [
                {label: 'Scène', accelerator: 'CmdOrCtrl+Alt+S', click: ()=>{createEvent('scene')}}
              , {label: 'Nœud STT', accelerator: 'CmdOrCtrl+Alt+T', click: ()=>{createEvent('stt')}}
              , {label: 'Objectif-Obstacle-Conflit', accelerator: 'CmdOrCtrl+Alt+O', click: ()=>{createEvent('dyna')}}
              , {label: 'Procédé', accelerator: 'CmdOrCtrl+Alt+P', click: ()=>{createEvent('proc')}}
              , {label: 'Note', accelerator: 'CmdOrCtrl+Alt+N', click: ()=>{createEvent('note')}}
              , {label: 'Idée', accelerator: 'CmdOrCtrl+Alt+I', click: ()=>{createEvent('idee')}}
              , {label: 'Info', accelerator: 'CmdOrCtrl+Alt+F', click: ()=>{createEvent('info')}}
              , {label: 'QRD', accelerator: 'CmdOrCtrl+Alt+Q', click: ()=>{createEvent('qrd')}}
              , {label: 'Action', accelerator: 'CmdOrCtrl+Alt+A', click: ()=>{createEvent('action')}}
              , {label: 'Dialogue', accelerator: 'CmdOrCtrl+Alt+D', click: ()=>{createEvent('dialog')}}
              , {label: 'Event', accelerator: 'CmdOrCtrl+Alt+E', click: ()=>{createEvent('event')}}
            ]
        }
      , {
            label: 'Liste des…'
          , submenu: [
                {label: 'Scènes', click: ()=>{listEvent('scene')}}
              , {label: 'Nœuds STT', click: ()=>{listEvent('stt')}}
              , {label: 'O.O.C.', click: ()=>{listEvent('dyna')}}
              , {label: 'Procédés', click: ()=>{listEvent('proc')}}
              , {label: 'Notes', click: ()=>{listEvent('note')}}
              , {label: 'Idées', click: ()=>{listEvent('idee')}}
              , {label: 'Infos', click: ()=>{listEvent('info')}}
              , {label: 'QRDs', click: ()=>{listEvent('qrd')}}
              , {label: 'Actions', click: ()=>{listEvent('action')}}
              , {label: 'Dialogues', click: ()=>{listEvent('dialog')}}
              , {label: 'Events', click: ()=>{listEvent('event')}}
            ]
        }
    ]
  }

  /**
   *
   */
  , {
        label: 'Options'
      , submenu: [
            {
                // Note: option générale
                label: "Charger la dernière analyse au chargement"
              , id:     'load_last_on_launching'
              , type:   'checkbox'
              , checked: false
              , click:  () => {
                  var checked = ObjMenus.getMenu('load_last_on_launching').checked
                  execJS(`FAnalyse.setGlobalOption('load_last_on_launching',${checked?'true':'false'})`)
                }
            }
          , {type: 'separator'}
          , {
                label: "Calcul automatique de la durée des scènes"
              , id: 'option_duree_scene_auto'
              , type: 'checkbox'
              , checked: true
              , click: () => {
                  var checked = ObjMenus.getMenu('option_duree_scene_auto').checked
                  execJS(`FAnalyse.setGlobalOption('option_duree_scene_auto',${checked?'true':'false'})`)
                }
            }
          , {type:'separator'}
          , {
                label: 'Démarrer 3 secondes avant l’event'
              , id:    'option_start_3secs_before_event'
              , type:  'checkbox'
              , checked:  false
              , enabled: true
              , click: ()=>{
                  var c = ObjMenus.getMenu('option_start_3secs_before_event').checked ? 'true' : 'false'
                  execJsOnCurrent(`options.set('option_start_3secs_before_event',${c})`)
              }
            }
          , {
                label:  'Démarrer quand un temps est choisi'
              , id:     'option_start_when_time_choosed'
              , type:   'checkbox'
              , checked: false
              , enabled: true
              , click: () => {
                  var c = ObjMenus.getMenu('option_start_when_time_choosed').checked ? 'true' : 'false'
                  execJS(`FAnalyse.setGlobalOption('option_start_when_time_choosed',${c})`)
                }
            }
          , {type:'separator'}
          , {
                label:  "Verrouiller les points d'arrêt"
              , id:     'option_lock_stop_points'
              , type:   'checkbox'
              , checked: true
              , click: () => {
                  var c = ObjMenus.getMenu('option_lock_stop_points').checked ? 'true' : 'false'
                  execJsOnCurrent(`options.set('option_lock_stop_points',${c})`)
                }
            }
          , {type:'separator'}
          , {
                label: 'Lancer les tests au démarrage'
              , id: 'run_tests_at_startup'
              , type: 'checkbox'
              , checked: false
              , click: () => {
                  var c = ObjMenus.getMenu('run_tests_at_startup').checked ? 'true' : 'false'
                  execJS(`FAnalyse.setGlobalOption('run_tests_at_startup',${c})`)
                }
            }
          , {type:'separator'}
          , {
                label:    "Utiliser le miniwriter pour éditer les textes"
              , id:       'option_edit_in_mini_writer'
              , type:     'checkbox'
              , checked:  false
              , click:  () => {
                  var c = ObjMenus.getMenu('option_edit_in_mini_writer').checked ?'true':'false'
                  execJsOnCurrent(`options.set('option_edit_in_mini_writer',${c})`)
              }
            }
        ]
    }
  , {

      label: 'Outils'
    , submenu:[
        {
            label: 'Jouer les Tests FIT'
          , enabled:true // TODO: plus tard, seulement en développement
          , id: 'test-fit'
          , accelerator:'Cmd+Alt+Ctrl+T'
          , click: () => {execJS('App.runtests()')}
        }
      , {
            label: 'Test manuel de l’application'
          , enabled: true // TODO: plus tard, seulement en développement
          , id:'test-manuel-app'
          , accelerator: 'CmdOrCtrl+Alt+Shift+T'
          , click: () => {execJS('App.runHandTests()')}
        }
      , {
            label: 'Poursuivre les tests (rejoindre le dernier)'
          , enabled: true // TODO: plus tard, seulement en développement
          , id: 'goto-last-test-manuel'
          , click: () => {execJS('App.runFromLastHandTest()')}
        }
      , {type: 'separator'}
      , {
            label: 'Checker la validité des données'
          , id: 'check-data-validity'
          , enabled:false
          , click: () => {execJsOnCurrent('checkDataValidity')}
        }
      , {type: 'separator'}
      , {
            label: 'Rejoindre la dernière scène définie'
          , enabled: false
          , id: 'goto-last-scene'
          , click: () => {execJsOnCurrent('goToLastScene')}
        }
      , {type: 'separator'}
      , {
            label: 'Manuel d’utilisation'
          , enabled: true
          , click: () => {execJS('App.openManuel()')}
        }
      , {
            label: 'Manuel d’utilisation Développement'
          , enabled: true
          , click: _ => {execJS('App.openManuelDeveloppement()')}
        }
      ]
    }
  , {
        label: 'Raccourcis'
      , submenu: fakeShortcutsIn([
          {
              label: 'Forcer les raccourcis « out-fields » (INTERFACE)'
            , click: _ => {execJS('UI.toggleKeyUpAndDown(true)')}
          }
        , {
              label: 'Forcer les raccourcis « in-fields » (TEXTFIELD)'
            , click: _ => {execJS('UI.toggleKeyUpAndDown(false)')}
          }
        , {type:'separator'}
        , {
              label: 'Raccourcis « Go-To »…'
            , shortcut: 'G'
            , click: _ => {execJS('Helper.open("go-to")')}
          }
        , {
              label: 'Nouvel élément…'
            , shortcut: 'N'
            , click: _ => {execJS('Helper.open("new-element")')}
          }
        , {type:'separator'}
        , {
              label: 'Nouveau marqueur…'
            , shortcut: 'M'
            , click: _ => {execJS('current_analyse && current_analyse.markers.createNew()')}
          }
        , {
              label: 'Liste des marqueurs'
            , shortcut: 'Shift M'
            , click: _ => {execJS('current_analyse && Markers.displayListing()')}
          }
        , {type:'separator'}
        , {
              label: 'Liste des scènes'
            , shortcut: 'Shift S'
            , click: _ => {execJS('current_analyse && FAEscene.klisting.show()')}
          }
        , {
              label: 'Liste des nœuds structurels'
            , shortcut: 'Shift N'
            , click: _ => {execJS('current_analyse && FAEstt.klisting.show()')}
          }
      ])
    }
]

/**
  Pour simuler les marques de raccourcis dans les menus
  Cf. N0004
  @param {Array of Hash} items Définition des items de menus qui vont ensemble
    Noter qu'il faut tous les labels, pour pouvoir estimer la taille du plus
    grand et copier les autres par rapport.
    Chaque élément est un `object` contenant {,:label, :shortcut}
**/
function fakeShortcutsIn(items){
  var maxLen = 0
  items.forEach(o => {
    if ( o.type === 'separator' ) return
    var len = o.label.length + (o.shortcut||'').length + 1
    len < maxLen || ( maxLen = len )
  })

  maxLen += 5

  items.forEach(o => {
    if (o.type === 'separator') return
    var scLen = (o.shortcut||'').length + 1
    o.label = o.label.padEnd(maxLen - scLen) + (o.shortcut || '')
  })

  return items
}

var dataMenuPreferences = {
      role:   'preferences'
    , label:  "Préférences"
    , accelerator: 'CmdOrCtrl+,'
    , click: () => {console.log("Je dois afficher les préférences")}
  }
if (process.platform === 'darwin') {
  DATA_MENUS.unshift({
      label: app.getName()
    , type: 'submenu'
    , submenu: [
        { role: 'about' }
      , { type: 'separator' }
      , dataMenuPreferences
      , { role: 'services' }
      , { type: 'separator' }
      , { role: 'hide' }
      , { role: 'hideothers' }
      , { role: 'unhide' }
      , { type: 'separator' }
      , { role: 'quit' }
    ]
  })
} else if(process.platform === 'win'){
  // Pour window
  DATA_MENUS[2].submenu.push({type:'separator'})
  DATA_MENUS[2].submenu.push(dataMenuPreferences)
} else {
  // Pour linux
  DATA_MENUS[1].submenu.push({type:'separator'})
  DATA_MENUS[1].submenu.push(dataMenuPreferences)
}

function setVideoSize(size){
  mainW.webContents.executeJavaScript(`current_analyse && current_analyse.options.change('video_size','${size}')`)
}
function setVideoSpeed(speed){
  mainW.webContents.send('set-video-speed', {speed: speed})
}
function createEvent(etype){
  mainW.webContents.send('create-event', {type: etype})
}
function listEvent(etype){
  mainW.webContents.send('list-event', {type: etype})
}

// Avant de construire le Menu, on mémorise les positions des menus
// qui possède un identifiant pour pouvoir les retrouver par `getMenu(id)`
var nbMainMenus = DATA_MENUS.length, nbSubMenus, nbSubSubMenus
  , iMainMenu, iSubMenu, iSubSubMenu
  , mainMenu, subMenu, subSubMenu
  , my = ObjMenus
  ;
my.getMenuData = {} // pour mettre toutes les données
for(iMainMenu = 0; iMainMenu < nbMainMenus; ++iMainMenu ){
  mainMenu = DATA_MENUS[iMainMenu]
  // mainMenu contient {label: 'Analyse', submenu: [] etc.}
  nbSubMenus = mainMenu.submenu.length
  for(iSubMenu = 0; iSubMenu < nbSubMenus; ++iSubMenu){
    subMenu = mainMenu.submenu[iSubMenu]
    if (subMenu.submenu){
      // Si c'est aussi un groupe de menu
      nbSubSubMenus = subMenu.submenu.length
      for(iSubSubMenu=0; iSubSubMenu < nbSubSubMenus; ++iSubSubMenu){
        subSubMenu = subMenu.submenu[iSubSubMenu]
        // console.log("----> subSubMenu:", subSubMenu)
        if(!subSubMenu.id){continue}
        my.getMenuData[subSubMenu.id] = [iMainMenu, iSubMenu, iSubSubMenu]
        // console.log("=====> Je prends ses données :", my.getMenuData[subSubMenu.id])
      }
    }
    if (!subMenu.id){ continue }
    // On l'enregistre dans les données pour pouvoir le récupérer facilement
    // par getMenu(id)
    // console.log("Ce menu a un ID:", subMenu, iMainMenu, iSubMenu)
    my.getMenuData[subMenu.id] = [iMainMenu, iSubMenu]
  }

}//fin de boucle sur tous les menus principaux
// console.log("my.getMenuData:", my.getMenuData)
// throw("pour s'arrêter")

ObjMenus.data_menus = DATA_MENUS

module.exports = ObjMenus
// module.exports = DATA_MENUS


ipc.on('set-option', (ev, data) => {
  // log.info("-> on set-option", data) // bizarrement, s'écrit en console
  var m = ObjMenus.getMenu(data.menu_id)
  m[data.property] = data.value
  // log.info("<- on set-option", data)
})

ipc.on('display-analyse', ev => {
  FAWindows.displayAnalyse()
})
ipc.on('current-analyse-exist', (ev, yesOrNo) => {
  ObjMenus.setMenuCurrentThing(yesOrNo)
})

// Pour les tests, pour pouvoir simuler un choix de menu
// Dans le test, on met :
//  ipc.send('click-menu', {menu_id: <id du menu>})
ipc.on('click-menu', (e, data) => {
  ObjMenus.getMenu(data.menu_id).click()
})
