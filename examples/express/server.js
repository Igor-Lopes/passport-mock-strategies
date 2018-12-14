var http = require("http");
var express = require("express");
var app = express();
var passport = require("passport");
var session = require("express-session");
var OAuth2Strategy = require("../../lib").OAuth2Strategy;
var GoogleStrategy = require("../../lib").GoogleTokenStrategy;

/* Set port */
app.set("port", process.env.PORT || 5000);

/* Use session */
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

/* Passport serialization */
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    //Mocked User
    let user = {
      id: 1234,
      provider: "mock-oauth2",
      displayName: "John Doe",
      emails: [{ value: "john.doe@email.com" }],
      photos: [
        {
          value: "https://via.placeholder.com/350x150"
        }
      ]
    };

    done(null, user);
  } catch (ex) {
    done(ex, null);
  }
});

/* Configure OAuth2 Strategy */
passport.use(
  new OAuth2Strategy(
    {
      passReqToCallback: true,
      passAuthentication: true
    },
    function verifyFunction(req, token, refreshToken, profile, done) {
      done(null, profile);
    }
  )
);

/* Configure Google Token Strategy */
passport.use(
  new GoogleStrategy(
    {
      passReqToCallback: true,
      passAuthentication: true
    },
    function verifyFunction(req, parsedToken, googleId, done) {
      done(null, parsedToken);
    }
  )
);

/* Mock OAuth2 */

var OAuth2StrategyMock = passport._strategies["mock-oauth2"];

OAuth2StrategyMock._redirectToCallback = true;
OAuth2StrategyMock._callbackURL = "/mock/oauth2/callback";

OAuth2StrategyMock._profile = {
  id: 1234,
  provider: "mock-oauth2",
  displayName: "John Doe",
  emails: [{ value: "john.doe@email.com" }],
  photos: [
    {
      value: "https://via.placeholder.com/350x150"
    }
  ]
};

/* OAuth2 routes */

// Main route
app.get(
  "/mock/oauth2",
  passport.authenticate("mock-oauth2", {
    scope: ["public_profile", "email"],
    failureRedirect: "/"
  })
);

// Callback route
app.get("/mock/oauth2/callback", passport.authenticate("mock-oauth2"), function(
  req,
  res
) {
  res.send(req.user);
});

/* Mock Google Token */

var GoogleTokenStrategyMock = passport._strategies["mock-google-token"];

GoogleTokenStrategyMock._parsedToken = {
  payload: {
    name: "John Doe",
    email: "john.doe@email.com",
    picture: "https://via.placeholder.com/350x150"
  }
};

GoogleTokenStrategyMock._googleId = "abc";

//Route
app.post(
  "/mock/google",
  passport.authenticate("mock-google-token", {
    session: false
  }),
  function(req, res) {
    res.send(req.user);
  }
);

/* Start server */

var server = http.createServer(app);

server.listen(process.env.PORT || 5000, function() {
  console.log("Express Server - Listening on port: " + app.get("port"));
});
