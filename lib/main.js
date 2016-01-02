'use strict'
const net = require('net')
const tls = require('tls')

const parseMessage = require('./parseMessage')

/**
 * replace messages inline with open span, doesn't need to close
 * <line> ... <span class="..."> ... </line>
 */

// socket.connect(50000, '127.0.0.1');
//
// socket.write(new Buffer('write\r\n'));
//
// socket.on('data', data => {
//     console.log('DATA: ' + data.toString());
//
// });

const defaultOptions = {
  user: 'Orbit',
  real: 'Orbit',
  port: 6667,
  ssl: false
}

/** A connection to a single IRC server */
class Client {
  /**
   * @param {string} nick - Nickname used when connecting to the server
   * @param {string} address - IRC server address to connect to
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

    this.socket.on('data', data => {
      let parsed = parseMessage(data)
      console.log(parsed)
      if (parsed.type === 'PING') {
        this.replyRaw('PONG ' + parsed.message)
      }
    })
  }

  replyRaw(message) {
    this.socket.write(new Buffer(message + '\r\n'))
  }

  write() {
    this.socket.write(new Buffer('foo\r\n'))
  }
}

exports.Client = Client
