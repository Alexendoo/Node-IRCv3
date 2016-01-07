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
  caps: new Set([
    'account-notify',
    'account-tag',
    'away-notify',
    'cap-notify',
    'server-time'
  ])
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

    this.capabilities = new Set()

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
          this.sendRaw('PONG ' + parsed.fullMessage)
          this.emit('ping', parsed)
          break
        case 'PONG':
          this.emit('pong', parsed)
          break
        case 'CAP':
          let caps = parsed.message.split(' ')
          if (parsed.args[0] === 'ACK') {
            this.capabilities.add(caps)
            this.emit('capabilities', caps)
            break
          } else if (parsed.args[0] === 'NAK') {
            this.emit('error', parsed)
            break
          }
          caps = caps.filter(cap => this.options.caps.has(cap))
          if (caps.length && parsed.args[0] === 'LS') {
            this.sendRaw('CAP REQ :' + caps.join(' '))
          }
          if (parsed.args[1] != '*') {
            this.sendRaw('CAP END')
          }
          break
        case 'CTCP':
          if (parsed.ctcp === 'ACTION') {
            this.emit('action', parsed)
          } else {
            this.emit('ctcp', parsed)
          }
          break
        default:
          this.emit(parsed.type.toLowerCase(), parsed)
      }
    })
  }

  /**
   * @param {string} message - Raw IRC message, not including \r\n
   */
  sendRaw(message) {
    this.socket.write(new Buffer(message + '\r\n'))
  }

  /**
   * @param {string} messsage - The message text to send
   * @param {string} target - The target of the message, channel or user
   */
  sendMessage(message, target) {
    this.sendRaw(`PRIVMSG ${target} :${message}`)
  }

  /**
   * Send an ACTION (third person message) e.g * Nickname says hello
   * @param  {string} message - The message (not including your nickname)
   * @param  {string} target - The target of the message, channel or user
   */
  sendAction(message, target) {
    this.sendRaw(`PRIVMSG ${target} :\x01ACTION ${message}\x01`)
  }

  /**
   * Send a CTCP to user, for VERSION or TIME to get the users client version
   * or local TIME
   * @param  {string} ctcp - Type of the CTCP: VERSION, TIME, etc
   * @param  {string} target - The target of the message, channel or user
   */
  sendCTCP(ctcp, target) {
    this.sendRaw(`PRIVMSG ${target} :\x01${ctcp}\x01`)
  }

  /**
   * Reply to a CTCP message, for example with your client version number/name
   * when recieving a CTCP VERSION
   * @param  {string} ctcp - The type of CTCP to reply to
   * @param  {string} reply - The string to provide as a reply
   * @param  {string} target - The target of the reply
   */
  sendCTCPReply(ctcp, reply, target) {
    this.sendRaw(`NOTICE ${target} :\x01${ctcp} ${reply}\x01`)
  }

  /**
   * Ask the server to join a channel, note this doesn't garuntee you will be
   * able to enter the channel, so wait for the response from the server
   * @param  {string} channel - The name of the channel to ask to join
   */
  join(channel) {
    this.sendRaw(`JOIN ${channel}`)
  }

  /**
   * Leave a channel
   * @param  {string} channel - The channel name to Leave
   * @param  {string} [message] - An optional message to display to others
   */
  part(channel, message) {
    if (message) {
      this.sendRaw(`PART ${channel} :${message}`)
    } else {
      this.sendRaw(`PART ${channel}`)
    }
  }
}

util.inherits(Client, EventEmitter)
exports.Client = Client
