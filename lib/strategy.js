/**
 * Author: Michael Weibel <michael.weibel@gmail.com>
 * License: MIT
 */
"use strict";

var passport = require("passport"),
  util = require("util");

function StrategyMock(options, verify) {
  this.options = options;
  this.name = "mock";
  this.passAuthentication = options.passAuthentication || true;
  this.userId = options.userId || 1;
  this.verify = verify;
}

util.inherits(StrategyMock, passport.Strategy);

StrategyMock.prototype.authenticate = function authenticate(req) {
  var _passReqToCallback = this.options.passReqToCallback || false;

  if (this.passAuthentication) {
    var user = {
        id: this.userId
      },
      self = this;
    this.verify(user, function(err, resident) {
      if (err) {
        self.fail(err);
      } else {
        if (_passReqToCallback) {
          self.verify(req, resident);
          //self.success(req, resident);
        }

        /*if (this.options.passReqToCallback) {
          self.success(req, resident);
        } else {
          self.success(resident);
        }
        self.success(resident);*/
      }
    });
  } else {
    this.fail("Unauthorized");
  }
};

module.exports = StrategyMock;
