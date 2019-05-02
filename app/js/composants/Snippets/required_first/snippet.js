'use strict'
/**
 * Définition des snippets
 */

const Snippets = {
  data: {} // les snippets

, loaded: false
  /**
  * Regarde si +snip+ est un snippet et le retourne.
  * Sinon, retourne null
  **/
, check(snip){
    if (undefined === this.data[snip]) return null
    return this.data[snip]
  }
/**
* Méthode qui checke le possible snippet +snip+ et le remplace
* dans le sélector +sel+ (vraiment class Selector) le cas échéant.
**/
, checkAndReplace(sel, snip){
    if (!this.loaded) this.load()
    var remp = this.check(snip)
    if(!remp) return // pas un snippet
    sel.set(sel.startOffset - snip.length, null)
    sel.insert(remp)
    // Si le texte contient '$0' on doit s'y rendre et le
    // sélectionner
    var dol_index = remp.indexOf('$0')
    if(dol_index < 0) return // pas de $0
    var remp_len = remp.length
    var curOffset = 0 + sel.startOffset
    sel.startOffset = curOffset - remp_len + dol_index
    sel.endOffset   = sel.startOffset + 2
  }
  /**
  * Il y a les snippets "universels" et les snippets propres à l'application
  **/
, load(){
    var adata
    if (this.fileExists()){
      adata = YAML.safeLoad(fs.readFileSync(this.path,'utf8'))
    }
    this.updateData(adata)
    this.loaded = true
  }
, init(){
    if(this.loaded === false) this.load()
  }
  // Actualiser les data (par exemple après l'édition du document ou au char
  // gement)
, updateData(new_data){
    this.data = this.UData // les données universelles (cf. universal_data.js)
    if(undefined !== new_data){
      Object.assign(this.data, new_data)
      F.notify('Données snippets actualisée.')
    }
  }
, fileExists(){return fs.existsSync(this.path)}

}

Object.defineProperties(Snippets,{
  a:{
    get(){return current_analyse}
  }
  // Chemin d'accès au fichier définissant les snippets pour l'analyse courante
, path:{
    get(){return this.a.filePathOf('snippets.yaml')}
  }
  // Chemin d'accès au fichier définissant les snippets universels
, universalSnippetsPath:{
    get(){return path.join()}
  }
})
