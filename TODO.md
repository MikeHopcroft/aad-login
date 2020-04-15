# Todo list

* Top
  * Cleanup code
  * Encapsulate app in class or function.
  * Encapsulate passport initialization in class or function
    * Investigate passport.initialize()
    * Investigate passport.session()
    * Also passport methods serializeUser(), deserializeUser(), and use().
  * VSCode tab spacing configuration
  * Delete index.ts
  * Not found error on /success after navigating to /auth/success
    * /favicon.ico
  * Error handling when !profile.oid in signInComplete()
  * Review and cleanup .env
    * Consider switching to env processor with defaults
    * new OIDCStrategy()
      * OAUTH_ID_METADATA
      * OAUTH_APP_ID
      * OAUTH_REDIRECT_URI
      * OAUTH_APP_PASSWORD
      * OAUTH_SCOPES
    * oAuth2.create()
      * OAUTH_APP_ID
      * OAUTH_APP_PASSWORD
      * OAUTH_AUTHORITY
      * OAUTH_AUTHORIZE_ENDPOINT
      * OAUTH_TOKEN_ENDPOINT
  * Stub out commands
    * cli login
    * cli logout
    * cli test
  * Write tokenObject to disk
  * Read tokenObject from disk and validate
  * Logged-in state detection and logic
  * Message with URL
  * Open browser
* Basic console application
  * cli login
  * cli logout
  * cli test
* x Express server with route for authentication
* Print credentials on /auth/success. This requires getting them from the session.
* Errors should display message localhost
  * Currently an error in, say authRouter.get('/success',...) will fail the redirect.
* Launch web browser on Windows, Linux, OSX - https://www.npmjs.com/package/open
* Print message with URL if browser can't be launched
* x Print credentials
* Write credentials to file
* Read credentials from file
* Command that does something with credentials
* Investigate token renewal
* Investigate finding an unused port
* Prune items in .env file
* Implement signout
* Token refresh: https://github.com/lelylan/simple-oauth2#access-token-object
* README.md
* ARM template for example tenant and application registration
* 
