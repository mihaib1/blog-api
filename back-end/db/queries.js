import { prisma } from "../lib/prisma.js";

class UserActions {
    async getUserById(userId){
        const user = await prisma.user.findUnique({
            where:{
                id: userId
            }
        })
        return user;
    }

    async getUsersPaginated(cursor, userId){
        const elementsPerPage = 10;
        let queryParams = {
            take: elementsPerPage,
            orderBy: {
                id: "asc"
            }
        }
        if(cursor){
            queryParams.skip = 1;
            queryParams.cursor = cursor
        }

        let users = await prisma.user.findMany(queryParams);
        console.log(users);
        const lastUser = users[users.length - 1];
        return {
            users,
            newCursor: lastUser ? { id: lastUser.id } : null
            //newCursor: {id: users[elementsPerPage - 1] ? users[elementsPerPage - 1].id : null}
        }
    }

    async getUserByUsername(username){
        const user = await prisma.user.findUnique({
            where: {
                username: username,
            }
        });
        return user;
    }

    async getUserByEmail(email){
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        return user;
    }

    async getUserByEmailOrUsername(data){
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: data }, 
                    { email: data }
                ]
            }
        })
        return user;
    }

    async createUser(payload){
        const newUser = await prisma.user.create({
            data:{
                email: payload.email,
                username: payload.username,
                password: payload.password,
                role: payload.role ? payload.role : "USER",
                isAuthorized: true,
                displayName: payload.displayName
            }
        });
        return newUser;
    }

    async removeUser(userId){
        const removedUser = await prisma.user.delete({
            where: {
                id: userId
            }
        });
        return removedUser;
    }

    async toggleUserAuthorization(userId, authorizationFlag){
        const updatedUser = await prisma.user.update({
            where:{
                id: userId
            },
            data:{
                isAuthorized: authorizationFlag
            }
        });
        return updatedUser;
    }
    
    async updateUser(userId, userData){
        const updatedUser = await prisma.user.update({
            where: {
                id: userId
            },
            data: userData
        })
        return updatedUser;
    }
}

class PostsActions {
    async getPostById(postId) {
        const post = await prisma.post.findFirst({
            select:{
                id: true,
                createdByUserId: true,
                createdOn: true,
                modifiedOn: true,
                published: true,
                text: true,
                title: true,
                user:{
                    select:{
                        username: true,
                        displayName: true,
                        email: true
                    }
                },
                comments: {
                    select: {
                        approved: true,
                        comment: true,
                        createdByUserId: true,
                        createdOn: true,
                        id: true,
                        user: {
                            select: {
                                username: true,
                                email: true
                            }
                        }
                    },
                    orderBy:{
                        createdOn: "desc"
                    }
                }
            },
            where: {
                id: postId
            }
        });
        return post;
    }

    async getAllPosts() {
        const posts = await prisma.post.findMany({
            orderBy:{
                createdOn: "desc"
            }
        });
        return posts;
    }

    async getPostsPaginated(cursor) {
        let elementsPerPage = 10;
        let queryObj = {
            take: elementsPerPage,
            orderBy: {
                id: 'asc'
            }
        };
        if(cursor){
            queryObj.cursor = {id: cursor}
        };

        const queryResult = await prisma.post.findMany(queryObj);
        return {
            queryResult,
            newCursor: {id: queryResult[elementsPerPage - 1].id}
        }
    }

    async updatePost(postId, updateObj){
        queryObj = {
            modifiedOn: new Date()
        }
        if(updateObj.title){
            queryObj.title = updateObj.title
        };

        if(updateObj.text) {
            queryObj.text = updateObj.text;
        }
        
        if(Object.keys(updateObj).includes("published")){
            queryObj.published = updateObj.published
        };

        const updatedPost = await prisma.post.update({
            where: {
                id: postId
            },
            data: queryObj
        })

        return updatedPost;
    }

    async deletePostById(postId){
        return await prisma.post.delete({
            where: { id: postId }
        });
    }

    async createPost(payload){
        const newPost = await prisma.post.create({
            data:{
                createdByUserId: payload.userId,
                title: payload.title,
                text: payload.text,
                published: payload.published ? payload.published : true
            }
        })
        return newPost;
    }
}

class CommentsActions {
    async createComment(payload){
        if(payload.userId && payload.postId && payload.comment){
            const newComment = await prisma.comment.create({
                data:{
                    postId: Number(payload.postId),
                    createdByUserId: Number(payload.userId),
                    comment: payload.comment,
                    approved: true
                }
            });
            return newComment;
        } else {
            throw new Error("userId, postId and comment are required!");
        }
    }
}

export { PostsActions, UserActions, CommentsActions}