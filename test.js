'use strict'
const irc = require('./lib/main.js')

let clientTest = new irc.Client('testing', '127.0.0.1', {
    user: 'testing',
    pass: 'testing',
    real: 'testing',
    // ssl: true,
    // port: 50000
})
clientTest.on('raw', data => {
    // console.log(data)
})
clientTest.on('error', data => {
    console.log('<error>')
    console.log(data)
    console.log('</error>')
})
// clientTest.on('notice', data => {
//     console.log('<notice>')
//     console.log(data)
//     console.log('</notice>')
// })
// clientTest.on('privmsg', data => {
//     console.log('<privmsg>')
//     console.log(data)
//     console.log('</privmsg>')
// })
// clientTest.on('action', data => {
//     console.log('<action>')
//     console.log(data)
//     console.log('</action>')
// })
// clientTest.on('reply', data => {
//     console.log('<reply>')
//     console.log(data)
//     console.log('</reply>')
// })
// clientTest.on('ctcp', data => {
//     console.log('<ctcp>')
//     console.log(data)
//     console.log('</ctcp>')
// })
// clientTest.on('join', data => {
//     console.log('<join>')
//     console.log(data)
//     console.log('</join>')
// })
// clientTest.on('part', data => {
//     console.log('<part>')
//     console.log(data)
//     console.log('</part>')
// })
// account
// invite
// quit
// mode
// kick
// topic
// nick
