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
  ssl: false
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

    // this.sendRaw(`CAP LS 302`)
    // TODO: AUTH
    if (this.options.pass) this.sendRaw(`PASS ${this.options.pass}`)
    this.sendRaw(`NICK ${this.options.nick}`)
    this.sendRaw(`USER ${this.options.user} 0 * :${this.options.real}`)

    this.socket.on('data', data => {
      let parsed = parseMessage(data)
      if (!parsed) return
      // console.log(parsed)
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

  emit() {
    console.log('moo');
  }
}

util.inherits(Client, EventEmitter)
exports.Client = Client
