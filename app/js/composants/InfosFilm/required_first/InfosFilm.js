'use strict'

function loadPannelInfosFilmComponants(fn_suite){
  const {
    INFOSFILM_METHS
  , INFOSFILM_PROPS
  } = require(path.join(APPFOLDER,'app/js/tools/building/infos_film.js'))
  Object.assign(InfosFilm.prototype, INFOSFILM_METHS)
  Object.defineProperties(InfosFilm.prototype, INFOSFILM_PROPS)
  // On passe à la suite
  fn_suite()
}

class InfosFilm {
static get current(){
  isDefined(this._current) || (
    this._current = new InfosFilm()
  )
  return this._current
}
// ---------------------------------------------------------------------
//  INSTANCE

/**
  Méthode qui permet d'afficher le panneau des infos du film

  Mais on doit auparavant s'assurer que les extension pour la construction
  de ce panneau sont bien chargées.

**/
toggle(){
  if(isFunction(this.build)) this.fwindow.toggle()
  else loadPannelInfosFilmComponants(this.toggle.bind(this))
}


get id(){return 'infos'}

get title()       {return this.data.film.title}
get title_fr()    {return this.data.film.title_fr}
get date()        {return this.data.film.date}
get realisation() {return this.data.film.realisation}
get ecriture()    {return this.data.film.ecriture}
get production()  {return this.data.film.production}
get musique()     {return this.data.film.musique}
get zero()        {return this.data.video.zero}
get frame1_time() {return this.data.video.frame1_time}
get frame1_description() {return this.data.video.frame1_description}
get date_debut()  {return this.data.analyse.date_debut}
get date_fin()    {return this.data.analyse.date_fin}
get analystes()   {return this.data.analyse.analystes}
get correction()  {return this.data.analyse.correction}

get dataExistent(){ return fs.existsSync(this.path) }

get data(){
  // if(isUndefined(this._data)){
  isDefined(this._data) || isFalse(this.dataExistent) || (
    this._data = YAML.safeLoad(fs.readFileSync(this.path, 'utf8'))
  )
  // console.log("this.data",this._data)
  return this._data
}
get mainTitle(){return 'Infos du film (et analyse)'}

get path(){return this._path || defP(this,'_path', this.a.filePathOf('infos.yaml'))}

get iofile(){return this._iofile||defP(this,'_iofile',new IOFile(this))}
get fwindow(){return this._fwindow||defP(this,'_fwindow', new FWindow(this,{name:'InfosFilm', class:'fwindow-listing-type infos-film', x:10, y:10}))}
get a(){return current_analyse}
}
