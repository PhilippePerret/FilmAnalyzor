'use strict'

let removeFile = function(fpath, msgfile){
  if(fs.existsSync(fpath)){
    fs.unlinkSync(fpath)
    if(fs.existsSync(fpath)){
      throw(`Impossible de détruire ${msgfile}`, fpath)
    } else if (msgfile) {
      console.log(msgfile+' a été détruit.')
    }
  } else if (msgfile) {
    console.log(`${msgfile} n'existe pas (inutile de le détruire).`)
  }
}
