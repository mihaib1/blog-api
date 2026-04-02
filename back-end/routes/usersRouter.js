import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler.js";
import { validateUserCreation } from "../middleware/validation.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";
let usersRouter = Router();

import { UserController } from "../controllers/usersController.js";
const userController = new UserController();

import { AuthenticationUtils } from "../authUtils.js";
const authenticationUtils = new AuthenticationUtils();

usersRouter.get("/", asyncHandler(async (req, res) => {
    let cursor;
    if(req.query.cursor){
        const cursorId = parseInt(req.query.cursor);
        if(Number.isNaN(cursorId)){
            return errorResponse(res, `Invalid cursor`, null, 400);
        }
        cursor = { id: cursorId };
    }
    //cursor = req.query.cursor ? { id: parseInt(req.query.cursor)} : undefined
    let result = await userController.getUsersListPaginated(cursor);
    successResponse(res, {users: result.users, nextCursor: result.newCursor}, null, 200);
}));

usersRouter.get("/:userId", authenticationUtils.authenticateToken, asyncHandler(async (req, res) => {
    const userObj = {userId: parseInt(req.params.userId)};
    const userDetails = await userController.getUserDetails(userObj);
    successResponse(res, {userDetails}, null, 200);
}));

usersRouter.put(
  "/:userId",
  authenticationUtils.authenticateToken,
  //validateUserUpdate,
  asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.userId);
    const result = await userController.updateUser(userId, req.body);
    successResponse(res, result, "User updated successfully");
  })
);

usersRouter.delete("/:userId", asyncHandler(async (req, res) => { // for the moment we won't expose this endpoint.
    const userId = parseInt(req.params.userId);
    const removedUser = await userController.deleteUser(userId);
    if(removedUser){
        successResponse(res, {userId: userId, removedUser: removedUser}, `User removed successfully!`, 201);
    }
}));

usersRouter.get("/create", authenticationUtils.checkNotAuthenticated, asyncHandler(async (req, res) => {
    res.json({
        message: `Here is the rendering of the registration page, only if the user is not authenticated.`
    })
}));

usersRouter.post("/create", authenticationUtils.checkNotAuthenticated, validateUserCreation, asyncHandler(async(req, res) => {
    let userInsertResult = await userController.createUser(req.body);
    if(userInsertResult){
        successResponse(res, {userInsertResult}, null, 201);
    } else {
        errorResponse(res, `There was an error creating the user`, null, 500);
    }
    /*if(userInsertResult.isSuccess){
        res.status(200).json({
            isSuccess: true,
            message: `The user has been added successfully.`
        })
        
    } else {
        res.status(500).json({
            isSuccess: false,
            message: `There has been an error when creating user.`,
            userInsertResult
        })
    } */
}))

export { usersRouter }