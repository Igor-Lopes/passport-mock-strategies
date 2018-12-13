var http = require("http");
var express = require("express");
var app = express();
var passport = require("passport");
var session = require("express-session");
var OAuth2StrategyMock = require("./lib").OAuth2Strategy;
var GoogleStrategyMock = require("./lib").GoogleTokenStrategy;

app.set("port", process.env.PORT || 5000);

app.use(
  session({
    secret: "abc",
    name: "test",
    resave: false,
    saveUninitialized: false
  })
);

/* Use Passport */
app.use(passport.initialize());
app.use(passport.session());

/* OAuth2 Strategy */
passport.use(
  new OAuth2StrategyMock(
    {
      passReqToCallback: true,
      passAuthentication: true
    },
    function verifyFunction(req, token, refreshToken, profile, done) {
      done(null, profile);
    }
  )
);

/* Google Token Strategy */
passport.use(
  new GoogleStrategyMock(
    {
      passReqToCallback: true,
      passAuthentication: true
    },
    function verifyFunction(req, parsedToken, googleId, done) {
      done(null, googleId);
    }
  )
);

var strategy = passport._strategies["mock-oauth2"];

strategy._redirectToCallback = true;
strategy._callbackURL = "http://localhost:5000/mock/oauth2";

strategy._profile = {
  id: 1234,
  provider: "facebook-oauth2",
  displayName: "Igor Lopes",
  emails: [{ value: "igor.lopes@gmail.com" }],
  photos: [
    {
      value: "https://via.placeholder.com/350x150"
    }
  ]
};

app.get(
  "/mock/oauth2",
  passport.authenticate("mock-oauth2", {
    session: false
  }),
  function(req, res) {
    res.send(req.user);
  }
);

app.get(
  "/mock/google",
  passport.authenticate("mock-google-token", {
    session: false
  }),
  function(req, res) {
    res.send(req.user);
  }
);

app.get("/test", function(req, res) {
  res.end();
});

var server = http.createServer(app);

server.listen(process.env.PORT || 5000, function() {
  console.log("Express Server - Listening on port: " + app.get("port"));
});
