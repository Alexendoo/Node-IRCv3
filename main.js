'use strict';
const net = require('net')
const tls = require('tls')
const socket = new net.Socket()

/**
 * replace messages inline with open span, doesn't need to close
 * <line> ... <span class="..."> ... </line>
 */

socket.connect(50000, '127.0.0.1');

socket.write(new Buffer('write\r\n'));

socket.on('data', data => {
    console.log('DATA: ' + data.toString());

});
