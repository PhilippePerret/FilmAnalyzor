'use strict'

Object.assign(Fondamentales,{

    DESave(){} // pour ne pas générer l'erreur lors du check

 , DEUpdateItem(ditem){
    let fpath = ditem.fd1.path
    let iFonds = new Fondamentales(fpath)
    delete ditem.fd1.path
    iFonds.contents = ditem // pour l'IOFile
    iFonds.save({after: this.DEAfterUpdateItem.bind(this)})
    PorteDocuments.resetDocument(iFonds.affixe)
    return iFonds
  }
, DEAfterUpdateItem(){
    F.notify("Fondamentales enregistrées avec succès.")
  }
/**
  [1] Il y a seulement deux fichiers fondamentales, et ce sont ces deux
  fichiers-là qu'on peut éditer
**/
, DECreateItem(ditem){return null} // on ne peut pas en créer [1]
, DERemoveItem(ditem){return null} // on ne peut pas en détruire [1]

})
Object.defineProperties(Fondamentales,{

  DataEditorData:{get(){
    return {
      type: 'fondamentales'
    , title: 'FONDAMENTALES'
    , items:[
        new Fondamentales(this.a.fondsFilePath)
      , new Fondamentales(this.a.fondsAltFilePath)
      ]
    , no_new_item: true // pas d'ajout possible
    , no_del_item: true // pas de suppression possible
    , checkOnDemand: true // on ne checke pas d'office (=> bouton "Check")
    , titleProp: 'title'
    , dataFields:[

        // Panneau du PERSONNAGE FONDAMENTAL
        {
          type:'panel'
        , id: 'fd1'
        , title: 'Personnage'
        , dataFields: [
            {label: '', type:STRhidden, prop:'path'}
          , {label:'Id perso', type:STRtext, class:'medium', prop:'perso_id', validities:REQUIRED
              , checkValueMethod:(v)=>{return FAPersonnage.get(v) != undefined}
              , showLink: FAPersonnage.show.bind(FAPersonnage)
              , editLink: FAPersonnage.edit.bind(FAPersonnage)
            }
          , {label:'Description', type:STRtextarea, prop:'description', validities:REQUIRED}
          , {label:'Facteur U', type:STRtextarea, prop:'Ufactor', aide:'universalité de cette fondamentale'}
          , {label:'Facteur O', type:STRtextarea, prop:'Ofactor', aide:'originalité de cette fondamentale'}
          ]
        }

        // Panneau de la QUESTION DRAMATIQUE FONDAMENTALE
      , {
          type: 'panel'
        , id: 'fd2'
        , title: 'QDF'
        , dataFields: [
            {label:'QD (id)', type:STRtext, class:STRshort, prop:'question_id', validities:REQUIRED
              , observe:{
                  'drop':{accept:'.qrd', tolerance:'intersect', classes:{'ui-droppable-hover':'survoled'}
                          , drop:(e,ui) => $(e.target).val(ui.helper.attr(STRdata_id))
                        }
                }
              , checkValueMethod:(v) => {
                let qrd = FAEvent.get(parseInt(v,10))
                if(undefined===qrd || qrd.type != STRqrd) return "requiert impérativement un identifiant de QRD existante"
              }
              , editLink:(v)=>{FAEvent.edit.bind(FAEvent)(v)}
            }
          , {label:'Objectif', type:STRtext, prop:'objectif'}
          , {label:'Description', type:STRtextarea, prop:'description', validities:REQUIRED}
          , {label:'Facteur U', type:STRtextarea, prop:'Ufactor', aide:'universalité de cette fondamentale'}
          , {label:'Facteur O', type:STRtextarea, prop:'Ofactor', aide:'originalité de cette fondamentale'}
          ]
        }

        // Panneau de l'OPPOSITION FONDAMENTALE
      , {
          type: 'panel'
        , id: 'fd3'
        , title: 'Opposition'
        , dataFields: [
            {label:'Antagonisme', type:STRtext, prop:'antagonisme', validities:REQUIRED}
          , {label:'ID antagoniste', type:STRtext, prop:'antagoniste_id'
            , showLink:FAPersonnage.show.bind(FAPersonnage)
            , observe:{
                'drop':{accept:'.qrd', tolerance:'intersect', classes:{'ui-droppable-hover':'survoled'}
                        , drop:(e,ui) => $(e.target).val(ui.helper.attr(STRdata_id))
                      }
              }
            , checkValueMethod:(v) => {
              let perso = FAPersonnage.get(v)
              if(undefined===perso) return "requiert impérativement un identifiant de personnage existant"
            }
          }
        , {label:'Description', type:STRtextarea, prop:'description', validities:REQUIRED}
        , {label:'Facteur U', type:STRtextarea, prop:'Ufactor', aide:'universalité de cette fondamentale'}
          , {label:'Facteur O', type:STRtextarea, prop:'Ofactor', aide:'originalité de cette fondamentale'}
          ]
        }

        // Panneau de la RÉPONSE DRAMATIQUE FONDAMENTALE
      , {
          type: 'panel'
        , id: 'fd4'
        , title: 'RDF'
        , dataFields: [
            {label:'RD (id)', type:STRtext, class:STRshort, prop:'reponse-id', validities:REQUIRED
              , observe:{
                  'drop':{accept:'.qrd', tolerance:'intersect', classes:{'ui-droppable-hover':'survoled'}
                          , drop:(e,ui) => $(e.target).val(ui.helper.attr(STRdata_id))
                        }
                  }
              , checkValueMethod:(v) => {
                let qrd = FAEvent.get(parseInt(v,10))
                if(undefined===qrd || qrd.type != STRqrd) return "requiert impérativement un identifiant de QRD existante"
              }
              , editLink:(v)=>{FAEvent.edit.bind(FAEvent)(v)}
            }
          , {label:'Réponse', type:STRselect, prop:'reponse', values:{oui:'Positive',non:'Négative'}, validities:REQUIRED}
          , {label:'Paradoxale', type:STRcheckbox, prop:'paradoxale'}
          , {label:'Paradoxe', type:STRtextarea, prop:'paradoxe', exemple:'Seulement si réponse paradoxale'}
          , {label:'Description', type:STRtextarea, prop:'description', validities:REQUIRED}
          , {label:'Signification', type:STRtextarea, prop:'signification', validities:REQUIRED}
          , {label:'Facteur U', type:STRtextarea, prop:'Ufactor', aide:'universalité de cette fondamentale'}
          , {label:'Facteur O', type:STRtextarea, prop:'Ofactor', aide:'originalité de cette fondamentale'}
          ]
        }

        // Panneau du CONCEPT FONDAMENTAL
      , {
          type: 'panel'
        , id: 'fd5'
        , title: 'Concept'
        , dataFields: [
            {label:'Concept', type:STRtextarea, prop:'concept', validities:REQUIRED}
            , {label:'Description', type:STRtextarea, prop:'description', validities:REQUIRED}
            , {label:'Facteur U', type:STRtextarea, prop:'Ufactor', aide:'universalité de cette fondamentale'}
          , {label:'Facteur O', type:STRtextarea, prop:'Ofactor', aide:'originalité de cette fondamentale'}
          ]
        }
      ]
    }
  }}

, isAlt:{
    get(){return this._isalt || false}
  , set(v){this._isalt = v}
  }
})
