import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as session from 'express-session';
import { createServer } from 'http';
import * as createHttpError from 'http-errors';
import * as open from 'open';
import * as oAuth2 from 'simple-oauth2';
import * as passport from 'passport';
import { IProfile, OIDCStrategy, VerifyCallback } from 'passport-azure-ad';

import { createAuthRouter } from './auth-router';

dotenv.config();

///////////////////////////////////////////////////////////////////////////////
//
// Configure passport
//
///////////////////////////////////////////////////////////////////////////////

// In-memory storage of logged-in users
// For demo purposes only, production apps should store
// this in a reliable storage
var users: { [key: string]: any } = {};

// Passport calls serializeUser and deserializeUser to
// manage users
passport.serializeUser(function (user: any, done) {
  // Use the OID property of the user as a key
  users[user.profile.oid] = user;
  done(null, user.profile.oid);
});

passport.deserializeUser(function (id: string, done) {
  done(null, users[id]);
});


///////////////////////////////////////////////////////////////////////////////
//
// Configure simple-oauth2
//
///////////////////////////////////////////////////////////////////////////////
const oAuth2Client = oAuth2.create({
  client: {
    id: process.env.OAUTH_APP_ID!,
    secret: process.env.OAUTH_APP_PASSWORD!
  },
  auth: {
    tokenHost: process.env.OAUTH_AUTHORITY!,
    authorizePath: process.env.OAUTH_AUTHORIZE_ENDPOINT,
    tokenPath: process.env.OAUTH_TOKEN_ENDPOINT
  }
});

async function signInComplete(
  iss: string,
  sub: string,
  profile: IProfile,
  accessToken: string,
  refreshToken: string,
  params: any,
  done: VerifyCallback
): Promise<void> {
  console.log('signInComplete');
  console.log(JSON.stringify(params, null, 2));

  // TODO: should we throw an error here?
  if (!profile.oid) {
    return done(new Error("No OID found in user profile."), null);
  }

  // TODO: write portions of params to disk here.
  //   access_token
  //   refresh_token
  //   expires_in
  // See https://github.com/lelylan/simple-oauth2#access-token-object

  // Create a simple-oauth2 token from raw tokens
  let oauthToken = oAuth2Client.accessToken.create(params);
  console.log(oauthToken);

  // Save the profile and tokens in user storage
  users[profile.oid] = { profile, oauthToken };

  return done(null, users[profile.oid]);
}


async function go() {
  // Configure OIDC strategy
  const strategy = new OIDCStrategy(
    {
      identityMetadata: `${process.env.OAUTH_AUTHORITY}${process.env.OAUTH_ID_METADATA}`,
      clientID: process.env.OAUTH_APP_ID!,
      responseType: 'code id_token',
      responseMode: 'form_post',
      redirectUrl: process.env.OAUTH_REDIRECT_URI!,
      allowHttpForRedirectUrl: true,
      clientSecret: process.env.OAUTH_APP_PASSWORD,
      validateIssuer: false,
      passReqToCallback: false,
      scope: process.env.OAUTH_SCOPES!.split(' ')
    },
    signInComplete
  );

  passport.use(strategy);


  ///////////////////////////////////////////////////////////////////////////////
  //
  // Configure express
  //
  ///////////////////////////////////////////////////////////////////////////////
  var app = express();

  // Session middleware
  // NOTE: Uses default in-memory session store, which is not
  // suitable for production
  app.use(session({
    secret: 'your_secret_value_here',
    resave: false,
    saveUninitialized: false,
    unset: 'destroy'
  }));

  // app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  // app.use(express.static(path.join(__dirname, 'public')));

  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  app.use('/auth', createAuthRouter());

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createHttpError(404));
  });

  // error handler
  app.use((
    err: Error | createHttpError.HttpError,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.log('error:' + JSON.stringify(err, null, 4));
    if ('status' in err) {
      res.status(err.status);
    } else {
      res.status(500);
    }

    // TODO: better rendering here.
    res.json(err);
  });

  const server = createServer(app);
  const port = 3000;
  server.listen(port);
  console.info(`Service listening on port ${port}.`);
  await open('http://localhost:3000/auth/signin');
}

go();
