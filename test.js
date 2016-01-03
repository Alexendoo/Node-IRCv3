'use strict'
const irc = require('./lib/main.js')

let clientTest = new irc.Client('testing', '127.0.0.1', {
    user: 'testing',
    pass: 'testing',
    real: 'testing',
    // ssl: true,
    // port: 50000
})
