'use strict'
const irc = require('./lib/main.js')

let clientTest = new irc.Client('Name', '127.0.0.1')
clientTest.write()
