'use strict'
/**
 * Export de l'analyse au format PDF
 *
 */
module.exports = function(options){
  var my = this

  let src_name    = my.a.html_name
    , src_format  = 'HTML'
    , dst_name    = my.a.pdf_name
    , dst_path    = my.a.pdf_path

  // On détruit le fichier destination s'il existe
  fs.existsSync(dst_path) && fs.unlinkSync(dst_path)

  // Maintennat, on utilise toujours Calibre et le document HTML
  var cmd = `cd "${my.a.folderExport}" && ${EBOOK_CONVERT_CMD} ${src_name} ${dst_name}`

  // console.log("cmd pandoc:", cmd)
  exec(cmd, (error, stdout, stderr) => {
    if(error)throw(error)
    my.log(`=== Création du livre PDF "${dst_name}" (à partir du format ${src_format}) terminé avec succès.`)
    F.notify(`Création du livre PDF "${dst_name}" (à partir du format ${src_format}) terminé avec succès.`)
  });

}
