'use strict'
/**
  Usine pour produire des personnages pour les tests
**/
global.FITPersonnage = class {
constructor(analyse, data){
  this.a = this.analyse = analyse
  this.pData = data || {}
}
// Retourne les données à enregistrer dans le fichier
data(){
  return {
      id:           this.id
    , dim:          this.dim
    , pseudo:       this.pseudo
    , prenom:       this.prenom
    , nom:          this.nom
    , dimensions:   this.dimensions
    , ages:         this.ages
    , fonctions:    this.fonctions
    , description:  this.description
    , associates:   this.associates
  }
}

get id(){return this.pData.id || (this.pData.id = this.c.getAId())}
get dim(){return this.pData.dim || (this.pData.dim = this.c.getA('dim'))}
get pseudo(){return this.pData.pseudo || (this.pData.pseudo = this.c.getA('pseudo'))}
get prenom(){return this.pData.prenom || (this.pData.prenom = this.c.getA('prenom'))}
get nom(){return this.pData.nom || (this.pData.nom = this.c.getA('nom'))}
get dimensions(){return this.pData.dimensions || (this.pData.dimensions = this.c.getA('dimensions'))}
get fonctions(){return this.pData.fonctions || (this.pData.fonctions = this.c.getA('fonctions'))}
get ages(){return this.pData.ages || (this.pData.ages = this.c.getA('ages'))}
get description(){return this.pData.description || ( this.pData.description = this.c.getADescription())}
get associates(){return null /* TODO */}

get c(){return this.constructor}
// ---------------------------------------------------------------------
//  CLASSE

// Pour créer un personnage
static create(analyse, data){
  this.a = this.analyse = analyse
  let personnage = new FITPersonnage(analyse, data)
  this.add(personnage) // on l'ajoute dans le fichier de données (ou on le crée)
  return personnage
}

static add(personnage){
  var dataPersos = []
  if ( fs.existsSync(this.a.personnagesFilePath) ) {
    dataPersos = YAML.safeLoad(readFileSync(this.a.personnagesFilePath,'utf8'))
  }
  dataPersos.push(personnage.data())
  fs.writeFileSync(this.a.personnagesFilePath, YAML.dump(dataPersos))
}

// Méthode générique qui appelle toutes les méthodes appropriées
static getA(what){
  return this[`getA${what.titleize()}`]()
}
static getAId(){
  return String.someSimpleWords(2).join('')
}
static getADim(){
  if ( undefined === this.dims || this.dimsLen === 0){
    this.dims = []
    for (var i = 65 ; i < 87 ; ++ i) {
      this.dims.push(String.fromCharCode(i))
      for (var ii = 65 ; ii < 87 ; ++ ii) {
        this.dims.push(`${String.fromCharCode(i)}${String.fromCharCode(ii)}`)
      }
    }
    this.dims = Array.shuffle(this.dims)
    this.dimsLen = this.dims.length
    // console.log("this.dims = ", this.dims)
  }
  -- this.dimsLen
  return this.dims.shift()
}
static getAPseudo(){
  if (undefined === this.unusedPseudos || this.restPseudos === 0){
    this.unusedPseudos = Array.shuffle(this.pseudos)
    this.restPseudos = this.unusedPseudos.length
  }
  -- this.restPseudos
  return this.unusedPseudos.shift()
}
static getANom(){
  if (undefined === this.unusedNoms || this.restNoms === 0){
    this.unusedNoms = Array.shuffle(this.noms)
    this.restNoms = this.unusedNoms.length
  }
  -- this.restNoms
  return this.unusedNoms.shift()
}
static getAPrenom(){
  if (undefined === this.unusedPrenoms || this.restPrenoms === 0){
    this.unusedPrenoms = Array.shuffle(this.prenoms)
    this.restPrenoms = this.unusedPrenoms.length
  }
  -- this.restPrenoms
  return this.unusedPrenoms.shift()
}
static getAFonctions(){
  if (undefined === this.unusedFonctions || this.restFonctions === 0){
    this.unusedFonctions = Array.shuffle(this.fonctions)
    this.restFonctions = this.unusedFonctions.length
  }
  -- this.restFonctions
  return this.unusedFonctions.shift()
}
static getAAges(){
  return 7 + Math.rand(71)
}

static get DIMENSIONS(){return ['Familiale','Professionnelle','Amoureuse','Passionnelle','Loisir']}
static getADimensions(){
  var dims = Array.shuffle(this.DIMENSIONS)
    , dim1 = `${dims[0]} : ${String.LoremIpsum.substring(0,100)}`
    , dim2 = `${dims[1]} : ${String.LoremIpsum.substring(100,200)}`
    , dim3 = `${dims[2]} : ${String.LoremIpsum.substring(0,100)}`
  return `${dim1}\n${dim2}\n${dim3}`
}
static getADescription(){
  let fromCar = Math.rand(2000)
  return String.LoremIpsum.substring(fromCar, fromCar + Math.rand(400))
}

// ---------------------------------------------------------------------
// Les banques de données

static get pseudos(){
  if (undefined === this._pseudos){
    this._pseudos = ['Max','John','Phil','Marion','Ern','Ernest','Tom','Jim','Joe','Jul','Pitt','Helen','Mat','Carole','Sam','Sim','Cher','Will','Cath','Josh','Pearl','Pat','Véro','Sy']
  }
  return this._pseudos
}
static get noms(){
  if(undefined === this._noms){
    this._noms = ['Michel','Larousse','Littré','Royal','Martin','Mauriac','Debussy','Ravel','Mozart','Beethoven','Schumann','Chapel','Champolion','Charme','Chicre','Parnat','Barnot','Rondale','Dombasle','Senec','Verne','Vannier','Vondreuil','Verneuil','Trier','Iñiaritu','Hugo','Lamotte','Jezkova','Travis']
  }
  return this._noms
}
static get prenoms(){
  if(undefined === this._prenoms){
    this._prenoms = ['Maxime', 'Élie', 'Salomé','Marion','Catherine','Philippe', 'Bernard', 'Clothilde','Jacques','Kevin','Frédéric','Nathalie','Géraldinie','Marjorie','Aurélie','Christophe','Stéphane','Stéphanie','Bérangère', 'Hugo','Martin']
  }
  return this._prenoms
}
static get fonctions(){
  if(undefined===this._fonctions){
    this._fonctions = ['Protagoniste','Antagoniste','Adjuvant','Allier','Mentor','Sprechhund','Connaissance','Collègue de bureau','Membre famille lointaine','Patron','Supérieur','Employé','Passion amoureuse','Modèle','Idole']
  }
  return this._fonctions
}
static get tpath(){
  return `./app/js/data/btypes_personnages.yaml`
}

}
