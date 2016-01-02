'use strict'
const parseNumeric = require('./parseNumeric')

/**
 * receiveMessage(message)
 *
 * Parses a raw IRC message from the IRC server
 * @param {String} message - The raw line from an IRC server
 * @return {Object} result - The parsed result
 * @return {Object} result.tags - IRCv3 tags
 */
module.exports = function receiveMessage(message) {
  message = message
    .toString()
    .trim()
    .split(' ')

  let result = {}

  // http://ircv3.net/specs/core/message-tags-3.2.html
  if (message[0].startsWith('@')) {
    /**
     * Array of unescaped IRCv3 message tags
     * @type {Array}
     */
    let tags = message
      .shift()
      .substring(1)
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

  console.log('message: ' + message.join(' '))

  if (/^\d{3}$/.test(message[1])) {
    result.replyNum  = message[1]
    result.replyName = parseNumeric(message[1])

    if (message[1] >= 400 && message[1] < 600) {
      result.type = 'error'
    } else {
      result.type = 'reply'
    }
  }

  result.message = message.join(' ')
  return result
}
