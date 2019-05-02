'use strict'

/**
  Module permettant de gérer les procédés dans toute l'analyse,
  à commencer par le formulaire d'event et l'export
**/

Object.assign(FAProcede,{
// ---------------------------------------------------------------------
//  CLASS

/**
  Retourne le procédé qui a pour identifiant +proc_id+, quel que soit
  sa catégorie et sa sous-catégorie. L'idée de détacher le procédé de
  ses catégories et sous-catégories tient au fait qu'un procédé va pouvoir
  "bouger" dans les catégories au fil du temps et de l'utilisation du
  logiciel.

  [1] Pour obtenir rapidement ce procédé sans passer par les catégories et
      sous-catégories, on fait une première passe qui crée une table avec en
      clé l'id du procédé et en valeur sa catégorie, sa sous-catégorie et son
      id.
  @return {FAProcede} Le procédé d'identifiant +proc_id+
**/
get(proc_id){
  if(undefined === this.procedes) this.procedes = {}
  if(undefined === this.procedes[proc_id] && this.procsTruplets[proc_id]){
    this.procedes[proc_id] = new FAProcede(...this.procsTruplets[proc_id])
  }
  return this.procedes[proc_id]
}

/**
  Retourne le truplet du procédé d'identifiant +proc_id+

  @return {Array} [categorie, sous-categorie, procédé-id]
**/
, getTruplet(proc_id){
    return this.procsTruplets[proc_id]
  }

, init(){
    this.iofile.load({after:this.afterLoading.bind(this)})
    this.inited = true
  }

, reset(){
    delete this.data
    delete this._menuCategories
    delete this._menusSousCategories
    delete this._menusProcedesSCat
    delete this._procsTruplets
    return this // chainage
  }
,

/**
  Après le chargement, on reçoit toutes les données procédés
  C'est le contenu complet du fichier `data/data_procedes.yaml`.
**/
afterLoading(data){
  // console.log("data procédés",data)
  this.data = data
}
,

updateData(){
  log.info('-> FAProcede::updateData')
  this.reset()
  this.iofile.load({after:this.afterUpdateData.bind(this)})
  log.info('<- FAProcede::updateData')
}
,

afterUpdateData(data){
  log.info('-> FAProcede::afterUpdateData')
  this.reset()
  this.data = data
  // Actualiser la liste dans le formulaire courant s'il existe
  EventForm.currentForm && EventForm.currentForm.updateMenusProcedes()
  log.info('<- FAProcede::afterUpdateData')
}
,

showDescriptionOf(event_id){
  let menu = $(`form#form-edit-event-${event_id} div.div-proc-types select`)
    , value     = menu.val()
    , cate_id   = menu.attr('data-cate-id')
    , scate_id  = menu.attr('data-scate-id')
    , msg
  if(menu.hasClass('menu-categories-procedes')){
    msg = this.descriptionCategorie(value)
  } else if(menu.hasClass('menu-sous-categories-procedes')){
    msg = this.descriptionSousCategorie(cate_id, value)
  } else {
    msg = this.descriptionProcede(cate_id, scate_id, value)
  }

  F.notice(`${msg}`)
}
// Lire la note [1] ci-dessus
// Attention : cette méthode ne crée pas d'instances FAProcede, elle ne
// fait que construire la table procsTruplets contenant l'id de la
// catégorie, l'id de la sous-catégorie et l'id du procédé.
, getAllProcsTruplets(){
    var d = {}
    for (var cate_id in this.data){
      for ( var scate_id in this.data[cate_id].items ){
        for ( var proc_id in this.data[cate_id].items[scate_id].items ){
          d[proc_id] = [cate_id, scate_id, proc_id]
        }
      }
    }
    return d
  }

})

Object.defineProperties(FAProcede,{
  procsTruplets:{
    get(){return this._procsTruplets||defP(this,'_procsTruplets', this.getAllProcsTruplets())}
  }
, iofile:{
    get(){return this._iofile||defP(this,'_iofile', new IOFile(this))}
  }
, path:{
    get(){return this._path||defP(this,'_path',path.join(APPFOLDER,'app','js','data','data_proc.yaml'))}
  }
})
