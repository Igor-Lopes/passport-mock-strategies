# passport-mock-strategies
[![Build Status](https://travis-ci.org/Nucleus-Inc/passport-mock-strategies.svg?branch=master)](https://travis-ci.org/Nucleus-Inc/passport-mock-strategies)
[![dependencies Status](https://david-dm.org/Nucleus-inc/passport-mock-strategies/status.svg)](https://david-dm.org/Nucleus-inc/passport-mock-strategies)

Mock Passport.js strategies for testing and development

## Strategies

> The following strategies are avaiable for mocking:

- OAuth2Strategy
  
  The **OAuth2Strategy** mocks any OAuth2 Passport lib that expect `req (optional), accessToken, refreshToken, profile, done` in verify callback. This strategy also mocks the callbackUrl redirect, but it can be easily disabled for mobile based strategies that do not require it, such as [passport-facebook-token](https://github.com/drudge/passport-facebook-token), [passport-instagram-token](https://github.com/ghaiklor/passport-instagram-token) and [passport-github-token](https://github.com/ghaiklor/passport-github-token).
  
- GoogleTokenStrategy
  
  The **GoogleTokenStrategy** mocks the [passport-google-id-token](https://github.com/jmreyes/passport-google-id-token) strategy, that expect `req (optional), parsedToken, googleId, done` in verify callback. 
  
## Install

`npm install --save passport-mock-strategies`

## Usage

### OAuth2Strategy

#### Configure Strategy

```
var OAuth2StrategyMock = require("passport-mock-strategies").OAuth2Strategy;

passport.use(
  new OAuth2StrategyMock(
    {
      // Options
      passReqToCallback: true,
      passAuthentication: true
    },
    function verifyFunction(req, token, refreshToken, profile, done) {
      /* You can mock you database fetch here */
      
      var mock = {
        id: 1,
        "name": "John Doe",
        "email": "john.doe@email.com"
      }
      
      done(null, mock);
    }
  )
);
```

#### Set mock data

```
strategy._redirectToCallback = true;
strategy._callbackURL = "http://localhost:5000/mock/oauth2/callback";

strategy._profile = {
  id: 1234,
  provider: "facebook",
  displayName: "John Doe",
  emails: [{ value: "john.doe@email.com" }],
  photos: [
    {
      value: "https://via.placeholder.com/350x150"
    }
  ]
};
```

#### Authenticate Requests

```
// Main route
app.route('/mock/oauth2').get(
  passport.authenticate('mock-oauth2', {
    scope: ['profile', 'email']
  })
)

// Callback route
app.get(
  "/mock/oauth2/callback",
  passport.authenticate("mock-oauth2"),
  function(req, res) {
    res.send(req.user);
  }
);
```

### GoogleTokenStrategy

#### Configure Strategy

```
var GoogleStrategyMock = require("passport-mock-strategies").GoogleTokenStrategy;

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
```

#### Set mock data

```
strategy._parsedToken = "abc";
strategy._googleId = "def";
```

#### Authenticate Requests

```
app.get(
  "/mock/google",
  passport.authenticate("mock-google-token", {
    session: false
  }),
  function(req, res) {
    res.send(req.user);
  }
);
```

## License

[The MIT License](https://github.com/Nucleus-Inc/passport-mock-strategies/blob/master/LICENSE)
