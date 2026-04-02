import request from 'supertest';
import app from '../../app.js';
import { prisma } from '../../lib/prisma.js';

describe('Users', () => {
    let token;
    let userId;

    afterAll(async () => {
        await prisma.$disconnect();
    });

    beforeEach(async () => {
        await prisma.comment.deleteMany();
        await prisma.post.deleteMany();
        await prisma.user.deleteMany();

        const createResponse = await request(app)
            .post('/users/create')
            .send({
                username: 'usertest',
                email: 'user@example.com',
                password: 'password123',
                confirmPassword: 'password123'
            });

        userId = createResponse.body.data.userInsertResult.newUser.id;

        const loginResponse = await request(app)
            .post('/login')
            .send({
                username: 'usertest',
                password: 'password123'
            });

        token = loginResponse.body.data.token;
    });

    describe('GET /users - List Users', () => {
        test('should return list of users', async () => {
            const response = await request(app).get('/users');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data.users)).toBe(true);
        });
    });

    describe('GET /users/:userId - Get User Details', () => {
        test('should return user details when authenticated', async () => {
            const response = await request(app)
                .get(`/users/${userId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.userDetails.username).toBe('usertest');
        });

        test('should reject request without authentication', async () => {
            const response = await request(app)
                .get(`/users/${userId}`);

            expect(response.status).toBe(401);
        });
    });

    describe('PUT /users/:userId - Update User', () => {
        test('should update user when authenticated', async () => {
            const response = await request(app)
                .put(`/users/${userId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    displayName: 'Updated Name'
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

        test('should reject update without authentication', async () => {
            const response = await request(app)
                .put(`/users/${userId}`)
                .send({
                    displayName: 'Updated Name'
                });

            expect(response.status).toBe(401);
        }); 
    }); 
});