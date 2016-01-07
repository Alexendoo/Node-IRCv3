'use strict'
const numerics = require('./numerics')

/**
 * receiveMessage(message)
 *
 * Parses a raw IRC message from the IRC server
 * @param {String} message - The raw line from an IRC server
 * @return {?Object} result - The parsed result or null if message is empty
 * @return {Object} result.tags - IRCv3 tags
 */
module.exports = function receiveMessage(message) {
  message = message.toString().trim()
  // Return null for empty messages, ignoring tags + whitespace
  if (message.match(/^(?:@[^ ]+)?\s*$/)) {
    return null
  }

  message = message.split(' ')
  let result = {}

  // http://ircv3.net/specs/core/message-tags-3.2.html
  if (message[0].startsWith('@')) {
    /**
     * Array of unescaped IRCv3 message tags
     * @type {Array}
     */
    let tags = message
      .shift()
      .substr(1)
      .split(';')
      .map(tag => tag
        .replace(/\\:/g, ';')
        .replace(/\\s/g, ' ')
        .replace(/\\\\/g, '\\')
        .replace(/\\r/g, '\r')
        .replace(/\\n/g, '\n')
      )

    result.tags = tags.reduce((acc, tag) => {
        if (tag.includes('=')) {
          tag = tag.split('=')
          acc[tag[0]] = tag[1]
        } else {
          acc[tag] = true
        }
        return acc
    }, {})
  }

  console.log(message);
  if (message[0].startsWith(':')) {
    result.from = message.shift()
    if (message[0].match(/^\d{3}$/)) {
      result.replyNum = message.shift()
      result.replyName = numerics[message[0]]
      if (result.replyName) {
        result.type = result.replyName.startsWith('ERR') ? 'error' : 'reply'
      } else {
        // If a name isn't known, assume anything in 400-599 region is an error,
        // which is reasonably universally true aside from a few outliers
        result.type = result.replyNum.match(/^[45]/) ? 'error' : 'reply'
      }
    } else {
      result.type = message.shift()
    }
  } else {
    result.type = message.shift()
  }

  if (!message.length) return result

  if (!message[0].startsWith(':')) {
    result.to = message.shift()
    if (!message.length) return result
  }
  message = message.join(' ')

  result.fullMessage = message
  result.args = message.match(/:.*|[^ ]+/g)
  if (result.args && result.args[result.args.length - 1].startsWith(':')) {
    result.message = result.args.pop().substr(1)
    // CTCP (message surrounded by ASCII 0x01)
    if (result.message.match(/^\x01.*\x01$/)) {
      result.message = result.message
        .substring(1, result.message.length - 1)
        .split(' ')
      result.type = 'CTCP'
      result.ctcp = result.message.shift()
      result.message = result.message.join(' ')
    }
  }
  return result
}
