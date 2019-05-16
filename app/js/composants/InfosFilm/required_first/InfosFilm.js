'use strict'


class InfosFilm {
get id(){return 'infos'}

get title(){return this.data.title}
get title_fr(){return this.data.title_fr}
get date(){return this._date||defP(this,'_date',this.dateOrNull('date'))}
get realisation(){return this.data.realisation}
get ecriture(){return this.data.ecriture}
get production(){return this.data.production}
get zero(){return this.data.zero}
get first_image(){return this.data.first_image}
get end_time(){return this._end_time||defP(this,'_end_time', this.timeOrNull('end_time'))}
get generic_end_time(){return this._generic_end_time||defP(this,'_generic_end_time', this.timeOrNull('generic_end_time'))}
get date_debut(){return this._date_debut||defP(this,'_date_debut',this.dateOrNull('date_debut'))}
get date_fin(){return this._date_fin||defP(this,'_date_fin',this.dateOrNull('date_fin'))}
get analystes(){return this.data.analystes}
get correcteurs(){return this.data.correcteurs}

get dataExistent(){
  return fs.existsSync(this.infosPath)
}
get data(){
  if(undefined === this._data){
    this._data = YAML.safeLoad(fs.readFileSync(this.infosPath, 'utf8'))
  }
  return this._data
}
get infosPath(){
  return this.a.filePathOf('infos.yaml')
}

get mainTitle(){return 'Infos du film (et analyse)'}
}
