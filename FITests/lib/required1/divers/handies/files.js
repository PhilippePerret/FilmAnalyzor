'use strict'

/**
  mkFile(<data>)
  Pour créer un fichier avec un contenu aléatoire ou fourni.

  @param {Object} data
                      filename:         Nom du fichier optionnel
                      extension:        Extension optionnelle (peut être définie
                                        avec +filename+)
                      content:          Contenu optionnel
                      content_length:   Longueur de contenu optionnel
**/
if ( global.mkFile) {
  throw new Error("La propriété ou méthode `mkFile` ne doit pas être utilisée. Elle sert aux tests.")
} else {
  global.mkFile = async function(data){
    data = data || {}
    const folderFiles = path.join(Tests.supportTestsFolder,'files')
    fs.existsSync(folderFiles) || fs.mkdirSync(folderFiles)
    if ( undefined === data.filename ) {
      data.filename = `file${Number(new Date())}${Math.rand(1000)}`
    }
    if ( data.extension ) data.filename += `.${data.extension}`
    const filepath = path.join(folderFiles, data.filename)
    if ( undefined === data.content ) {
      var from = Math.rand(1000)
      var len  = data.content_length || Math.rand(2000)
      data.content = String.LoremIpsum.substring(from,from+len)
    }

    return new Promise( (ok,ko) => {
      fs.writeFile(filepath, data.content, (err) => {
        if ( err ) console.error(err)
        ok({path: filepath, content: data.content})
      })
    })
  }
}
