import { PostsActions } from "../db/queries.js";
const postsQueries = new PostsActions();

class PostsController {
    async getPostById(postId){
        const post = await postsQueries.getPostById(postId);
        return post;
    }

    async updatePost(postId, updateData){
        const updatedPost = await postsQueries.updatePost(postId, updateData);
        return updatedPost;
    }

    async deletePostById(postId){
        const removedPost = await postsQueries.deletePostById(postId);
        if(removedPost){
            return {
                isSuccess: true,
                removedPost
            }
        } else {
            return {isSuccess: false}
        }
    }

    async createPost(payload){
        const newPost = await postsQueries.createPost(payload);        
        if(newPost){
            return {
                isSuccess: true,
                newPost
            }
        } else {
            return {
                isSuccess: false
            }
        }
    }

    async getAllPosts(){
        const posts = await postsQueries.getAllPosts();
        return posts;
    }
}

export {
    PostsController
}