import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy } from "passport-local";
import { UserController } from "./controllers/usersController.js";
import { UserActions } from "./db/queries.js";
import bcrypt from "bcryptjs";

const userController = new UserController();
const userQueries = new UserActions();

const fieldsConfig = {
    usernameField: "username",
    passwordField: "password"
};

function initialize(passport){
    let verifyUser = async (username, password, done) => {
        if(username && password){
            const user = await userQueries.getUserByEmailOrUsername(username);

            if(!user){
                return done(null, false, { message: "No user found!" });
            }

            try{
                if(await bcrypt.compare(password, user.password)){
                    return done(null, user);
                } else {
                    return done(null, false, { message: "Incorrect password!"});
                }
            } 
            catch(err){
                console.log(err);
                return done(err);
            }
        }

    }
    passport.use(new Strategy(fieldsConfig, verifyUser));
}

class AuthenticationUtils {
    authenticateToken = function(req, res, next){
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if(token == null) return res.status(401).json({ 
            success: false, 
            error: "Unauthorized: No token provided" 
        });
        jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
            if(err) return res.status(401).json({
                success: false,
                error: "Invalid or expired token"
            });
            req.user = user;
            next();
        })
    }

    checkNotAuthenticated = function(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if(token == null) return next();
        jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
            if(err) return next();
            req.user = user;
            return res.status(403).json({
                success: false,
                error: "Already authenticated"
            });
        })
    }

    addUserToRequestBody = function(req, res, next){
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if(token === null) next();
        jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
            if(err) return next();
            req.user = user;
            return next();
        });
    }
}


export {
    AuthenticationUtils,
    initialize
}
