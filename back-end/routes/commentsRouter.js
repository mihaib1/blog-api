import "dotenv/config.js";
import { Router } from "express";
import { AuthenticationUtils } from "../authUtils.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { validateCommentCreation } from "../middleware/validation.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";
const authenticationUtils = new AuthenticationUtils();

import { CommentController } from "../controllers/commentsController.js";
const commentActions = new CommentController();

let commentsRouter = Router();

commentsRouter.post("/", authenticationUtils.authenticateToken, validateCommentCreation, asyncHandler(async (req, res) => {
    const payload = {
        userId: req.user.id,
        comment: req.body.comment,
        postId: req.body.postId
    }
    let insertResult = await commentActions.createComment(payload);
    successResponse(res, {insertResult}, null, 201);
}))

export { commentsRouter }