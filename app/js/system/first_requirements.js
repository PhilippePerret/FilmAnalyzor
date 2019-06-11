'use strict'

const MODE_TEST = process.env.MODE_TEST == "true"

// Pour requérir un élément du dossier
function FReqGet(name){
  return require(`./js/system/first_required/${name}.js`)
}

require('./js/system/utils')

FReqGet('Map_extension')

const WindowController = FReqGet('ui/WindowController')
const MessageBox = FReqGet('MessageBox')

// Doit être défini avant FA_associates qui l'utilise
const FADrop = FReqGet('FADrop')

const {
    ASSOCIATES_COMMON_METHODS
  , ASSOCIATES_COMMON_PROPERTIES
  , DATA_ASSOCIATES_DRAGGABLE
  , DATA_ASSOCIATES_DROPPABLE
  , TEXTFIELD_ASSOCIATES_METHS
  , TEXTFIELD_ASSOCIATES_PROPS
} = require('./js/system/first_required/FA_associates.js')

const System = FReqGet('System')
const {DOMHorloge, DOMDuration} = FReqGet('DOMHorloge')
const Hash = FReqGet('Hash')
const Flash = FReqGet('Flash')
const F = Flash
const Selector = FReqGet('Selector')
const IOFile = FReqGet('IOFile')
const OTime = FReqGet('OTime')
const FATime = OTime // pour les associates
const App = FReqGet('App')
const FAListing = FReqGet('FA_Listing')
const Options = FReqGet('Options')
const FAUnknownElement = FReqGet('FAUnknownElement')

const FAElement = FReqGet('FA_Element')
Object.assign(FAElement.prototype, ASSOCIATES_COMMON_METHODS)
Object.defineProperties(FAElement.prototype, ASSOCIATES_COMMON_PROPERTIES)
Object.assign(FAElement.prototype, TEXTFIELD_ASSOCIATES_METHS)
Object.defineProperties(FAElement.prototype, TEXTFIELD_ASSOCIATES_PROPS)

const FWindow = FReqGet('FlyingWindow')
const KWindow = FReqGet('KeysWindows')

// Pour le développement
const Sandbox = FReqGet('Sandbox')

const {
  T
, ERRORS
, MESSAGES
} = FReqGet('messages_et_errors')

const {
  UnknownStepError
} = FReqGet('errors_classes')
