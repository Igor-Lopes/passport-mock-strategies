var http = require("http");
var express = require("express");
var app = express();
var passport = require("passport");
var session = require("express-session");
var StrategyMock = require("./lib").Strategy;

var GoogleStrategyMock = require("./lib").GoogleTokenStrategy;

app.set("port", process.env.PORT || 5000);

app.use(
  session({
    secret: "abc",
    name: "test"
  })
);

/* Use Passport */
app.use(passport.initialize());
app.use(passport.session());

// create your verify function on your own -- should do similar things as
// the "real" one.
passport.use(
  new StrategyMock(
    {
      passReqToCallback: true,
      passAuthentication: true
    },
    function verifyFunction(req, token, refreshToken, profile, done) {
      done(null, profile);
    }
  )
);

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

let strategy = passport._strategies["mock-oauth2"];

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
  (req, res) => {
    res.send(req.user);
  }
);

app.get(
  "/mock/google",
  passport.authenticate("mock-google-token", {
    session: false
  }),
  (req, res) => {
    res.send(req.user);
  }
);

app.get("/test", (req, res) => {
  res.end();
});

var server = http.createServer(app);

server.listen(process.env.PORT || 5000, () => {
  console.log("Express Server - Listening on port: " + app.get("port"));
});
