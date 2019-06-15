'use strict'

/*

assert_fileExists
assert_notFileExists
*/

window.assert_fileExists = function(fpath, options){
  assert(
      fs.existsSync(fpath)
    , `OK, le fichier "${fpath}" existe`
    , `Hum… le fichier "${fpath}" devrait exister, il est introuvable…`
    , options
  )
}
window.assert_notFileExist = function(fpath, options){
  assert(
      fs.existsSync(fpath) === false
    , `OK, le fichier "${fpath}" n'existe pas`
    , `Hum… le fichier "${fpath}" ne devrait pas exister, or il existe bien…`
    , options
  )
}
