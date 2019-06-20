'use strict'

const INDENT = '    '
const RC     = `
`
const STYLE1     = 'font-weight:bold;font-size:1.2em;' // Titre principal/fin
// const STYLE2     = 'margin-top:2em;border:1px solid black;padding:2px 4px;font-size:1.21em;font-weight:bold;' // Tests
const STYLE2     = 'margin-top:2em;border:1px solid white;padding:2px 4px;font-size:1.21em;font-weight:bold;' // Tests
const PATHSTYLE  = 'font-size:0.85;color:grey;font-style:italic;margin-left:400px;'//path
const STYLE3     = 'font-size:1.1em;font-weight:bold;' // Case
const REDBOLD    = 'font-weight:bold;color:red;'
const BLUEBOLD   = 'color:blue;font-weight:bold;'
const SMALLBLUE  = 'font-size:0.85em;color:#9999FF;'
const GREENBOLD  = 'color:darkgreen;font-weight:bold;'
const ORANGEBOLD = 'color:orange;font-weight:bold;'

global.Console = class {
static space(nombre_lignes){
  var sp = ''
  while(nombre_lignes--) sp += RC
  console.log(sp)
}
static clear(){console.clear()}
static mainTitle(msg,opts){this.w(msg,opts,STYLE1)}
static framedTitle(msg,opts){this.w(msg,opts,STYLE2)}
static subtitle(msg,opts){this.w(msg,opts,STYLE3)}
static redbold(msg,opts){this.w(msg,opts,REDBOLD)}
static bluebold(msg,opts){this.w(msg,opts,BLUEBOLD)}
static smallblue(msg,opts){this.w(msg,opts,SMALLBLUE)}
static greenbold(msg,opts){this.w(msg,opts,GREENBOLD)}
static orangebold(msg,opts){this.w(msg,opts,ORANGEBOLD)}
static action(msg,opts){this.greenbold(`${INDENT}${msg}`,opts)}
static path(msg,opts){this.w(msg,opts,PATHSTYLE)}
static error(msg,opts){this.w(msg,opts,REDBOLD)}
static success(msg,opts){this.w(`${INDENT}${msg}`,opts, 'color:#00AA00;')}
static failure(msg,opts){this.w(`${INDENT}${msg}`,opts, 'color:red;')}
static indent(msg,opts){this.w(`${INDENT}${msg}`,opts)}

static w(msg, opts, style){
  opts = opts || {}
  if ( opts.time ) {
    let d = new Date()
    msg = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}.${d.getMilliseconds()} ${msg}`
  }
  if ( opts.indent ) {
    var indent
    if ('number'==typeof(opts.indent)){
      indent = ""
      while ( opts.indent -- > 0 ) indent += "\t"
    } else {
      indent = opts.indent
    }
    msg = indent + msg.split(RC).join(RC+indent)
  }
  console.log(`%c${msg}`,style)
}

}
