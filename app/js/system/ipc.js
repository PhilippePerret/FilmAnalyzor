'use strict'
/**
 * Côté RENDERER, on reçoit les évènements envoyés
 */

ipc.on('save-as-analyse', (ev) => {
  F.notify("Enregistrement sous… de l'analyse")
})

// Créer le type +data.type+ d'event depuis les menus
ipc.on('create-event', (ev, data) => {
  EventForm.onClickNewEvent(null, data.type)
})
// Lister le type +data.type+ d'event depuis les menus
ipc.on('list-event', (ev, data) => {
  FAEvent.FAlistingEvents(data.type)
})

// Activé par le menu pour prendre l'image courante comme vignette de
// la scène.
ipc.on('current-image-for-current-scene', (ev) => {
  require('./js/tools/vignette_current_scene.js')(ev)
})

ipc.on('set-video-speed', (e, data) => {
  current_analyse.videoController.setSpeed(data.speed, /* save = */ true )
})

ipc.on('uncaugth-exception', data => {
  let msg
  switch (typeof data.error) {
    case STRobject:
      msg = data.error.message + JSON.stringify(data.error)
      break;
    default:
      msg = data.error
  }
  F.error(`UNE ERREUR EST SURVENUE : ${msg}${RC+RC}source: ${data.source}`)
})
