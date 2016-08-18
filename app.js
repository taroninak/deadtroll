var Promise = require('bluebird');
var WebSocket = require('ws');
var request = Promise.promisifyAll(require('request'));
var token = process.env.TOKEN;
request.getAsync('https://slack.com/api/rtm.start?token=' + token).then(function (res) {
    res = JSON.parse(res.body);
    listen(res.url);
}).catch(function (err) {
    console.log(err);
});

function listen(url) {
    var ws = new WebSocket(url);

    ws.on('open', function open() {
        console.log('Connection established!');
    });

    ws.on('close', function close() {
        console.log('Connection closed!');
    });

    ws.on('message', function message(data, flags) {
        console.log('>' + data);
        data = JSON.parse(data);
        if(data.type == 'message') {
            getUsername(data.user).then(function (name) {
                var packet = {
                    type: 'message',
                    channel: data.channel,
                    text: '@' + name + ' says: ' + data.text
                };
                ws.send(JSON.stringify(packet));
            });
        }
    });
}

function getUsername(id) {
    return request.getAsync('https://slack.com/api/users.info?token=' + token + '&user=' + id).then(function (res) {
        res = JSON.parse(res.body);
        return res.user.name;
    }).catch(function(err) {
        return id;
    });
}
