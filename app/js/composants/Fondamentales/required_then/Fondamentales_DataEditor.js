'use strict'

Object.assign(Fondamentales,{

  DESave(){

  }
, DECreateItem(ditem){
    console.log("DECreateItem(ditem:)", ditem)
    return null // on ne doit pas pouvoir créer de nouvelles fondamentales
  }
, DEUpdateItem(ditem){

  }
, DERemoveItem(ditem){

  }
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
    , titleProp: 'title'
    , dataFields:[

        // Panneau du PERSONNAGE FONDAMENTAL
        {
          type:'panel'
        , id: 'fd1'
        , title: 'Personnage'
        , dataFields: [
            {label:'Id perso', type:'text', class:'medium', prop:'pseudo', validities:REQUIRED
              , checkValueMethod:(v)=>{return FAPersonnage.get(v) != undefined}
            }
          , {label:'Description', type:'textarea', prop:'fd1-description', validities:REQUIRED}
          , {label:'Facteur U', type:'textarea', prop:'fd1-Ufactor', aide:'universalité de cette fondamentale'}
          , {label:'Facteur O', type:'textarea', prop:'fd1-Ofactor', aide:'originalité de cette fondamentale'}
          ]
        }

        // Panneau de la QUESTION DRAMATIQUE FONDAMENTALE
      , {
          type: 'panel'
        , id: 'fd2'
        , title: 'QDF'
        , dataFields: [
            {label:'Id QD', type:'text', class:'short', prop:'fd2-question', validities:REQUIRED}
          , {label:'Objectif', type:'text', prop:'fd2-objectif', validities:REQUIRED}
          , {label:'Description', type:'textarea', prop:'fd2-description', validities:REQUIRED}
          , {label:'Facteur U', type:'textarea', prop:'fd2-Ufactor', aide:'universalité de cette fondamentale'}
          , {label:'Facteur O', type:'textarea', prop:'fd2-Ofactor', aide:'originalité de cette fondamentale'}
          ]
        }

        // Panneau de l'OPPOSITION FONDAMENTALE
      , {
          type: 'panel'
        , id: 'fd3'
        , title: 'Opposition'
        , dataFields: [
            {label:'Antagonisme', type:'text', prop:'antagonisme', validities:REQUIRED}
          , {label:'ID antagoniste', type:'text', prop:'antagoniste'
              , checkValueMethod:(v)=>{return FAPersonnage.get(v) != undefined}
            }
        , {label:'Description', type:'textarea', prop:'fd3-description', validities:REQUIRED}
        , {label:'Facteur U', type:'textarea', prop:'fd3-Ufactor', aide:'universalité de cette fondamentale'}
          , {label:'Facteur O', type:'textarea', prop:'fd3-Ofactor', aide:'originalité de cette fondamentale'}
          ]
        }

        // Panneau de la RÉPONSE DRAMATIQUE FONDAMENTALE
      , {
          type: 'panel'
        , id: 'fd4'
        , title: 'RDF'
        , dataFields: [
            {label:'Réponse', type:'select', prop:'fd4-reponse', values:{oui:'Positive',non:'Négative'}, validities:REQUIRED}
          , {label:'Paradoxale', type:'checkbox', prop:'fd4-paradoxale'}
          , {label:'Paradoxe', type:'textarea', prop:'fd4-paradoxe', exemple:'Seulement si réponse paradoxale'}
          , {label:'Description', type:'textarea', prop:'fd4-description', validities:REQUIRED}
          , {label:'Signification', type:'textarea', prop:'fd4-signification', validities:REQUIRED}
          , {label:'Facteur U', type:'textarea', prop:'fd4-Ufactor', aide:'universalité de cette fondamentale'}
          , {label:'Facteur O', type:'textarea', prop:'fd4-Ofactor', aide:'originalité de cette fondamentale'}
          ]
        }

        // Panneau du CONCEPT FONDAMENTAL
      , {
          type: 'panel'
        , id: 'fd5'
        , title: 'Concept'
        , dataFields: [
            {label:'Concept', type:'textarea', prop:'concept', validities:REQUIRED}
            , {label:'Description', type:'textarea', prop:'fd5-description', validities:REQUIRED}
            , {label:'Facteur U', type:'textarea', prop:'fd5-Ufactor', aide:'universalité de cette fondamentale'}
          , {label:'Facteur O', type:'textarea', prop:'fd5-Ofactor', aide:'originalité de cette fondamentale'}
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
