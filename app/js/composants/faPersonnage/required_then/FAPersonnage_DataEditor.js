'use strict'

Object.assign(FAPersonnage,{

/**
  Méthode pour sauver les données éditées par le DataEditor
**/
  DESave(){
    this.contents = YAML.dump(this.data)
    // console.log("Dans DESave, this.contents = ", this.contents)
    this.iofile.save({after: this.DEAfterSave.bind(this)})
  }
, DEAfterSave(){
    this.modified = false
  }
/**
  Méthode utilisée par DataEditor pour créer un item
**/
, DECreateItem(dperso){
    defaultize(this, '_data', {})
    this._data[dperso.id] = dperso
    this.update() // reset et actualise le listing si ouvert
    this.DESave()
    return this.get(dperso.id)
  }

/**
  Méthode utilisée par DataEditor pour actualiser un item
**/
, DEUpdateItem(dperso){
    this._data[dperso.id] = dperso
    this.reset()
    this.DESave()
    return this.get(dperso.id)
  }

/**
  Méthode utilisée par DataEditor pour supprimer un item
**/
, DERemoveItem(dperso){
    delete this._data[dperso.id]
    this.update()
    this.DESave()
    return true
  }
})

Object.defineProperties(FAPersonnage,{
  dataEditor:{
    get(){return this._dataeditor||defP(this,'_dataeditor',DataEditor.init(this, this.DataEditorData))}
  }
/**
  Les données utiles pour l'instanciation d'un dataeditor pour l'élément
  Sa validité sera contrôlée avant l'instanciation de this.dataEditor
  Cf. le manuel développeur pour le détail.
**/
, DataEditorData:{get(){
    return {
      type: STRpersonnage
    , title: 'PERSONNAGES'
    , items: this.personnages
    , titleProp: 'pseudo'
    /**
      Définition des champs d'édition d'un élément
    **/
    , dataFields: [
        {label:'Id', type:STRtext, prop:'id', exemple:'a-z0-9_', validities: UNIQ|REQUIRED|ASCII,
          getValueMethod:(v)=>{if(v){return v.toLowerCase()}}}
      , {label:'Diminutif', type:STRtext, prop:'dim', validities:UNIQ|REQUIRED}
      , {label:'Pseudo', type:STRtext, prop:'pseudo', validities:UNIQ|REQUIRED}
      , {label:'Prénom', type:STRtext, prop:'prenom'}
      , {label:'Nom', type:STRtext, prop:'nom'}
      , {label:'Age(s)', type:STRtext, prop:'ages', exemple:'12 ou 23, 68'
          , getValueMethod:(v)=>{
              if(!v) return v
              v = v.split(',').map(a => parseInt(a.trim(),10))
              if(v.length == 1) return v[0]
              else return v
            }
          , checkValueMethod:(v) => {
              // Doit être un âge ou une liste d'âges
              if(!v) return
              if(! Array.isArray(v)) v = [v]
              var errors = []
              v.map(a => {if(isNaN(a)){errors.push("doit être un nombre ou une liste de nombres séparés par des virgules")}})
              if(errors.length) return errors
              // sinon rien
            }
        }
      , {label:'Description', type:STRtextarea, prop:'description', validities:REQUIRED}
      , {label:'Fonctions', type:STRtextarea, prop:'fonctions', aide:'une fonction par ligne', exemple:'Protagoniste\nAdjuvant\nPermet de relancer le suspense'}
      , {label:'Dimensions', type:STRtextarea, prop:'dimensions', aide:'1 par ligne (&lt;type&gt;: &lt;description&gt;)'
          , exemple:'religieuse: @T croit en Dieu.\nprofessionnelle: @T travaille pour lui.'
          , setValueMethod: (v)=>{
              if(!v) return ''
              var arr = []
              for(var k in v){arr.push(`${k}: ${v[k]}`)}
              return arr.join("\n")
            }
          , getValueMethod: (v) => {
              if(!v) return null
              var tbl = {}, k, v
              v.split(RC).map(line => {
                [k, v] = line.split(':').map(e => valOrNull(e))
                tbl[k] = v
              })
              return tbl
            }

          , checkValueMethod: (v) => {
              if (!v) return // rien = ok
              try {
                ('object' === typeof(v)) && Array.isArray(v) && raise("Les dimensions devraient être un objet.")
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
    }
  }}
})
