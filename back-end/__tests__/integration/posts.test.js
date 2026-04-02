import request from 'supertest';
import app from '../../app.js';
import { prisma } from '../../lib/prisma.js';

describe('Posts', () => {
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
                username: 'poststest',
                email: 'posts@example.com',
                password: 'password123',
                confirmPassword: 'password123'
            });

        userId = createUserResponse.body.data.userInsertResult.newUser.id;

        // Login
        const loginResponse = await request(app)
            .post('/login')
            .send({
                username: 'poststest',
                password: 'password123'
            });

        token = loginResponse.body.data.token;
    });

    describe('GET /posts - Get All Posts', () => {
        test('should return empty array when no posts exist', async () => {
            const response = await request(app).get('/posts');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data.posts)).toBe(true);
            expect(response.body.data.posts.length).toBe(0);
        });

        test('should return all posts', async () => {
            // Create 2 posts
            await request(app)
                .post('/posts')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Post 1',
                    text: 'This is the first post with enough content'
                });

            await request(app)
                .post('/posts')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Post 2',
                    text: 'This is the second post with enough content'
                });

            const response = await request(app).get('/posts');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.posts.length).toBe(2);
        });
    });

    describe('POST /posts - Create Post', () => {
        test('should create a new post when authenticated', async () => {
            const response = await request(app)
                .post('/posts')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'My First Post',
                    text: 'This is a test post with enough content'
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.newPost.newPost.title).toBe('My First Post');
            expect(response.body.data.newPost.newPost.text).toBe('This is a test post with enough content');

            postId = response.body.data.newPost.newPost.id;
        });

        test('should reject post creation without authentication', async () => {
            const response = await request(app)
                .post('/posts')
                .send({
                    title: 'My First Post',
                    text: 'This is a test post with enough content'
                });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });

        test('should reject post with short title', async () => {
            const response = await request(app)
                .post('/posts')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Hi',  // Too short
                    text: 'This is a test post with enough content'
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });

        test('should reject post with short text', async () => {
            const response = await request(app)
                .post('/posts')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Valid Title',
                    text: 'Short'  // Too short
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });
    });

    describe('GET /posts/:postId - Get Single Post', () => {
        beforeEach(async () => {
            // Create a post
            const response = await request(app)
                .post('/posts')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Test Post',
                    text: 'This is a test post with enough content'
                });

            postId = response.body.data.newPost.newPost.id;
        });

        test('should return a post by ID', async () => {
            const response = await request(app).get(`/posts/${postId}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.post.id).toBe(postId);
            expect(response.body.data.post.title).toBe('Test Post');
        });

        test('should return 404 for non-existent post', async () => {
            const response = await request(app).get('/posts/99999');

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
        });
    });

    describe('PUT /posts/:postId - Update Post', () => {
        beforeEach(async () => {
            // Create a post
            const response = await request(app)
                .post('/posts')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Original Title',
                    text: 'This is the original post content'
                });

            postId = response.body.data.newPost.newPost.id;
        });

        test('should update post when owner', async () => {
            const response = await request(app)
                .put(`/posts/${postId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Updated Title'
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.post.title).toBe('Updated Title');
        });

        test('should reject update without authentication', async () => {
            const response = await request(app)
                .put(`/posts/${postId}`)
                .send({
                    title: 'Updated Title'
                });

            expect(response.status).toBe(401);
        });
    });

    describe('DELETE /posts/:postId - Delete Post', () => {
        beforeEach(async () => {
            // Create a post
            const response = await request(app)
                .post('/posts')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Post to Delete',
                    text: 'This post will be deleted'
                });

            postId = response.body.data.newPost.newPost.id;
        });

        test('should delete post when owner', async () => {
            const response = await request(app)
                .delete(`/posts/${postId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);

            // Verify post is deleted
            const getResponse = await request(app).get(`/posts/${postId}`);
            expect(getResponse.status).toBe(404);
        });

        test('should reject delete without authentication', async () => {
            const response = await request(app)
                .delete(`/posts/${postId}`);

            expect(response.status).toBe(401);
        });
    });
});