### Blog API - backend component

## Explaining the scripts from the root folder:
1. authUtils.js
    -> verifyUser(username, password, done) is the callback function used by the Local Strategy of the passport library in order to verify the user's credentials (username / email AND password)
    -> initialize(passport) is used in order to create a new instance of the passportjs library using the Local Strategy (username and password authentication)

    -> AuthenticateUser class offers (at the moment) only 2 methods: 
        1. "authenticateToken" which is used for authenticating the JWTs (JSON Web Tokens) received from the client. In case of receiving a NULL token, it will return a 401 (Forbidden) status. jwt.verify() method (imported from the 'jsonwebtoken' library) is used to verify whether the user is authenticated or not. 
        2. checkNotAuthenticated is used for verifying that a user is not authenticated (does not have a JWT). This is used for verification before accessing the login page. In case the user has an invalid JWT or does not have a JWT, the next() function is called.

2. app.js is the main script, at the moment it only imports the routers.

## Routers
1. indexRouter
    -> There are a few imports (authUtils, passport, jwt)
    -> The GET request for "/" path first authenticates the JWT received from client, but it's only for testing purposes. In the end product, unauthenticated users will be able to see the blog posts, without the comment functionality.

    -> The GET request for "/login" path MUST check that the user is unauthenticated. In case they are already authenticated, they should be redirected to the main ("/") page.
    -> The POST request for "/login" path firstly calls the passport.authenticate("local") method. If the user exists (username and password combination is correct), a JWT will be generated and sent to the client along with a isSuccess bool set to true.

    -> The GET request for "/register" path should check for the user to not be authenticated (the same as the "/login" GET request). A logged user SHOULD NOT land on the registration page.
    -> The POST request for "/register" is still WIP. It just has to send the req.body and call the script for inserting a new user to the DB. The functionality already exists in the usersRouter, but it would be better to move it here.

2. postsRouter
    -> 