'use strict'

const STRaction     = 'action'
const STRAIDE       = 'AIDE'
const STRany        = 'any'
const STRassociate  = 'associate'
const STRauto       = 'auto'
const STRBackspace  = 'Backspace'
const STRblur       = 'blur'
const STRbody       = 'body'
const STRbook       = 'book'
const STRbold       = 'bold'
const STRboolean    = 'boolean'
const STRbottom     = 'bottom'
const STRbrin       = 'brin'
const STRbutton     = 'button'
const STRchange     = 'change'
const STRcheckbox   = 'checkbox'
const STRchecked    = 'checked'
const STRchildList  = 'childList'
const STRclick      = 'click'
const STRcontent    = 'content'
const STRcustom     = 'custom'
const STRdata       = 'data'
const STRdata_time  = 'data-time'
const STRdata_type  = 'data-type'
const STRdata_id    = 'data-id'
const STRdblclick   = 'dblclick'
const STRdecor      = 'decor'
const STRDelete     = 'Delete'
const STRdes        = 'des'
const STRdialog     = 'dialog'
const STRdocument   = 'document'
const STRDocument   = 'Document'
const STRduree      = 'duree'
const STRdyna       = 'dyna'
const STREnter      = 'Enter'
const STREnregistrer= 'Enregistrer'
const STRErase      = 'Erase'
const STRerror      = 'error'
const STREscape     = 'Escape'
const STRevent      = 'event'
const STRevents     = 'events'
const STRexploit    = 'exploit'
const STRexploitation = 'exploitation'
const STRfocus      = 'focus'
const STRfooter     = 'footer'
const STRfull       = 'full'
const STRfunction   = 'function'
const STRg          = 'g'
const STRG          = 'G'
const STRgeneric    = 'generic'
const STRheader     = 'header'
const STRheight     = 'height'
const STRhide       = 'hide'
const STRhidden     = 'hidden'
const STRhorloge    = 'horloge'
const STRid         = 'id'
const STRidee       = 'idee'
const STRimage      = 'image'
const STRinfo       = 'info'
const STRj          = 'j'
const STRJ          = 'J'
const STRk          = 'k'
const STRkeydown    = 'keydown'
const STRkeyup      = 'keyup'
const LINK          = 'LINK'
const STRl          = 'l'
const STRla         = 'la'
const STRle         = 'le'
const STRleft       = 'left'
const STRles        = 'les'
const STRm          = 'm'
const STRM          = 'M'
const STRmarker     = 'marker'
const STRmodified   = 'modified'
const STRmousemove  = 'mousemove'
const STRmouseout   = 'mouseout'
const STRmouseover  = 'mouseover'
const STRn          = 'n'
const STRN          = 'N'
const STRname       = 'name'
const STRnext       = 'next'
const STRnumber     = 'number'
const STRnumero     = 'numero'
const STRnote       = 'note'
const STRobject     = 'object'
const STRobjectif   = 'objectif'
const STRobserved   = 'observed'
const STROBSERVED   = 'OBSERVED'
const STRoption     = 'option'
const OK            = 'OK'
const STRpersonnage = 'personnage'
const STRpfa        = 'pfa'
const STRprev       = 'prev'
const STRproc       = 'proc'
const STRqrd        = 'qrd'
const STRquestion   = 'question'
const STRreal       = 'real'
const STRregular    = 'regular'
const STRreponse    = 'reponse'
const STRReturn     = 'Return'
const STRright      = 'right'
const STRs          = 's'
const STRS          = 'S'
const STRstring     = 'string'
const STRselect     = 'select'
const STRsetup      = 'setup'
const STRscene      = 'scene'
const STRshort      = 'short'
const STRshow       = 'show'
const STRsmall      = 'small'
const STRstep       = 'step'
const STRstt        = 'stt'
const STRsystem     = 'system'
const STRTab        = 'Tab' // la touche e.key tabulation
const TABULATION    = 'Tabulation'
const STRtext       = 'text'
const STRtextarea   = 'textarea'
const STRtime       = 'time'
const STRtitle      = 'title'
const STRtitre      = 'titre'
const STRtop        = 'top'
const STRtype       = 'type'
const STRvisible    = 'visible'
const STRvisibility = 'visibility'
const STRundefined  = 'undefined'
const STRun         = 'un'
const STRune        = 'une'
const STRv          = 'v'
const STRwidth      = 'width'
const STRx          = 'x'
const STRz          = 'z'
const STRZ          = 'Z'

const NONE = 'undefined'

const HTML = 'html'

const EBOOK_CONVERT_CMD = '/Applications/calibre.app/Contents/console.app/Contents/MacOS/ebook-convert'

const REG_DATE = new RegExp("(?<jour>[0-9]?[0-9])\\/(?<mois>[0-9]?[0-9])\\/(?<annee>[0-9]{4,4})")

const A       = 'A'
const AIDE    = 'AIDE'
const LI      = 'LI'
const DIV     = 'DIV'
const H2      = 'H2'
const H3      = 'H3'
const H4      = 'H4'
const IMG     = 'IMG'
const SPAN    = 'SPAN'
const FORM    = 'FORM'
const BUTTON  = 'BUTTON'
const INPUT   = 'INPUT'
const SELECT  = 'SELECT'
const SECTION = 'SECTION'
const HORLOGE = 'HORLOGE'
const TEXTAREA= 'TEXTAREA'
const OPTION  = 'OPTION'
const LABEL   = 'LABEL'
const TEXT_TAGNAMES = 'TEXTAREA, INPUT[type="text"], INPUT[type="password"]'

// ---------------------------------------------------------------------

const STRArrowLeft  = 'ArrowLeft'
const STRArrowRight = 'ArrowRight'
const STRArrowUp    = 'ArrowUp'
const STRArrowDown  = 'ArrowDown'

const DELETE    = 'Delete'
const BACKSPACE = 'Backspace'
const ESCAPE    = 'Escape'
const ENTER     = 'Enter'

// ---------------------------------------------------------------------

const ReaderFWindowName = 'Reader'
const BtnsEventFWindowName = 'NewEventsButtons'
