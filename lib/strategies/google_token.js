"use strict";

var passport = require("passport"),
  util = require("util"),
  Strategy = require("passport-strategy");

function StrategyMock(options, verify) {
  this.name = options.name || "mock-google-token";
  this._passAuthentication = options.passAuthentication || false;
  this._passReqToCallback = options.passReqToCallback || false;
  this.verify = verify;

  Strategy.call(this);
}

util.inherits(StrategyMock, Strategy);

StrategyMock.prototype._verifyUser = function(user, done) {
  done(null, {
    id: 1
  });
};

StrategyMock.prototype.authenticate = function authenticate(req, options) {
  var self = this;

  var _parsedToken = self._parsedToken || "abcd";
  var _googleId = self._googleId || "efgh";

  var _user = {
    id: 1
  };

  function verified(err, user, info) {
    if (err) return self.error(err);
    if (!user) return self.fail(info);
    self.success(user, info);
  }

  if (self._passAuthentication) {
    self._verifyUser(_user, function(err, user, info) {
      if (self._passReqToCallback) {
        self.verify(req, _parsedToken, _googleId, verified);
      } else {
        self.verify(_parsedToken, _googleId, verified);
      }
    });
  } else {
    self.fail("Unauthorized");
  }
};

module.exports = StrategyMock;
