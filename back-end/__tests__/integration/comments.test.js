import request from 'supertest';
import app from '../../app.js';
import { prisma } from '../../lib/prisma.js';

describe('Comments', () => {
    let token;
    let userId;
    let postId;

    afterAll(async () => {
        await prisma.$disconnect();
    });

    beforeEach(async () => {
        // Clean up
        await prisma.comment.deleteMany(); 
        await prisma.post.deleteMany();     
        await prisma.user.deleteMany();   

        // Create user
        const createUserResponse = await request(app)
            .post('/users/create')
            .send({
                username: 'commentstest',
                email: 'comments@example.com',
                password: 'password123',
                confirmPassword: 'password123'
            });

        userId = createUserResponse.body.data.userInsertResult.newUser.id;

        // Login
        const loginResponse = await request(app)
            .post('/login')
            .send({
                username: 'commentstest',
                password: 'password123'
            });

        token = loginResponse.body.data.token;

        // Create a post
        const postResponse = await request(app)
            .post('/posts')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Test Post for Comments',
                text: 'This is a test post with enough content'
            });

        postId = postResponse.body.data.newPost.newPost.id;
    });

    describe('POST /comments - Create Comment', () => {
        test('should create a comment when authenticated', async () => {
            const response = await request(app)
                .post('/comments')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    postId: postId,
                    comment: 'This is a test comment'
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
        });

        test('should reject comment without authentication', async () => {
            const response = await request(app)
                .post('/comments')
                .send({
                    postId: postId,
                    comment: 'This is a test comment'
                });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });

        test('should reject comment with empty text', async () => {
            const response = await request(app)
                .post('/comments')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    postId: postId,
                    comment: ''  // Empty
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });

        test('should reject comment with missing postId', async () => {
            const response = await request(app)
                .post('/comments')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    comment: 'Test comment'
                    // postId missing
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });
    });
});