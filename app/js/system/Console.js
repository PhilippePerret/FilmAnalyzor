'use strict'

const INDENT = '    '
const RC     = `
`
const STYLE1     = 'font-weight:bold;font-size:1.2em;' // Titre principal/fin
const STYLE2     = 'margin-top:2em;border:1px solid black;padding:2px 4px;font-size:1.21em;font-weight:bold;' // Tests
const PATHSTYLE  = 'font-size:0.85;color:grey;font-style:italic;margin-left:400px;'//path
const STYLE3     = 'font-size:1.1em;font-weight:bold;' // Case
const REDBOLD    = 'font-weight:bold;color:red;'
const BLUEBOLD   = 'color:blue;font-weight:bold;'
const GREENBOLD  = 'color:darkgreen;font-weight:bold;'

global.Console = class {
static maintitle(msg){this.w(msg,STYLE1)}
static framedTitle(msg){this.w(msg,STYLE2)}
static subtitle(msg){this.w(msg,STYLE3)}
static redbold(msg){this.w(msg,REDBOLD)}
static bluebold(msg){this.w(msg,BLUEBOLD)}
static path(msg){this.w(msg,PATHSTYLE)}
static success(msg){this.w(`${INDENT}${msg}`, 'color:#00AA00;')}
static failure(msg){this.w(`${INDENT}${msg}`, 'color:red;')}

static w(msg, style){
  console.log(`%c${msg}`,style)
}

}
