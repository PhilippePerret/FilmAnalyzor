'use strict'

const exec = require('child_process').exec

module.exports = function(options){
  let my = this

  my.log("*** Création du ePub…")

  let src_name    = my.a.html_name
    , src_format  = 'HTML'
    , dst_name    = my.a.epub_name
    , dst_path    = my.a.epub_path

  // On détruit le fichier destination s'il existe
  fs.existsSync(dst_path) && fs.unlinkSync(dst_path)

  // HTML -> ePub
  // var cmd = `cd ${my.folder};pandoc -o ./exports/${my.epub_name} ./exports/${my.html_name} --css=/Users/philippeperret/Programmation/Electron/FilmsAnalyse/app/analyse_files/css/publishing.css --epub-cover-image='./exports/cover.jpg'`

  // Markdown -> ePub
  // ORIGINAL À RETRAVAILLER
  // var cmd = `cd ${my.a.folder};pandoc -o ./exports/${my.a.epub_name} ./exports/${src_name} --metadata-file=./exports/metadata.yaml --css=/Users/philippeperret/Programmation/Electron/FilmsAnalyse/app/analyse_files/css/publishing.css --toc --toc-depth=2 --epub-cover-image="./exports/img/cover.jpg"`
  // SIMPLIFIÉ :
  // var cmd = `cd ${my.a.folderExport};pandoc -o ${my.a.epub_name} ${src_name} --css=css/html.css --toc --toc-depth=2`

  // Maintennat, on utilise toujours Calibre et le document HTML
  var cmd = `cd "${my.a.folderExport}" && ${EBOOK_CONVERT_CMD} ${src_name} ${dst_name}`

  // console.log("cmd Calibre:", cmd)
  exec(cmd, (error, stdout, stderr) => {
    if(error)throw(error)
    my.log(`=== Création du livre ePub (à partir du fichier ${src_name} au format ${src_format}) terminé avec succès.`)
    F.notify(`Création du livre ePub (à partir du fichier ${src_name} au format ${src_format}) terminé avec succès.`)
  });



  // pandoc -o OUTPUTNAME.epub INPUTNAME.md --toc --toc-depth=2 --epub-cover-image=COVERIMAGE.png


}
