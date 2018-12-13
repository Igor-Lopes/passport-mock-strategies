/**
 * Author: Michael Weibel <michael.weibel@gmail.com>
 * License: MIT
 */

var http = require("http");
var express = require("express");
var app = express();
var passport = require("passport");
var session = require("express-session");
var StrategyMock = require("./lib");

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
      passReqToCallback: true
    },
    function verifyFunction(req, user, done) {
      // user = { id: 1};
      // Emulate database fetch result
      console.log("user");
      console.log(req);

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

module.exports = function(app, options) {};
