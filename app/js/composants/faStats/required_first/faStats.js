'use strict'
/**
  Class FAStats
**/

class FAStats {
/**
  @param {Instance} owner   Une instance d'un objet de l'analyse, comme un
                            brin, un document, un event, etc.
**/
constructor(owner){
  this.a = this.analyse = owner.analyse || current_analyse
  this.owner = owner
}

/**
  Retourne le temps de présence de l'élément, en fonction des scènes dans
  lesquelles il se trouve, ou en fonction de sa durée si elle est définie.
  Note : recalculé chaque fois, donc ne pas abuser
**/
tempsPresence(){
  return this.otimePresence.horloge_as_duree
}

pourcentagePresence(){
  return asPourcentage(this.a.duree, this.otimePresence.seconds)
}

get otimePresence(){
  return new OTime(this.owner.duree || this.owner.duree || this.calcDuree())
}

/**
  On calcule le temps de présence en fonction des scènes de l'élément
**/
calcDuree(){
  if(undefined !== this.owner.scene){
    return this.owner.scene.duree
  } else if (undefined !== this.owner.scenes){
    var duree = 0
    let listeScenes
    if(Array.isArray(this.owner.scenes)) listeScenes = this.owner.scenes
    else listeScenes = Object.values(this.owner.scenes)

    let firstscene = listeScenes[0]

    if(firstscene){
      if(Array.isArray(firstscene) && firstscene.length == 2){
        // => La scène est définie comme pour les décors, avec en première
        // valeur le numéro (oui, sûr, pas l'id) et en deuxième valeur le nombre
        // d'utilisation. Dans ce cas-là, il faut changer la liste de scènes
        listeScenes = listeScenes.map(duo => FAEscene.getByNumero(duo[0]))
      }
    }

    for(var scene of listeScenes){
      scene instanceof(FAEscene) || raise("Les scènes doivent être des instances de FAEscene…")
      if(scene && 'number' === typeof(scene.duree)){
        duree += scene.duree
      } else {
        // Une erreur qui ne devrait pas arriver
        let err_msg = `Dans FAStats#calcDuree, scene est null ou scene.duree n'est pas un nombre.`
        log.error(err_msg)
        console.error(err_msg)
        F.notify('ERREUR DANS calcDuree. Consulter le log.')
      }
    }
    return duree
  } else {
    let msg_err = `Impossible de trouver la durée d'un élément de type "${this.owner.type || this.owner.constructor.name}". Il devrait posséder au moins une propriété 'scene' (renvoyant l'instance FAEscene) ou 'scenes' (renvoyant la liste Array des instances FAEscene).`
    log.error(msg_err/*, backtrace wanted */)
    F.error(msg_err)
    return 0
  }
}

personnagesCount(){
  return `${this.personnages.length}`
}

personnagesList(){
  return this.personnages.map(perso => `<span class="${perso.domC('pseudghi o')}">${perso.pseudo}</span>${perso.editLink()}`).join(', ') +'.'
}

get personnages(){
  if(undefined === this._personnages){
    // console.log("-> FAStats.personnages")

    this._personnages = []

    // On commence à chercher dans les associations
    let persos = this.owner.personnages
    persos = Array.isArray(persos) ? persos : Object.values(persos)
    // console.log('persos:', persos)
    if(persos.length > 0){
      let firstperso = persos[0]
      if(!(firstperso instanceof(FAPersonnage))){
        if('string' == typeof(firstperso)){
          // <= C'est l'identifiant
          // => On transforme toute la liste
          persos = persos.map(perso_id => FAPersonnage.get(perso_id))
        }
      }
      this._personnages.push(...persos)
    }

    // Ensuite, on cherche dans les propriétés textuelles. Si la description,
    // par exemple, compte un personnage, on le prend.
    if(this.owner.constructor.TEXT_PROPERTIES){
      this.owner.constructor.TEXT_PROPERTIES.map( tprop => {
        var res = FAPersonnage.getPersonnagesIn(this.owner[tprop])
        res && this._personnages.push(...res)
      })
    }

    // console.log("this._personnages:", this._personnages)
    // console.log("<- FAStats.personnages")
  }
  return this._personnages
}

} // /class FAStats
