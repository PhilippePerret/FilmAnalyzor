'use strict'
/**
 * Module de construction de l'analyse complète en HTML
 */
const exec = require('child_process').exec

/**
 * +options+
 *
 *
 */
module.exports = function(options, fn_callback){

var my = this // Instance FABuilder

// Markdown -> HTML

var cmd_metadata = ''
if(fs.existsSync(path.resolve(my.a.folder,'exports','metadata.yaml'))){
  cmd_metadata = " --metadata-file=./exports/metadata.yaml"
  my.report.add("Méta-données définies dans le fichier './exports/metadata.yaml'.")
} else {
  my.report.add("Pas de méta-données définies. Vous devriez le faire dans le fichier './exports/metadata.yaml'.", 'warning')
}

var cmd_epub_cover = ''
if(fs.existsSync(path.resolve(my.a.folder,'exports','img','cover.jpg'))){
  cmd_epub_cover = " --epub-cover-image='./exports/img/cover.jpg'"
  my.report.add("Image de couverture ajoutée (./exports/img/cover.jpg)")
} else {
  my.report.add("Pas d'image de couverture (./exports/img/cover.jpg)", 'warning')
}

// Préparation du fichier CSS
// --------------------------
var folderCss = path.join(my.a.folderExport,'css')
fs.existsSync(folderCss) || fs.mkdirSync(folderCss)
var srcPath = './app/js/composants/faBuilder/assets/css/publishing.css'
var dstPath = path.join(folderCss, 'html.css')
// TODO Plus tard, on vérifira que le fichier css est à jour
fs.existsSync(dstPath) && fs.unlinkSync(dstPath)
fs.copyFileSync(srcPath, dstPath)

let wholeFilePath = path.join(my.a.folderExport,'.chunks','wholeHTML.html')

var code = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title></title>
  <link rel="stylesheet" href="./css/html.css" />
</head>
<body>
  ${fs.existsSync(wholeFilePath)?fs.readFileSync(wholeFilePath):'FICHIER wholeHTML.html INTROUVABLE'}
</body>
</html>
`

fs.writeFile(my.a.html_path, code, 'utf8', error => {
  if(error) throw(error)
  my.log(`=== Création du format HTML terminé avec succès.`)
  F.notify(`Création du format HTML terminé avec succès.`)
  fn_callback()
})
}
