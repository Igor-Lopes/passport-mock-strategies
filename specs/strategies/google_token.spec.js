var Strategy = require("../../lib/").GoogleTokenStrategy;
var expect = require("chai").expect;
var passport = require("passport");

describe("Google Token Strategy", function() {
  it("inherits from passport", function() {
    expect(Strategy.super_).to.eql(passport.Strategy);
  });

  it("has a default name", function() {
    var strategy = Object.create(new Strategy({}, function() {}));
    expect(strategy.name).to.eql("mock-google-token");
  });

  it("name can be set", function() {
    var strategy = Object.create(new Strategy({ name: "test" }, function() {}));
    expect(strategy.name).to.eql("test");
  });

  it("requires a verify function to be passed in", function() {
    expect(function() {
      new Strategy({ callbackURL: "/cb" });
    }).to.throw(Error);
  });

  it("passReqToCallback defaults to false", function() {
    var strategy = Object.create(new Strategy({}, function() {}));
    expect(strategy._passReqToCallback).to.be.false;
  });

  it("passReqToCallback can be set to true", function() {
    var strategy = Object.create(
      new Strategy({ passReqToCallback: true }, function() {})
    );
    expect(strategy._passReqToCallback).to.be.true;
  });
});

describe("Google Token Authenticate", function() {
  var req;

  var strategy;

  it("handles a verify method that asks for the request, parsedToken, googleId", function(done) {
    strategy = new Strategy(
      {
        passReqToCallback: true,
        passAuthentication: true
      },
      function(request, parsedToken, googleId, cb) {
        cb(null, {
          request: request,
          parsedToken: parsedToken,
          googleId: googleId
        });
      }
    );

    strategy._parsedToken = {
      payload: {
        name: "John Doe",
        email: "john.doe@email.com",
        picture: "https://via.placeholder.com/350x150"
      }
    };

    strategy._googleId = "abc";

    strategy = Object.create(strategy);

    strategy.success = function(data) {
      expect(data.parsedToken).to.eql({
        payload: {
          name: "John Doe",
          email: "john.doe@email.com",
          picture: "https://via.placeholder.com/350x150"
        }
      });
      expect(data.googleId).to.eql("abc");
      expect(data.request).to.eql(req);
      done();
    };

    strategy.authenticate(req, {});
  });
});
