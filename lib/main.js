'use strict'
const net = require('net')
const tls = require('tls')
const util = require('util')
const EventEmitter = require('events')

const parseMessage = require('./parseMessage')


const defaultOptions = {
  user: 'Orbit',
  real: 'Orbit',
  pass: null,
  port: 6667,
  ssl: false,
  caps: [
    'account-notify',
    'account-tag',
    'away-notify',
    'cap-notify',
    'server-time'
  ]
}

// TODO: get ___ methods? query user data if unknown

/** A connection to a single IRC server */
class Client {
  /**
   * @param {string} nick - Nickname used when connecting to the server
   * @param {string} address - IRC server address to connect to
   * @param {Object} [options] - Object of options, key value pairs
   */
  constructor(nick, address, options) {
    this.options = Object.assign({}, defaultOptions, options)
    this.options.nick = nick
    this.options.address = address

    this.connect()
  }

  // TODO: new net.Socket(), upgrade with TLS?
  //       allows startTLS command perhaps
  connect() {
    if (this.options.ssl) {
      this.socket = tls.connect(this.options.port, this.options.address)
    } else {
      this.socket = net.connect(this.options.port, this.options.address)
    }

    this.sendRaw(`CAP LS 302`)
    if (this.options.pass) this.sendRaw(`PASS ${this.options.pass}`)
    this.sendRaw(`NICK ${this.options.nick}`)
    this.sendRaw(`USER ${this.options.user} 0 * :${this.options.real}`)

    this.socket.on('data', data => {
      let parsed = parseMessage(data)
      if (!parsed) return
      this.emit('raw', data.toString())
      console.log(parsed)

      switch(parsed.type) {
        case 'PING':
          this.sendRaw('PONG :' + parsed.message)
          break
        case 'PONG':
          this.emit('pong')
          break
        case 'CAP':
          let caps = parsed.message.split(' ')
          caps = caps.filter(cap => this.options.caps.indexOf(cap) != -1)
          if ((caps.length > 0) && (parsed.args.indexOf('LS') != -1)) {
            this.sendRaw('CAP REQ :' + caps.join(' '))
          }
          if (parsed.args[parsed.args.length - 1] != '*') {
            this.sendRaw('CAP END')
          }
      }

      if (parsed.type === 'PING') {
        this.sendRaw('PONG ' + parsed.message)
      }
    })
  }

  sendRaw(message) {
    this.socket.write(new Buffer(message + '\r\n'))
  }

  write() {
    this.socket.write(new Buffer('foo\r\n'))
  }
}

util.inherits(Client, EventEmitter)
exports.Client = Client
