// Load modules.
var Strategy = require("./strategies/oauth2");

var GoogleTokenStrategy = require("./strategies/google_token");

module.exports.Strategy = Strategy;

module.exports.GoogleTokenStrategy = GoogleTokenStrategy;
