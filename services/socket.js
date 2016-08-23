var EventEmitter = require('events').EventEmitter;
var util = require('util');
var WebSocket = require('ws');
var slack = require('./slack');

var Socket = (function () {

    function Socket() {
        EventEmitter.call(this);
    }

    Socket.prototype.connect = function (url) {
        this.ws = new WebSocket(url);

        var self = this;

        this.ws.on('open', function open() {
            console.log('Connection established!');
            self.timeout = setInterval(self.ping, 600000);
        });

        this.ws.on('close', function close() {
            console.log('Connection closed!');
            clearInterval(self.timeout);
            self.connect(self.url);
        });

        this.ws.on('message', function message(packet, flags) {
            console.log('>' + packet);
            packet = JSON.parse(packet);
            self.dispatch(packet);
        });
    };

    Socket.prototype.dispatch = function (packet) {
        switch(packet.type) {
            case 'message' : this.emit('message', packet);
                break;
            case 'reconnect_url': this.url = packet.url;
                break;
            default: return;
        }
    };

    Socket.prototype.send = function (message) {
        if(typeof message == 'string') {
            this.ws.send(message);
        } else {
            this.ws.send(JSON.stringify(message));
        }
    };

    Socket.prototype.ping = function () {
        this.send(JSON.stringify({id: parseInt(new Date().getTime()), type: 'ping'}));
    };

    util.inherits(Socket, EventEmitter);

    return Socket;
})();

module.exports = new Socket();
module.exports.Socket = Socket;
