'use strict'
/**
  Module définissant les classes d'erreur

  Pour en ajouter une :
    1. La définir (comme héritage de Error)
    2. L'ajouter à l'export en fin de module
    3. L'ajouter à l'import dans first_requirements.js

**/


class UnknownStepError extends Error {
  constructor(...args){
    super(...args)
    Error.captureStackTrace(this, UnknownStepError) // pour supprimer cette classe du trace
  }

}


module.exports = {
  UnknownStepError: UnknownStepError
}
