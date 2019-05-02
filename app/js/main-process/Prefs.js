'use strict'
/**
 * Object Prefs
 * ------------
 * Gestion [universelle] des préférences
 *
 * Version 1.0.0
 *
 * Dans le main process (qui doit requérir ce module), on trouve des méthodes
 * IPC qui vont récupérer les données
 *
 * Pour obtenir des valeurs dans le renderer, on doit utiliser :
 * dataPrefs = <ipcRenderer>.sendSync('get-prefs', <table data>)
 * Avec <table data> qui est une table contenant les clés à recevoir, avec
 * la valeur par défaut en valeur.
 *
 * Note : utiliser en parallèle avec le module `Prefs-renderer.js`
 *
 */
const electron = require('electron')
const {app} = require('electron')
const path  = require('path')
const fs    = require('fs')
const ipc   = electron.ipcMain

const Prefs = {
  class: 'Prefs'
, type:  'object'

, inited:       false
, modified:     false
  // Données
, prefsPath:    null  // chemin d'accès au fichier préférence
, userPrefs:    {}    // Préférence de l'utilisateur
, analysePrefs: {}    // Préférence de l'analyse courante

  /**
   * Récupérer une valeur en préférences
   */
, get(anyPref, defaultValue){
    if('string' === typeof anyPref){
      // Si une simple préférence est envoyée
      // Note : cette méthode sert aussi aux autre condition
      return this.userPrefs[anyPref] || this.analysePrefs[anyPref] || defaultValue
    } else if (Array.isArray(anyPref)) {
      // Si une liste de clés de préférence est envoyée
      var dPrefs = {}
      for(var kpref of anyPref){
        var vpref = this.get(kpref, undefined)
        if(undefined !== vpref) dPrefs[kpref] = vpref
      }
      return dPrefs
    } else if (anyPref instanceof Object) {
      // Si un tableau de préférence est envoyé
      for(var kpref in anyPref){
        var vpref = this.get(kpref, undefined)
        if(undefined !== vpref) anyPref[kpref] = vpref
      }
      return anyPref // avec toutes les valeurs affectées
    } else {
      throw("[Prefs#get] Je ne sais pas comment traiter : ", anyPref)
    }
  }
  /**
    * +anyPref+     'analyse' ou 'user' (ou OBJECT)
    * +kpref+       La clé de la préférence
    * +vpref+       Valeur à donner à la préférence
    * Si +anyPref+ est un object :
    *   Soit {<clé pref>: <valeur>, ...} (pour user prefs)
    *   Soit {<clé pref>: {type: <'user'|'analyse'>, value: <valeur>}, ...}
    */
, set(anyPref, kpref, vpref){
    if ('string' === typeof anyPref){
      switch (anyPref) {
        case 'analyse':
          this.analysePrefs[kpref] = vpref
          break
        case 'user':
          this.userPrefs[kpref] = vpref
          break
      }
    } else if ( Array.isArray(anyPref) ){
      for(var dpref of anyPref){
        this.set(dpref.type, (dpref.key || dpref.id), dpref.value)
      }
    } else if ( anyPref instanceof Object ){
      var dpref, type, valu
      for(var kpref in anyPref){
        dpref = anyPref[kpref]
        // Attention ici : si on emploie 'object' == typeof(dpref), si
        // dpref est null (valeur possible pour une préférence), la condition
        // est true puisque le typeof de null est 'object', alors que son
        // instance (instanceof) n'est pas Object (allez comprendre…)
        if(dpref instanceof Object){
          type = dpref.type || 'user'
          valu = dpref.value
        } else {
          type = 'user'
          valu = dpref
        }
        this.set(type, kpref, valu)
      }
    }
    this.modified = true
  }

  /**
   * Initialisation des préférences
   */
, init(){
    if (this.inited) throw("On ne devrait pas initier deux fois les préférences.")
    this.userPrefsPath = path.join(app.getPath('userData'), 'user-preferences.json')
    this.inited = true
    return this // chainage
  }

, saveIfModified(){
    this.modified && this.save()
  }
  /**
   * Sauver les préférences
   */
, save(){
    console.log("Sauvegarde des options")
    fs.writeFileSync(this.userPrefsPath, JSON.stringify(this.userPrefs), 'utf8')
    console.log("Préférences User actualisées.", this.userPrefs)
    // TODO Faire pareil avec les préférences de l'analyse
    // TODO Il faudrait trouver un autre nom que "analyse" pour que ce module
    // puisse être utilisé dans d'autres application.
  }

  /**
   * Charger les préférences
   */
, load(){
    this.loadUserPrefs()
  }

, loadUserPrefs(){
    if(fs.existsSync(this.userPrefsPath)){
      this.userPrefs = require(this.userPrefsPath)
    } else {
      this.userPrefs = {
          'load_last_on_launching':   true
        , 'last_analyse_folder':      null
        , 'option_duree_scene_auto':  true
      }
    }
    /*/     + "/" pour décommenter, - "/" pour ex-commenter
    else {
      Pour débugage seulement
      // Pour les créer maintenant
      console.log(`Le fichier "${this.userPrefsPath}" n'existe pas. Je crée les préférences de toute pièce`)
      this.userPrefs = {
        "load_last_on_launching": true,
        // "last_analyse_folder": "/Users/philippeperret/Programmation/Electron/FilmsAnalyse/analyses/her"
        "last_analyse_folder": "./analyses/her"
      }
      this.save()
    }
    //*/
  }
  /**
   * Réglage des menus options globales après le chargement du
   * fichier userPrefs
   */
, setMenusPrefs(){
    ObjMenus.getMenu('load_last_on_launching').checked  = this.get('load_last_on_launching')
    ObjMenus.getMenu('option_duree_scene_auto').checked = this.get('option_duree_scene_auto')
    ObjMenus.getMenu('option_edit_in_mini_writer').checked = this.get('option_edit_in_mini_writer')
    ObjMenus.getMenu('option_start_3secs_before_event').checked = this.get('option_start_3secs_before_event')
    ObjMenus.getMenu('option_lock_stop_points').checked = this.get('option_lock_stop_points')
  }
}


/**
 * Pour les préférences
 */
ipc.on('get-pref', (ev, data) => {
  console.log("Dans ipc on get-pref, je reçois :", data)
  console.log("La valeur retournée est :", Prefs.get(data))
  ev.returnValue = Prefs.get(data)
})
ipc.on('set-pref', (ev, data) => {
  ev.returnValue = Prefs.set(data)
})



module.exports = Prefs
