'use strict'

const electron  = require('electron')
const remote    = electron.remote
const log       = require('electron-log');
const DIALOG    = remote.dialog
const ipc       = electron.ipcRenderer
const path      = require('path')
const fs        = require('fs')
const YAML      = require('js-yaml')
const glob      = require('glob')

const CHILD_PROCESS = require('child_process')
const exec = CHILD_PROCESS.exec


let ScreenWidth, ScreenHeight

log.transports.console.level = 'warn'
