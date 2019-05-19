'use strict'

/**
  * Class Options
  * -------------
  * Gestion des options
  */

class Options {
constructor(analyse){
  this.a = this.analyse = analyse
}
get class(){return 'Options'}
get type(){return 'object'}

  // Options par défaut
static get DEFAULT_DATA(){
  return {
      'option_start_when_time_choosed':   true
    , 'option_lock_stop_points':          false
    , 'video_size':                       "medium"
    , 'video_speed':                      1
    , 'option_start_3secs_before_event':  false
    , 'option_edit_in_mini_writer':       false
    , 'option_duree_scene_auto':          true
    , 'option_ban_timeline':              false
  }
}

get modified(){ return this._modified || false }
set modified(v){this._modified = v}

  // Obtenir l'option d'id <opid>
get(opid, defValue){
  if ( isDefined(this.data[opid]) ) return this.data[opid]
  else return defValue || this.constructor.DEFAULT_DATA[opid]
}

// Définir la valeur d'une option
set(opid, value, dont_save){
  this.data[opid] = value
  this.onSetByApp(opid, value)
  if(dont_save !== true) this.save() // je préfère sauver tout de suite
  // this.modified = true
}

/**
  Méthode appelée par les menus quand on change la valeur d'une option
**/
change(opid, value, dont_save){
  // Quelques traitement particuliers
  switch (opid) {
    case 'video_size':
      if(value === '+'){
        value = this.a.videoController.getSize() + 50
      } else if (value === '-'){
        value = this.a.videoController.getSize() - 50
      } else {
        // Sinon c'est une valeur normale, comme 'large' ou 'medium'
      }
      break
    default:

  }
  this.set(opid, value, !!dont_save)
}
/**
 * En fonction de l'application, les choses à faire quand on change une
 * option.
 */
onSetByApp(opid, value){
  // console.log("Options#onSetByApp", opid, value)
  switch (opid) {
    case 'video_size':
      return this.a.videoController.setSize(value)
    case 'video_speed':
      return this.a.videoController.setSpeed(value)
    case 'option_edit_in_mini_writer':
      return UI.miniWriterizeTextFields(null, value)
    case 'option_ban_timeline':
      return UI.toggleModeBanTimeline(value)
  }
}


setData(data)    { this.data = data }

saveIfModified() { this.modified && this.save() }
save(){
  if(!this.a) return false
  fs.writeFileSync(this.path, JSON.stringify(this.data),'utf8')
  if(fs.existsSync(this.path)){
    this.modified = false
    return true
  } else {
    throw new Error(`Un problème est survenu à l'enregistrement des options dans "${this.path}"…`)
  }
}

load(){
  if(!this.a) throw new Error("Impossible de charger les options d'une chose qui n'existe pas…")
  if(fs.existsSync(this.path)){
    this.data = require(this.path)
  } else {
    this.data = this.DEFAULT_DATA
  }
  this.modified = false
}

/**
  Réglage des options dans les menus (en asynchrone)
 */
setInMenus(){
  // Options générales
  log.info('-> Options#setInMenus')
  let set_option = 'set-option'
  ipc.send(set_option, {menu_id: 'option_start_when_time_choosed', property:STRchecked, value: this.startWhenTimeChosen})
  ipc.send(set_option, {menu_id: 'option_lock_stop_points', property:STRchecked, value: this.lockStopPoints})
  ipc.send(set_option, {menu_id: 'option_start_3secs_before_event', property:STRchecked, value: this.start3SecondsBefore})
  // Options propres à l'analyse courante
  let midSize = VideoController.VIDEO_SIZES[this.videoSize] ? this.videoSize : 'custom'
  ipc.send(set_option, {menu_id: `size-video-${midSize}`, property:STRchecked, value: true})
  ipc.send(set_option, {menu_id: `video-speed-rx${this.videoSpeed}`, property:STRchecked, value:true})
  ipc.send(set_option, {menu_id: 'option-locked', property:STRchecked, value: this.appLocked})
  log.info('<- Options#setInMenus')
}

// Toutes les données options
get data(){return this._data||defP(this, '_data', this.constructor.DEFAULT_DATA)}
set data(v){this._data = v}

// ---------------------------------------------------------------------
// Toutes les valeurs, pour raccourcis
get appLocked(){ return !!this.a.locked }
get videoSize(){return this.get('video_size')}
set videoSize(v){this.set('video_size', v)}
get videoSpeed(){return this.get('video_speed')}
set videoSpeed(v){this.set('video_speed', v)}
get startWhenTimeChosen(){return !!this.get('option_start_when_time_choosed')}
get lockStopPoints(){return !!this.get('option_lock_stop_points')}
get start3SecondsBefore(){return !!this.get('option_start_3secs_before_event')}

// /fin valeurs d'options
// ---------------------------------------------------------------------

get path(){return this._path || defP(this, '_path', path.join(this.a.folder,'options.json'))}

}


module.exports = Options
