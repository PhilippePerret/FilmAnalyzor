'use strict'

/**
  Permet de prendre une image de l'image courante.
**/
module.exports = function(time){
  let my = this
  // ffmpeg -ss <horloge départ> -t <duree> -i <video path> -r <ratio> <image name.ext>
  // var imgName = `scene-${FAEscene.current || 1}-%01d.jpeg`
  if(undefined === time) time = my.a.locator.currentTime
  var imgName = this.time2fname(time)
    , imgPath = this.pathOf(imgName)
    , cmd = `ffmpeg -ss ${time.vhorloge} -i ${my.a.videoPath} -frames:v 1 -r 1 ${imgPath}`
  // -r 0.5 => prendre toutes les deux secondes
  var callback = function(err, stdout, stderr){
    // if(stderr) console.error(stderr)
    if (fs.existsSync(imgPath)){
      if (my.listing && my.listing.opened) setTimeout(my.add.bind(my,imgName),500)
      else F.notify(T('confirm-current-image'))
    } else {
      F.error(T('unfound-current-image'))
    }
  }
  exec(cmd, callback)
}
