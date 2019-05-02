'use strict'
/**

  Class FADecor
        FASousDecor
  -----------------
  Gestion des décors

**/
class FADecor {
// ---------------------------------------------------------------------
//  CLASS

static resetAll(){
  delete this._data
  this.resetForSort()
}

static resetForSort(){
  delete this._sortedDecors
  delete this._optionsDecors
}

/**
  Retourne les données des décors, en les prenant dans les
  scènes définies.
**/
static get data(){
  return this._data || defP(this,'_data', this.getDataDecors())
}

/**
  Retourne la liste des décors (instances FADecor) classés par
  nombre de scènes.
**/
static get sortedDecors(){
  if(undefined === this._sortedDecors){
    this._sortedDecors = Object.values(this.data)
    this._sortedDecors.sort((a,b) => b.scenes.length - a.scenes.length)
    // console.log("this._sortedDecors:", this._sortedDecors)
  }
  return this._sortedDecors
}

/**
  Helper retournant la liste des options pour le menu des
  décors
**/
static optionsDecors(){
  if(undefined === this._optionsDecors){
    let my = this
      , sorteds = this.sortedDecors
      // Note : il faut que je prenne sortedDecors ici, sinon
      // il initialise la propriété _optionDecors ci-dessous ce qui
      // fait qu'il se retrouve indefinie dans la boucle for

    my._optionsDecors = ['<option value="">Choisir…</option>']
    for(var decor of sorteds){
      my._optionsDecors.push(`<option value="${decor.name}">${decor.name} (${decor.scenesCount})</option>`)
    }
    my._optionsDecors = my._optionsDecors.join('')
  }
  return this._optionsDecors
}

/**
  Récupère la donnée des décors dans la liste des scènes, directement
  C'est une liste une contient en clé le nom du décor principal et en
  valeur la liste des sous-décors qu'il possède.
**/
static getDataDecors(){
  var dinst = {}  // table avec des instances
  // console.log("-> getDataDecors (FAEscene.scenes = ", FAEscene.scenes)
  FAEscene.forEachScene(function(scene){
    // console.log("scene:",scene)
    if(scene.decor && scene.decor != ''){

      var decors
        , dec
        , sdecors
        , sdec
        , nombre_decors
        , nombre_sdecors

      // console.log(`Décor de la scène ${scene.numero}: "${scene.decor}"`)
      if (scene.decor.match(/\&/)){
        decors = scene.decor.split('&').map(d => d.trim()).filter(d => d != '')
      } else {
        decors = [scene.decor]
      }
      nombre_decors = decors.length

      for(dec of decors){
        if(undefined === dinst[dec]){
          dinst[dec] = new FADecor(dec)
        }
        dinst[dec].addScene(scene.numero, nombre_decors)
        // Il faut que le décor existe pour que le sous-décor puisse
        // exister, c'est pour ça qu'on le met là.
        if(scene.sous_decor && scene.sous_decor != ''){
          if(scene.sous_decor.match(/\&/)){
            sdecors = scene.sous_decor.split('&').map(sd => sd.trim()).filter(sd => sd != '')
          } else {
            sdecors = [scene.sous_decor]
          }
          nombre_sdecors = sdecors.length

          for(sdec of sdecors){
            if(undefined === dinst[dec].sousDecor(sdec)){
              dinst[dec].addSousDecor(sdec)
            }
            dinst[dec].sousDecor(sdec).addScene(scene.numero, nombre_sdecors)
          }
        }
      }
    }
  })
  // console.log("Données décors :", dinst)
  return dinst
}

static get count(){
  return Object.keys(this.data).length
}
static forEachDecor(fn){
  for(var decor in this.data){
    if(false === fn(this.data[decor] /* instance FADecor */)) break
  }
}

// ---------------------------------------------------------------------
//  INSTANCE FADecor

constructor(name, data){
  this.name           = name
  this.data           = data
  this.scenes         = []
  this.scenes_numeros = []
  this.sousDecors     = {}
}

/**
  Ajoute la scène de numéro +numero+

  @param {Number}   numero  Numéro de la scène
  @param {Boolean}  nbdecs  Nombre de décors que comprend la scène. En général
                            un seul.
**/
addScene(numero, nbdecs){
  this.scenes.push([numero, nbdecs])
  this.scenes_numeros.push(numero)
  FADecor.resetForSort() // pour recalculer le classement
}
/**
  Retourne le sous décor de nom (name) +name+
  @return {FASousDecor} Instance du sous-décor
**/
sousDecor(name){return this.sousDecors[name]}

/**
  Ajoute le sous-decor de nom +name+ et de données
  +data+
  @param {String} name    Nom du sous-décor
  @param {Object} data    Les données du sous-décor
**/
addSousDecor(name, data){
  this.resetForSort()
  this.sousDecors[name] = new FASousDecor(this, name, data)
  return this.sousDecors[name]
}

reset(){
  this.resetForSort()
}

resetForSort(){
  delete this._sousDecorsSorted
  delete this._optionsSousDecors
}

get sousDecorsSorted(){
  if(undefined === this._sousDecorsSorted){
    this._sousDecorsSorted = Object.values(this.sousDecors)
    this._sousDecorsSorted.sort((a,b) => b.scenesCount - a.scenesCount)
  }
  return this._sousDecorsSorted
}

optionsSousDecors(){
  if(undefined === this._optionsSousDecors){
    this._optionsSousDecors = ['<option value="">Choisir le sous-décor…</option>']
    for(var sdecor of this.sousDecorsSorted){
      this._optionsSousDecors.push(`<option value="${sdecor.name}">${sdecor.name} (${sdecor.scenesCount})</option>`)
    }
    this._optionsSousDecors = this._optionsSousDecors.join('')
  }
  return this._optionsSousDecors
}

/**
  Boucle avec une fonction sur tous les sous-decors du
  décor.
**/
forEachSousDecor(fn){
  for(var sname in this.sousDecors){
    if(false === fn(this.sousDecors[sname])) break
  }
}

/**
  Boucle avec une fonction sur la liste des scènes du sous-décor
**/
forEachScene(fn){
  for(var dscene of this.scenes){
    // console.log("dscene:", dscene)
    if(false === fn(FAEscene.getByNumero(dscene[0]))) break
  }
}

get sousDecorsCount(){return Object.keys(this.sousDecors).length}
get scenesCount(){ return this.scenes_numeros.length}
}// /fin FAdecor


// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------


class FASousDecor {

// ---------------------------------------------------------------------
//  INSTANCE FASousDecor

constructor(decor, name, data){
  this.decor  = decor
  this.name   = name
  this.data   = data // rien pour le moment
  this.scenes         = []
  this.scenes_numeros = []
}
/**
  Ajoute la scène de numéro +numero+

  @param {Number}   numero  Numéro de la scène
  @param {Boolean}  nbsdec  Nombre de sous-décors de la scène. En général
                            un seul.
**/
addScene(numero, nbsdec){
  this.scenes.push([numero, nbsdec])
  this.scenes_numeros.push(numero)
  this.decor.resetForSort()
}

/**
  Boucle avec une fonction sur la liste des scènes du sous-décor
**/
forEachScene(fn){
  for(var dscene of this.scenes){
    if(false === fn(FAEscene.getByNumero(dscene[0]))) break
  }
}
get scenesCount(){return this.scenes_numeros.length}
}
