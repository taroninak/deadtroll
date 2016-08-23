var Promise = require('bluebird');
var request = Promise.promisifyAll(require('request'));

var User = (function () {
    function User () {

    }

    User.prototype.info = function (token, id) {
        return request.getAsync('https://slack.com/api/users.info?token=' + token + '&user=' + id)
        .then(function (res) {
            res = JSON.parse(res.body);
            if (!res.ok) throw new Error('Bad request');
            return res.user;
        });
    };

    return User;
})();

var Auth = (function () {
    function Auth() {

    }

    Auth.prototype.test = function (token) {
        return request.getAsync('https://slack.com/api/auth.test?token=' + token)
        .then(function (res) {
            res = JSON.parse(res.body);
            if (!res.ok) throw new Error('Bad request');
            return res;
        });
    };

    Auth.prototype.revoke = function (token, test) {
        return request.getAsync('https://slack.com/api/auth.revoke?token=' + token + '&test=' + test ? true : false)
        .then(function (res) {
            res = JSON.parse(res.body);
            if (!res.ok) throw new Error('Bad request');
            return res;
        });
    };

    return Auth;
})();

var Rtm = (function () {
    function Rtm () {

    }

    Rtm.prototype.start = function (token) {
        return request.getAsync('https://slack.com/api/rtm.start?token=' + token)
        .then(function (res) {
            res = JSON.parse(res.body);
            if (!res.ok) throw new Error('Bad request');
            return res;
        });
    };

    return Rtm;
})();

var user = new User();
user.User = User;

var auth = new Auth();
auth.Auth = Auth;

var rtm = new Rtm();
rtm.Rtm = Rtm;

module.exports = {
    user: user,
    auth: auth,
    rtm: rtm
};
