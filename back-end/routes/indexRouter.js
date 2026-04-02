import "dotenv/config.js";
import { Router } from "express";
import passport from "passport";
import { asyncHandler } from "../middleware/errorHandler.js";
import { AuthenticationUtils } from "../authUtils.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";
import jwt from "jsonwebtoken";

const authenticationUtils = new AuthenticationUtils();

let indexRouter = Router();

indexRouter.get("/", authenticationUtils.authenticateToken, (req, res) => {
    successResponse(res, {isSuccess: true, user: req.user}, `Index Router sent successfully`, 200);
})

indexRouter.get("/login", authenticationUtils.checkNotAuthenticated, (req, res) => {
    res.json({
        message: `This is the login page. Here we'll just send the login page to the client.`
    })
});

indexRouter.post(
    "/login", 
    passport.authenticate("local", {session: false}), 
    asyncHandler(async (req, res) => {
        // A successful login will generate a JWT for the user. 
        const user = req.user;
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
                isAuthorized: user.isAuthorized, 
                username: user.username, 
                email: user.email
            },
            process.env.SECRET_KEY,
            //{ expiresIn: "2h" }
        );
        if(token){
            successResponse(res, {isSuccess: true, token: token}, null, 200);
        } else {
            errorResponse(res, `Login Failed`, null, 401);
        }
        
    })
) 

indexRouter.get("/register", authenticationUtils.checkNotAuthenticated, (req, res) => {
    successResponse(res, null, `This is the register page`, 200);
});

export {indexRouter}