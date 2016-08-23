var EventEmitter = require('events').EventEmitter;
var util = require('util');
var socket = require('../services/socket');
var slack = require('../services/slack');
var config = require('../config/main');

var Parrot = (function () {

    function Parrot() {
        EventEmitter.call(this);

        slack.auth.test(config.token).bind(this).then(function(res) {
            this.name = res.user;
            this.id = res.user_id;
        });

    }

    Parrot.prototype.dispatch = function (message) {
        if(message.user == this.id || message.type != 'message') return;
        slack.user.info(config.token, message.user).then(function (user) {
            var packet = {
                id: parseInt(message.ts),
                type: 'message',
                channel: message.channel,
                text: '@' + user.name + ' says: ' + message.text
            };

            socket.send(packet);
        });
    };

    util.inherits(Parrot, EventEmitter);

    return Parrot;
})();

module.exports = new Parrot();
module.exports.Parrot = Parrot;
