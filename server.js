var http = require("http");
var express = require("express");
var app = express();
var passport = require("passport");
var session = require("express-session");
var StrategyMock = require("./lib").Strategy;

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
      console.log(profile);
      var mock = {
        id: 1,
        role: "test",
        first_name: "John",
        last_name: "Doe"
      };
      done(null, mock);
    }
  )
);

let strategy = passport._strategies["mock"];

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
  "/mock/login",
  passport.authenticate("mock", {
    session: false
  }),
  (req, res) => {
    res.send("ok");
  }
);

app.get("/test", (req, res) => {
  res.end();
});

var server = http.createServer(app);

server.listen(process.env.PORT || 5000, () => {
  console.log("Express Server - Listening on port: " + app.get("port"));
});
