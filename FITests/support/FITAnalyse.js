'use strict'

const FITAnalyse = {
    analyse: null // analyse courante des tests
    /**
     * Pour mettre l'analyse de dossier +folder+ en analyse courante
     *
     * +options+
     *    :remove_events      Si true, on détruit tous les events
     *    :reader             Si 'display-all-events', on doit demander à
     *                        l'analyse d'afficher tous les events
     */
  , setCurrent:function(folder, options, resolve){
      var my = this
      if(undefined === options){options = {}}
      if(!fs.existsSync(path.join('.','analyses',folder))){
        folder = `tests/${folder}`
      }
      if(!fs.existsSync(path.join('.','analyses',folder))){
        throw("Dossier introuvable:",folder)
      }
      FAnalyse.load(`./analyses/${folder}`)
      // window.current_analyse = new FAnalyse(`./analyses/${folder}`)
      this.analyse = window.current_analyse
      // En fonction des options
      if( options.remove_events ){
        if (folder == 'simple3scenes') throw("Impossible de détruire les events de simple3scenes (on doit les garder absolument)")
        else this.removeEvents(options)
      }

      if (undefined === resolve){
        // <= l'argument resolve n'est pas défini
        // => Il faut retourner une promesse
        return new Promise(ok => {
          my.analyse.methodeAfterLoading = () => {
            if(options.displayAllEvents) this.analyse.reader.displayAll()
            ok()
          }
          this.analyse.load()
        })
      } else {
        // Pour lancer les tests à la fin du chargement
        this.analyse.methodeAfterLoading = resolve
        this.analyse.load()
      }
    }
    /**
      * Méthode sauvant l'analyse courant (this.analyse)
      * @asynchrone
      */
  , save: function(){
      return new Promise(ok => {
        this.analyse.methodAfterSaving = ok
        this.analyse.save()
      })
    }

    /**
      * Destruction des évènements.
      * Noter que maintenant on ne détruit plus le fichier, on le vide
      */
  , removeEvents(){
      fs.writeFileSync(this.analyse.eventsFilePath,'[]','utf8')
      this.analyse._events  = []
      this.analyse.ids      = {}
      EventForm.lastId      = -1
      $('#reader').html('')
      $('.form-edit-event').remove() // toutes
    }

  , loadComponant(comp_name){
      return new Promise((ok,ko)=>{
        System.loadComponant(comp_name, ok)
      })
    }
}

FITAnalyse.load = FITAnalyse.setCurrent
