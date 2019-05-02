'use strict'

Object.assign(HandTestStep.prototype,{
  /**
    @return {Boolean} true si c'est une étape de check, une vérification
                      à faire en cours de route ou à la fin.
  **/
  isCheck(){
    let ok = 'object' === typeof(this.command) && Object.keys(this.command)[0] == 'check'
    if(ok === false) return false
    // Avant, on pouvait donner une liste de checks, maintenant on ne peut plus
    if(Array.isArray(this.command['check'])) throw("Il faut un seul check par ligne 'check:'")
    return true
  }
  /**
    Exécute le check

    @return {Boolean} True si c'est un succès, False otherwise.
  **/
, execTheCheck(){
    var cmd = this.command['check']
      , cmd_init = "" + this.command['check']
      , pas
      , res

    // console.log("Exécution du check : ", cmd)

    // Est-ce que la commande est une étape automatique ?
    pas = DATA_AUTOMATIC_STEPS[cmd]
    if (pas){
      // Une step automatique
      try {
        res = eval(pas.exec)
        if(pas.expected != '---nothing---'){
          res === pas.expected || raise(pas.error.replace(/\%\{res\}/g, res))
          return pas.NaT ? 2 : 1
        }
      } catch (e) {
        console.error(e); F.error(e) ; return 0 // on s'arrête là
      }
    } else if (res = this.isElementNumerisable(cmd)) {
      // Un objet numérisable => un check numérique (il y a x trucs)
      if(res.ok === true){
        return 1
      } else if (res.error === null){
        // Il faut continuer pour voir
      } else {
        // Une erreur
        return 0
      }
    }

    // Il faut analyser la phrase de check, qui peut être sous la forme :
    //  {{event:12}} existe
    //  {{event:24}} apparait dans le READER
    //  etc.

    // On commence par supprimer les petits mots inutiles
    cmd = cmd.replace(/(^| )(le|la|de|des|un)( |$)/ig, ' ')
    for(var reg in HandTestStep.TABLE_SUBSTITUTIONS){
      cmd = cmd.replace(new RegExp(reg, 'gi'), HandTestStep.TABLE_SUBSTITUTIONS[reg])
    }
    // console.log("Commande : ", cmd)
    cmd = cmd.replace(/  +/,' ').trim()
    // console.log("Commande : ", cmd)

    // la valeur retournée peut être triple :
    //  true    Le test est un succès, on passe à la suite
    //  false   Le test est un échec (ou problème), on passe à la suite
    //  null    Le test est manuel, on attend la réponse de l'utilisateur
    return this.analyseAndCheck(cmd)

  }
/**
  Grande méthode qui analyse la phrase de check +check+ et l'exécute
  si c'est une phrase de check automatique. Dans le cas contraire, elle la
  renvoie telle quelle pour exécution manuelle.
**/
, analyseAndCheck(check){
    let sujet, sujet_id, verbe, expected
    check = check.replace(/^\{\{([a-zA-Z_]+):(.*?)\}\}/,function(tout, suj, suj_id){
      sujet = suj
      sujet_id = suj_id
      return ''
    })
    // On prend le sujet
    let isujet = this.getSujet(sujet, sujet_id)
    if(false === isujet){
      // c'est peut-être simplement un check manuel (mais ça peut être aussi
      // une erreur de test)
      return null
    }
    else if (undefined === isujet){
      err_msg = `Impossible de trouver le sujet de type "${sujet}" et d'identifiant ${sujet_id}…`
      console.error(err_msg)
      F.error(err_msg)
      return 0
    }

    check = check.replace(/ ([a-zA-Z_\-]+) /, function(tout, verb){
      verbe = verb.toUpperCase()
      return ''
    })
    console.log({
      sujet: sujet, sujet_id:sujet_id, cmd: check,
      verbe: verbe
    })

    check = check.trim()

    check = check.replace(/^\{\{([a-zA-Z_\-]+):([^\}]+)\}\}/, function(tout, prop, val){
      expected = [prop, val]
      return ''
    })
    if(undefined === expected) expected = check
    console.log({
      check:check, expected: expected
    })

    // La suite dépend du verbe
    switch (verbe) {
      case 'HAS':
      case 'IS':
        // La suite est la valeur attendue, sous forme [prop, value] ou value
        break
      case 'IN':
        // expected contient le lieu où on doit trouver le sujet
        switch (expected) {
          case 'READER':

            break
          default:
            console.error(`Impossible de traiter le lieu "${expected}". Je dois renoncer.`)
            return 0
        }
        break
      default:
        console.error(`Impossible de traiter le verbe "${verbe}". Je dois renoncer.`)
        return 0
    }
    // Si tout s'est bien passé, on retourne true
    return 1
  }
  /**
    @param {String} suj   Le type du sujet, p.e. 'event' ou 'document'
    @param {String} suj_id    L'identifiant. Pourra être transformé en nombre en
                              fonction du type du sujet

    @return {Instance} Instance de l'objet dont il est question.
  **/

, getSujet(suj, suj_id){
    let delement = HandTests.AppElements[suj]
    if (undefined === delement){
      log.info(`"${suj}" n'est pas un sujet.`)
      return false
    } else {
      return (delement.getMethod)(suj_id)
    }
  }
/**
  Méthode pour savoir si l'élément est un élément numérisable, donc un
  élément en nombre de l'application. Pour une bibliothèque, ce serait
  les livres et les auteurs, par exemple.

  @param {String} cmd   Quelque chose comme "x trucs" où "truc" est un
                        élément défini de l'application. Ou Rien.
  @return {Object} Une table contenant {:ok, :error}
**/
, isElementNumerisable(cmd){
    var res, countEl
    if(res = cmd.match(this.regexpElementsNumerisable())){
      // La commande concerne un élément numérisable, on le teste
      let [tout, nombre, element] = res
      nombre = parseInt(nombre,10)
      if ((countEl = this.getCount(element)) === nombre){
        return {ok: true}
      } else {
        return {ok: false, error: `Nombre de "${element}s" attendus : ${nombre}. Trouvés : ${countEl}`}
      }
    } else {
      return {ok: false, error: null}
    }
  }
, regexpElementsNumerisable(){
    if (undefined==this._regexpElNum){
      this._regexpElNum = new RegExp(`([0-9]+) (${Object.keys(HandTests.AppElements).join('|')})s`)
    }
    return this._regexpElNum
  }
})

HandTestStep.TABLE_SUBSTITUTIONS = {
  '(^| )(apparait dans|est dans|est sur|est affiché sur)( |$)': '$1IN$3'
, '(^| )(possède|est|a)( |$)': '$1IS$3'
}
