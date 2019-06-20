'use strict'

global.goToTime = function(time){
  current_analyse.locator.setTime(new OTime(time))
}
global.goToRTime = function(rtime){
  goToTime(rtime + current_analyse.filmStartTime)
}
