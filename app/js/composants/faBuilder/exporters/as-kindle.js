'use strict'
/**
* Sortie au format Kindle
*
* Note : pour le dépôt sur Amazone, l'image doit être à part.
*
**/

var util = require('util')
var exec = require('child_process').exec

module.exports = function(options){
  let my = this


  let src_name    = my.a.html_name
    , src_format  = 'HTML'
    , dst_name    = my.a.mobi_name
    , dst_path    = my.a.mobi_path

  // On détruit le fichier destination s'il existe
  fs.existsSync(dst_path) && fs.unlinkSync(dst_path)

  // Maintennat, on utilise toujours Calibre et le document HTML
  // TODO Travailler les options
  var cmd = `cd "${my.a.folderExport}" && ${EBOOK_CONVERT_CMD} ${src_name} ${dst_name}`


  my.log("cmd Calibre:", cmd)
  exec(cmd, (error, stdout, stderr) => {
    if(error)throw(error)
    my.log(`=== Création du livre Kindle "${dst_name}" (depuis le fichier ${src_name} au format ${src_format}) terminé avec succès.`)
    F.notify(`Création du livre Kindle "${dst_name}" (depuis le fichier ${src_name} au format ${src_format}) terminé avec succès.`)
  });
}
