'use strict'
Object.defineProperties(FAPersonnage,{
  dataEditor:{
    get(){return this._dataeditor||defP(this,'_dataeditor',new DataEditor(this, this.DataEditorData))}
  }
, DataEditorData:{get(){
    return {
      type: 'personnage'
    , items: this.personnages
    , titleProp: 'pseudo'
    /**
      Définition des champs d'édition d'un élément
    **/
    , dataFields: [
        {label:'Id', type:'text', prop:'id', exemple:'a-zA-Z_', validities:[UNIQ, REQUIRED]}
      , {label:'Diminutif', type:'text', prop:'dim', validities:[UNIQ, REQUIRED]}
      , {label:'Pseudo', type:'text', prop:'pseudo', validities:[UNIQ, REQUIRED]}
      , {label:'Prénom', type:'text', prop:'prenom'}
      , {label:'Nom', type:'text', prop:'nom'}
      , {label:'Age(s)', type:'text', prop:'ages', exemple:'12 ou [23, 68]'}
      , {label:'Description', type:'textarea', prop:'description', validities:[UNIQ, REQUIRED]}
      , {label:'Dimensions', type:'textarea', prop:'dimensions', aide:'1 par ligne (&lt;type&gt;: &lt;description&gt;)'
          , exemple:'religieuse: @T croit en Dieu.\nprofessionnelle: @T travaille pour lui.'
          , setValueMethod: (v)=>{
              if(!v) return ''
              var arr = []
              for(var k in v){arr.push(`${k}: ${v[k]}`)}
              return arr.join("\n")
            }
          , getValueMethod: (v) => {
              if(!v) return
              var tbl = {}, k, v
              v.split(RC).map(line => {
                [k, v] = line.split(':').map(e => valOrNull(e))
                tbl[k] = v
              })
              return tbl
            }

          , checkValueMethod: (v) => {
              try {
                Object.isObject(v) || raise("Les dimensions devraient être un objet.")
                for(var k in v){
                  v[k] || raise(`La clé de dimension "${k}" est mal définie (&lt;clé&gt;: &lt;valeur&gt;)`)
                }
              } catch (e) {
                return e
              }
              return // rien = ok
            }
        }
      ]
    /**
      Méthode qui sera appelée quand on enregistrement l'élément édité
    **/
    , onSave: function(){F.notify("Implémentation de la méthode onSave requise")}
    , onRemove: function(){F.notify("Implémentation de la méthode onRemove requise")}

    }
  }}
})
