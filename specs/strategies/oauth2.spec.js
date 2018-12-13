var Strategy = require("../../lib").OAuth2Strategy;
var expect = require("chai").expect;
var passport = require("passport");

describe("OAuth2 Strategy", function() {
  it("inherits from passport", function() {
    expect(Strategy.super_).to.eql(passport.Strategy);
  });

  it("has a default name", function() {
    var strategy = Object.create(new Strategy({}, function() {}));
    expect(strategy.name).to.eql("mock-oauth2");
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

  it("requires a callbackUrl if redirectToCallback is true", function() {
    expect(function() {
      new Strategy({ redirectToCallback: true }, function() {});
    }).to.throw(TypeError);
  });

  it("can be set for OAuth 2", function() {
    var strategy = Object.create(
      new Strategy({ callbackURL: "/here" }, function() {})
    );
    expect(strategy._callbackURL).to.eql("/here");
  });

  it("passReqToCallback defaults to false", function() {
    var strategy = Object.create(
      new Strategy({ callbackURL: "/here" }, function() {})
    );
    expect(strategy._passReqToCallback).to.be.false;
  });

  it("passReqToCallback can be set to true", function() {
    var strategy = Object.create(
      new Strategy(
        { passReqToCallback: true, callbackURL: "/here" },
        function() {}
      )
    );
    expect(strategy._passReqToCallback).to.be.true;
  });
});

describe("OAuth2 Authenticate", function() {
  var req;

  beforeEach(function() {
    req = { query: {} };
  });

  context(
    "when __mock_strategies is not set and redirectToCallback is true",
    function() {
      it("redirects the user to the callbackURL with the correct query param", function(done) {
        var strategy = Object.create(
          new Strategy(
            { redirectToCallback: true, callbackURL: "/cb" },
            function() {}
          )
        );
        strategy.redirect = function(path) {
          expect(path).to.eql("/cb?__mock_strategies=true");
          done();
        };
        strategy.authenticate(req, {});
      });
    }
  );

  context(
    "when __mock_strategies is set and redirectToCallback is true",
    function() {
      var strategy;

      beforeEach(function() {
        req.query.__mock_strategies = true;
      });

      context("when passReqToCallback is true", function() {
        it("handles a verify method that asks for the request, accessToken, refreshToken, and profile", function(done) {
          strategy = new Strategy(
            {
              callbackURL: "/cb",
              passReqToCallback: true,
              passAuthentication: true
            },
            function(request, accessToken, refreshToken, profile, cb) {
              cb(null, {
                request: request,
                profile: profile,
                accessToken: accessToken,
                refreshToken: refreshToken
              });
            }
          );

          strategy._accessToken = "abc";

          strategy._refreshToken = "def";

          strategy._profile = { id: 1 };
          strategy = Object.create(strategy);

          strategy.success = function(data) {
            expect(data.accessToken).to.eql("abc");
            expect(data.refreshToken).to.eql("def");
            expect(data.profile.id).to.eql(1);
            expect(data.request).to.eql(req);
            done();
          };

          strategy.authenticate(req, {});
        });
      });
    }
  );
});
