import { AuthenticationUtils } from "../authUtils.js";
const authenticationUtils = new AuthenticationUtils();

import { asyncHandler } from "../middleware/errorHandler.js";
import { validatePostCreation } from "../middleware/validation.js";

import { Router } from "express";
let postsRouter = Router();

import { PostsController } from "../controllers/postsController.js";
import { errorResponse, successResponse } from "../utils/responseHandler.js";
const postController = new PostsController();

postsRouter.get("/", asyncHandler(async (req, res) => {
    const posts = await postController.getAllPosts();
    if(posts){
        successResponse(res, {posts: posts}, null, 200);
    } else {
        errorResponse(res, `Posts have not been found`, null, 500);
    }
}));

postsRouter.get("/:postId", asyncHandler(async (req, res) => {
    const postId = parseInt(req.params.postId);
    const post = await postController.getPostById(postId);
    
    if(!post) {
        return errorResponse(res, "Post not found", null, 404);
    }
    
    if(post.published){
        successResponse(res, {post: post}, "Post retrieved", 200);
    } else {
        successResponse(res, {post: post}, "Post not published", 200);
    }
}));

postsRouter.post("/", authenticationUtils.authenticateToken, validatePostCreation, asyncHandler(async (req, res) => {
    const bodyKeys = Object.keys(req.body);
    const payload = { userId: req.user.id }
    bodyKeys.forEach((key) => {
        payload[key] = req.body[key];
    })
    const newPost = await postController.createPost(payload);
    if(newPost.isSuccess){
        successResponse(res, { newPost: newPost }, "Post created successfully", 201)
    } else {
        errorResponse(res, `Post creation failed! Please try again later!`, 'Error', 500);
    } 
}))

postsRouter.put(
  "/:postId",
  authenticationUtils.authenticateToken,
  //validatePostUpdate,
  checkUserRights,
  asyncHandler(async (req, res) => {
    const postId = parseInt(req.params.postId);
    const updatedPost = await postController.updatePost(postId, req.body);
    successResponse(res, { post: updatedPost }, "Post updated successfully");
  })
);

postsRouter.delete("/:postId", authenticationUtils.authenticateToken, checkUserRights, asyncHandler(async (req, res) => {
    const postId = parseInt(req.params.postId)
    const removedPost = await postController.deletePostById(postId);
    if(removedPost){
        successResponse(res, {removedPost}, `Post removed successfully`, 200);
    } else {
        errorResponse(res, `Post delete failed!`, null, 500);
    }
}));

async function checkUserRights(req, res, next){
    try {
        const postId = parseInt(req.params.postId);
        const postDetails = await postController.getPostById(postId);
        
        if(!postDetails) {
            return res.status(404).json({
                success: false,
                error: "Post not found"
            });
        }
        
        const higherPermissionRoles = ['ADMIN', 'EDITOR'];
        const userHasHigherPermission = higherPermissionRoles.indexOf(req.user.role) > -1;
        
        if(postDetails.createdByUserId === req.user.id || userHasHigherPermission){
            next();
        } else {
            res.status(403).json({
                success: false,
                error: "Unauthorized: You don't have permission to modify this post"
            });
        }
    } catch(error) {
        res.status(500).json({
            success: false,
            error: "Error checking permissions"
        });
    }
}

export { postsRouter }