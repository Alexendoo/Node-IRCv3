'use strict'
/**
 * @typedef Result
 * @type Object
 * @property {Object} tags - IRCv3 message tags
 */

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
  result.message = message
  return result
}
