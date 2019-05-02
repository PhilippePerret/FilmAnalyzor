'use strict'
/**
* Class FAExporter
* ----------------
* Classe qui permet d'exporter le code, c'est-à-dire, surtout, de
* l'écrire dans les fichiers.
**/

class FAExporter {
  constructor(analyse){
    this.analyse = analyse
  }

  /**
  * Méthode qui ajoute le contenu +contents+ au fichier +fpath+ en vérifiant
  * qu'il a bien été enregistré
  **/
  append(fpath, contents){
    var currentSize = this.currentSizeOf(fpath)
    fs.appendFileSync(fpath, contents, 'utf8')
    this.checkDiff(fpath, currentSize + Buffer.from(contents).length)
  }

  /**
  * Méthode qui vérifie que la taille du fichier +fpath+ soit bien
  * +expectedSize+
  **/
  checkDiff(fpath, expectedSize){
    var curSize = this.currentSizeOf(fpath)
    if(curSize != expectedSize){
      throw(`La taille du fichier "${fpath}" devrait être de ${expectedSize} octets, elle est de ${curSize} octets.`)
    } else {
      FABuilder.log(`Taille du fichier OK : ${parseInt(expectedSize/10,10)/100} Ko.`)
    }
  }

  /**
  * Retourne la taille courante du fichier +fpath+ ou 0 s'il n'existe pas
  **/
  currentSizeOf(fpath){
    if(fs.existsSync(fpath)){
      return fs.statSync(fpath).size
    } else {
      return 0
    }
  }
}
