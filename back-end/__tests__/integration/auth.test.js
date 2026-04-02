import request from 'supertest';
import app from '../../app.js';
import { prisma } from '../../lib/prisma.js';

describe('Authentication', () => {
    // Clean up after all tests
    afterAll(async () => {
        await prisma.$disconnect();
    });

    // Clear tables before each test - DELETE IN CORRECT ORDER!
    beforeEach(async () => {
        await prisma.comment.deleteMany();
        await prisma.post.deleteMany();
        await prisma.user.deleteMany();
    });

    describe('POST /users/create - User Registration', () => {
        test('should create a new user with valid data', async () => {
            const response = await request(app)
                .post('/users/create')
                .send({
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'password123',
                    confirmPassword: 'password123',
                    displayName: 'Test User'
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            // The response structure is: { success, data: { userInsertResult: { isSuccess, newUser } } }
            expect(response.body.data.userInsertResult.newUser.username).toBe('testuser');
            expect(response.body.data.userInsertResult.newUser.email).toBe('test@example.com');
            
            // Verify user is in database
            const user = await prisma.user.findUnique({
                where: { username: 'testuser' }
            });
            expect(user).toBeDefined();
            expect(user.email).toBe('test@example.com');
        });

        test('should reject duplicate email', async () => {
            // Create first user
            await request(app)
                .post('/users/create')
                .send({
                    username: 'user1',
                    email: 'duplicate@example.com',
                    password: 'password123',
                    confirmPassword: 'password123'
                });

            // Try to create with same email
            const response = await request(app)
                .post('/users/create')
                .send({
                    username: 'user2',
                    email: 'duplicate@example.com',
                    password: 'password123',
                    confirmPassword: 'password123'
                });

            // Even though validation passes, the database constraint fails
            // Your controller returns the error in the userInsertResult
            expect(response.status).toBe(201);
            expect(response.body.data.userInsertResult.isSuccess).toBe(false);
            expect(response.body.data.userInsertResult.message).toContain('already');
        });

        test('should reject duplicate username', async () => {
            // Create first user
            await request(app)
                .post('/users/create')
                .send({
                    username: 'duplicateuser',
                    email: 'email1@example.com',
                    password: 'password123',
                    confirmPassword: 'password123'
                });

            // Try to create with same username
            const response = await request(app)
                .post('/users/create')
                .send({
                    username: 'duplicateuser',
                    email: 'email2@example.com',
                    password: 'password123',
                    confirmPassword: 'password123'
                });

            expect(response.status).toBe(201);
            expect(response.body.data.userInsertResult.isSuccess).toBe(false);
            expect(response.body.data.userInsertResult.message).toContain('already');
        });

        test('should reject invalid email', async () => {
            const response = await request(app)
                .post('/users/create')
                .send({
                    username: 'testuser',
                    email: 'not-an-email',
                    password: 'password123',
                    confirmPassword: 'password123'
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });

        test('should reject short password', async () => {
            const response = await request(app)
                .post('/users/create')
                .send({
                    username: 'testuser',
                    email: 'test@example.com',
                    password: '123',  // Too short (less than 8 chars)
                    confirmPassword: '123'
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });

        test('should reject mismatched passwords', async () => {
            const response = await request(app)
                .post('/users/create')
                .send({
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'password123',
                    confirmPassword: 'password456'  // Doesn't match
                });

            // Validation should fail with 400
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });
    });

    describe('POST /login - User Login', () => {
        beforeEach(async () => {
            // Create a user for login tests
            await request(app)
                .post('/users/create')
                .send({
                    username: 'logintest',
                    email: 'login@example.com',
                    password: 'password123',
                    confirmPassword: 'password123'
                });
        });

        test('should return JWT token on valid login', async () => {
            const response = await request(app)
                .post('/login')
                .send({
                    username: 'logintest',
                    password: 'password123'
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.token).toBeDefined();
            expect(typeof response.body.data.token).toBe('string');
        });

        test('should reject invalid password', async () => {
            const response = await request(app)
                .post('/login')
                .send({
                    username: 'logintest',
                    password: 'wrongpassword'
                });

            // Passport returns 401 when authentication fails
            expect(response.status).toBe(401);
        });

        test('should reject non-existent user', async () => {
            const response = await request(app)
                .post('/login')
                .send({
                    username: 'nonexistent',
                    password: 'password123'
                });

            expect(response.status).toBe(401);
        });

        /*test('should reject login with email instead of username', async () => {
            // Your API uses username, not email
            const response = await request(app)
                .post('/login')
                .send({
                    username: 'login@example.com',  // Email instead of username
                    password: 'password123'
                });

            // Should fail because email is not a valid username
            expect(response.status).toBe(401);
        }); */
    });

    describe('Protected Routes - Authentication', () => {
        let token;

        beforeEach(async () => {
            // Create and login a user
            await request(app)
                .post('/users/create')
                .send({
                    username: 'authtest',
                    email: 'auth@example.com',
                    password: 'password123',
                    confirmPassword: 'password123'
                });

            const loginResponse = await request(app)
                .post('/login')
                .send({
                    username: 'authtest',
                    password: 'password123'
                });

            token = loginResponse.body.data.token;
        });

        test('should accept request with valid token', async () => {
            const response = await request(app)
                .get('/')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

        test('should reject request with invalid token', async () => {
            const response = await request(app)
                .get('/')
                .set('Authorization', 'Bearer invalid_token_here');

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });

        test('should reject request without token', async () => {
            const response = await request(app)
                .get('/');

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });
    });
});
