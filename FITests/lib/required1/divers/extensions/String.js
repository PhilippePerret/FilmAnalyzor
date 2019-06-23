'use strict'
/**
  Extension de la classe String
**/
Object.assign(String,{
  /**
    Retourne +nombre+ mots aléatoire simple, c'est-à-dire sans accents,
    et autres diacritiques
  **/
  someSimpleWords(nombre){
    var a = []
    while( nombre -- ) { a.push(this.simpleWords[Math.rand(this.nombreSimpleWords)])}
    return a
  }
})

// const REG_SIGNS = new RegExp("[\.\?\!\;\:\-\–\—\*\•\# \t \(\)\{\}\[\]]",'g')
const REG_SIGNS = /[\.\?\!\;\:\-\–\—\*\•\# \t \(\)\{\}\[\]]/g
Object.assign(String,{
  ressemblance(a,b){
    const al = a.length
        , bl = b.length
        , co = (al + bl) / 2
        , cl = this.smartLevenshtein(a,b)
    return Math.round((cl / co).round(2) * 100)
  }
, smartLevenshtein(a, b){
    if ( a === b ) return 0
    if ( a.toLowerCase() === b.toLowerCase() ) return 0.5
    var ar = a.replace(REG_SIGNS,'')
    var br = b.replace(REG_SIGNS,'')
    if ( ar === br ) return 1
    if ( ar.toLowerCase() === br.toLowerCase() ) return 1.5
    return this.levenshtein(a,b)
  }
, levenshtein(a, b) {
    const al = a.length
    const bl = b.length

    if(al === 0) return bl
    if(bl === 0) return al

    var matrix = []

    // increment along the first column of each row
    var i;
    for(i = 0; i <= bl; i++){ matrix[i] = [i] }

    // increment each column in the first row
    var j;
    for(j = 0; j <= al; j++){
      matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for(i = 1; i <= bl; i++){
      for(j = 1; j <= al; j++){
        if(b.charAt(i-1) == a.charAt(j-1)){
          matrix[i][j] = matrix[i-1][j-1];
        } else {
          matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                                  Math.min(matrix[i][j-1] + 1, // insertion
                                           matrix[i-1][j] + 1)); // deletion
        }
      }
    }

    return matrix[bl][al];
  }
})
Object.defineProperties(String,{

  simpleWords:{get(){
    return [
      'evolution','terre','bicyclette','rouge','brin','autonomie','enfant',
      'roue','voyage','roulette','sac','maison','loup','lion','amour','serein',
      'soir','balle','bal','boule','voiture','saucisson','table','chaise',
      'assiette','couteau','lame','mer','sacade','soumis','auto','moteur','bleu',
      'blague','bourreau','berne','drapeau','sourire','vert','vertu','verdure'
    ]
  }}
, nombreSimpleWords:{get(){
    if (undefined === this._nbsimplewords) this._nbsimplewords = this.simpleWords.length
    return this._nbsimplewords
  }}
, LoremIpsum:{get(){
    return `
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean bibendum dolor sed mi mattis, eu porttitor purus venenatis. Proin posuere odio non eleifend molestie. Nullam eget est tempus metus sodales tincidunt et ac lectus. Nam lacinia urna sed leo eleifend egestas id ac nisi. Praesent scelerisque risus nec aliquet sollicitudin. Curabitur ut vehicula neque. Nullam sem sapien, ullamcorper sit amet ex vitae, vehicula semper nisl. Vivamus id orci tempor, accumsan enim quis, efficitur nulla. Pellentesque diam libero, pretium sit amet eros eu, pellentesque vulputate quam.

    Mauris gravida aliquet erat vel commodo. Curabitur id bibendum mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc lacus purus, vulputate non eros a, viverra accumsan nisi. Aenean sit amet mi in ligula ullamcorper facilisis. In fermentum efficitur molestie. Aliquam porta pharetra diam, nec lacinia nunc interdum a. Etiam consectetur, turpis sed congue viverra, arcu nulla vestibulum libero, eget aliquet turpis ex et nibh. Sed vitae velit et risus commodo cursus.

    Mauris eros leo, luctus sed luctus dignissim, rhoncus vitae nisi. Nulla massa ex, semper ac augue ut, pharetra consectetur dolor. In sagittis felis id velit mollis ornare. Duis aliquam tempor feugiat. Phasellus sit amet diam neque. Mauris fermentum efficitur risus, quis vehicula augue vulputate pellentesque. Maecenas urna erat, fringilla sagittis lobortis at, congue vel dolor. Donec purus ipsum, sollicitudin eu dolor et, mollis faucibus libero. Morbi eget dolor odio.

    Nulla sit amet gravida lectus. Integer malesuada condimentum lectus ut dignissim. Etiam sagittis sodales mi vitae accumsan. Nam libero urna, vestibulum sed tortor eu, venenatis finibus quam. Ut id lorem laoreet, porta justo at, cursus diam. In condimentum fringilla ante ac ullamcorper. Suspendisse sit amet dui libero. Vestibulum nec felis rhoncus, faucibus tellus id, ornare risus. Nullam in nibh at augue elementum cursus vitae ut nisi. Praesent quis elit porta, aliquet libero eget, aliquam orci. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin condimentum pulvinar quam, pulvinar lobortis nisl tincidunt vel. Morbi vitae est vel sapien varius ornare vitae sit amet dui. Integer volutpat diam quis velit porttitor, ac sollicitudin mi blandit. Duis turpis est, condimentum eget felis nec, iaculis aliquet quam. Quisque et ante at dolor dictum imperdiet.

    Phasellus sit amet lorem in purus viverra ultricies. Cras mollis faucibus urna, sed faucibus massa maximus in. Phasellus auctor sapien arcu, nec finibus quam pretium id. Nulla quis nibh sit amet tortor sodales blandit. Aenean et nunc velit. Nam purus erat, gravida et quam sed, molestie semper diam. Cras blandit efficitur velit vitae convallis. Suspendisse sit amet tempor nisi, vel tempus justo.

    Suspendisse porta eros ac malesuada sagittis. Cras mattis ipsum aliquet consectetur consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vitae neque semper, posuere neque nec, finibus tortor. Curabitur fermentum tincidunt nulla vel tempus. In non purus eleifend, congue lorem ut, egestas odio. Nullam in pulvinar dolor, quis sagittis nunc. Quisque pretium felis sit amet lorem dapibus suscipit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Quisque commodo lobortis ligula pharetra ornare. Cras malesuada enim molestie pellentesque eleifend.
    `
  }}
})
