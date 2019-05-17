'use strict'

Object.assign(InfosFilm,{

// Pour ne pas générer d'erreur au check
DESave(){}

/**
  Méthode utilisée par DataEditor pour actualiser un item
**/
, DEUpdateItem(dinfos){
    let inff = InfosFilm.current
    inff.contents = YAML.dump(dinfos)
    // console.log("Dans DESave, this.contents = ", this.contents)
    inff.iofile.save({after: this.DEAfterUpdateItem.bind(this)})
    FAWriter.resetDocument('infos')
    return inff
  }
, DEAfterUpdateItem(){
    // mais normalement, on ne doit pas passer par là en cas d'erreur
    InfosFilm.current.iofile.saved && F.notify("Informations du film enregistrées avec succès.")
  }

, DECreateItem(){return null} // on ne peut pas créer d'instance
, DERemoveItem(){return null} // on ne peut pas créer d'instance

})

Object.defineProperties(InfosFilm,{
  dataEditor:{
    get(){return this._dataeditor||defP(this,'_dataeditor',DataEditor.init(this, this.DataEditorData))}
  }
/**
  Les données utiles pour l'instanciation d'un dataeditor pour l'élément
  Sa validité sera contrôlée avant l'instanciation de this.dataEditor
  Cf. le manuel développeur pour le détail.
**/
, DataEditorData:{get(){

    // Les données pour des peoples
    const dataPeople = {
        type:STRtextarea
      , aide:'un patronyme par ligne : nom, prenom'
      , validities:REQUIRED
      , exemple:"Nom, Prénom\nNom, Prénom"
      , setValueMethod:(v) => {return (v||['']).join(RC)}
      , checkValueMethod:(v) => {
        // On doit s'assurer que ce soit bien une liste de 'nom, prénom'
      }
      , getValueMethod:(v) => {
          if(isNullish(v)) return
          return v.split(RC).map(e => e.trim()).filter(e => isNotEmpty(e))
        }
    }

    return {
      type:   'infosfilm'
    , title:  'INFOS FILM'
    , items:  [InfosFilm.current]
    , no_new_item: true // pas d'ajout possible
    , no_del_item: true // pas de suppression possible
    , checkOnDemand: true // on ne checke pas d'office (=> bouton "Check")
    , titleProp: 'mainTitle'
    /**
      Définition des champs d'édition d'un élément
    **/
    , dataFields: [

      // Panneau des informations proprement sur le film

      {
          type: 'panel'
        , id:   'film'
        , title: 'Film'
        , dataFields:[
            {label:'Titre du film', type:STRtext, prop:'title', validities:REQUIRED}
          , {label:'Titre français', type:STRtext, prop:'title_fr'}
          , {label:'Date sortie', type:STRtext, class:'medium', prop:'date', exemple:'AAAA', after:'[[JJ/]MM/]AAAA', validities:REQUIRED}
          , Object.assign({label:'Réalisation',prop:'realisation'}, dataPeople)
          , Object.assign({label:'Écriture',prop:'ecriture'}, dataPeople,{exemple:"Nom, Prénom, Roman\nNom, Prénom, Scénario"})
          , Object.assign({label:'Production',prop:'production'}, dataPeople)
          , Object.assign({label:'Musique',prop:'musique'}, dataPeople,{exemple:"Nom, Prénom, Compositeur\nNom, Prénom, Interprète"})
          ]
      }
    , {
          type:'panel'
        , id:'video'
        , title:'Vidéo'
        , dataFields:[
            {label:'Zéro', type:STRtextarea, prop:'zero', exemple:'p.e. "Juste après le titre"', validities:REQUIRED}
          , {label:'Première image', type:STRtextarea, prop:'frame1_description', exemple:'Description de la première image', validities:REQUIRED}
          , {label:'Temps 1ère image', type:STRtext, class:'medium', prop:'frame1_time', exemple:'0:00:00', after:'(H:MM:SS.ff)', validities:REQUIRED,
              setValueMethod:(v)=>{
                if(isNullish(v)) return ''
                return (new OTime(v)).vhorloge
              }
            , getValueMethod:(v)=>{
                if(isNullish(v)) return
                return (new OTime(v)).vtime
              }
            }
          ]
      }
    , {
          type:'panel'
        , id:'analyse'
        , title:'Analyse'
        , dataFields:[
            Object.assign({label:'Analystes',prop:'analystes'}, dataPeople)
          , Object.assign({label:'Correcteurs',prop:'correction'}, dataPeople, {validities:null})
          , {label:'Date début', type:STRtext, class:'short', prop:'date_debut', exemple:'AAAA', after:'[[JJ/]MM/]AAAA', validities:REQUIRED}
          , {label:'Date fin', type:STRtext, class:'short', prop:'date_fin', exemple:'AAAA', after:'[[JJ/]MM/]AAAA', validities:REQUIRED}
          ]
      }
      ]
    }
  }}
})
