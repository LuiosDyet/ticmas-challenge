const request = require('supertest');
const app = require('../app');

describe('Register User', () => {
    it('should return a status 400 without user name or password', async () => {
        const response = await request(app).post('/user/register').send({
            username: '',
            password: '',
        });
        expect(response.statusCode).toBe(400);
    });
    it('should return a status code 201 and return Tokens', async () => {
        const response = await request(app).post('/user/register').send({
            username: 'luios',
            password: '123456',
        });
        expect(response.statusCode).toBe(201);
        expect(response.header['set-cookie'][0]).toContain('refreshToken');
        expect(response.body).toHaveProperty('accessToken');
        expect(response.body).toHaveProperty('userId');
    });
    it('should return a status code 409 and return message if user exist', async () => {
        const response = await request(app).post('/user/register').send({
            username: 'luios',
            password: '123456',
        });
        expect(response.statusCode).toBe(409);
        expect(response.body).toHaveProperty('message');
    });
});

describe('Login User', () => {
    it('should return a status code 400 without user name or password', async () => {
        const response = await request(app).post('/user/login').send({
            username: '',
            password: '',
        });
        expect(response.statusCode).toBe(400);
    });
    it('should return a status code 400 if user not exist', async () => {
        const response = await request(app).post('/user/login').send({
            username: 'another',
            password: '123456',
        });
        expect(response.statusCode).toBe(400);
    });
    it('should return a status code 400 if password is wrong', async () => {
        const response = await request(app).post('/user/login').send({
            username: 'luios',
            password: 'wrong',
        });
        expect(response.statusCode).toBe(400);
    });

    it('should return a status code 200 and return Tokens', async () => {
        const response = await request(app).post('/user/login').send({
            username: 'luios',
            password: '123456',
        });
        expect(response.statusCode).toBe(200);
        expect(response.header['set-cookie'][0]).toContain('refreshToken');
        expect(response.body).toHaveProperty('accessToken');
        expect(response.body).toHaveProperty('userId');
    });
});

describe('Logout User', () => {
    it('should return a status code 200 ', async () => {
        //Test clearing of cookie in frontend
        const response = await request(app).get('/user/logout');
        expect(response.statusCode).toBe(200);
    });
});

describe('Refresh Token', () => {
    it('should return a status code 401 if no cookie is send', async () => {
        const response = await request(app).get('/user/refreshToken');
        expect(response.statusCode).toBe(401);
    });
    it('should return a status code 403 if cookie is invalid', async () => {
        const response = await request(app)
            .get('/user/refreshToken')
            .set('Cookie', ['refreshToken=invalid']);
        expect(response.statusCode).toBe(403);
    });
    it('should return a status code 200 and return accessToken', async () => {
        const response = await request(app).post('/user/login').send({
            username: 'luios',
            password: '123456',
        });
        const refreshToken = response.header['set-cookie'][0];
        const response2 = await request(app)
            .get('/user/refreshToken')
            .set('Cookie', [refreshToken]);
        expect(response2.statusCode).toBe(200);
    });
});
