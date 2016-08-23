var slack = require('../services/slack');

var config = {};

config.port = process.env.PORT || 3000;
config.host = process.env.IP || '0.0.0.0';
config.token = process.env.TOKEN;

module.exports = config;
