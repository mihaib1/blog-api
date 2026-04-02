import { CommentsActions } from "../db/queries.js";
const commentsQueries = new CommentsActions();


class CommentController {
    async createComment(payload){
        const newComment = await commentsQueries.createComment(payload);
        return newComment;
    }
}

export { CommentController }