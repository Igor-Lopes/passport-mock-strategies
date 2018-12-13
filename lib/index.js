// Load modules.
var OAuth2Strategy = require("./strategies/oauth2");

var GoogleTokenStrategy = require("./strategies/google_token");

module.exports.OAuth2Strategy = OAuth2Strategy;

module.exports.GoogleTokenStrategy = GoogleTokenStrategy;
