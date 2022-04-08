const request = require('supertest');
const { createPool } = require('mysql2/promise');
const bcrypt = require('bcrypt');
const app = require('../app');

describe('Register User', () => {
    let connection;

    beforeAll(async () => {
        const createTable = `CREATE TABLE IF NOT EXISTS users (
            id char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
            username varchar(255) DEFAULT NULL,
            password varchar(255) DEFAULT NULL,
            refreshToken varchar(255) DEFAULT NULL,
            createdAt datetime NOT NULL,
            updatedAt datetime NOT NULL,
            PRIMARY KEY (id)
        )`;
        connection = await createPool({
            host: '127.0.0.1',
            user: 'root',
            password: null,
            database: 'test',
            port: process.env.DB_PORT,
        });
        await connection.query(createTable);
    });

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
    afterAll(async () => {
        await connection.query('DROP TABLE users');
        await connection.end();
    });
});

describe('Login User', () => {
    let connection;

    beforeAll(async () => {
        const createTable = `CREATE TABLE IF NOT EXISTS users (
            id char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
            username varchar(255) DEFAULT NULL,
            password varchar(255) DEFAULT NULL,
            refreshToken varchar(255) DEFAULT NULL,
            createdAt datetime NOT NULL,
            updatedAt datetime NOT NULL,
            PRIMARY KEY (id)
        )`;
        connection = await createPool({
            host: '127.0.0.1',
            user: 'root',
            password: null,
            database: 'test',
            port: process.env.DB_PORT,
        });
        await connection.query(createTable);
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync('123456', salt);
        const createUser = `insert
	into
	\`users\`
        values ('7971e668-bffb-4c77-9d0e-c26aaae4a0a6',
        'luios',
        '$2b$10$8rOwFXm3wCiF9pP0e/NJueVytTeVfEiOOIhUzXIf/yQpCsOe3ueEa',
        '${hashPassword}',
        '2022-04-07 10:14:15',
        '2022-04-07 10:15:05')`;
        await connection.query(createUser);
    });

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

    afterAll(async () => {
        await connection.query('DROP TABLE users');
        await connection.end();
    });
});

describe('Logout User', () => {
    let connection;

    beforeAll(async () => {
        const createTable = `CREATE TABLE IF NOT EXISTS users (
            id char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
            username varchar(255) DEFAULT NULL,
            password varchar(255) DEFAULT NULL,
            refreshToken varchar(255) DEFAULT NULL,
            createdAt datetime NOT NULL,
            updatedAt datetime NOT NULL,
            PRIMARY KEY (id)
        )`;
        connection = await createPool({
            host: '127.0.0.1',
            user: 'root',
            password: null,
            database: 'test',
            port: process.env.DB_PORT,
        });
        await connection.query(createTable);
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync('123456', salt);
        const createUser = `insert
	into
	\`users\`
        values ('7971e668-bffb-4c77-9d0e-c26aaae4a0a6',
        'luios',
        '$2b$10$8rOwFXm3wCiF9pP0e/NJueVytTeVfEiOOIhUzXIf/yQpCsOe3ueEa',
        '${hashPassword}',
        '2022-04-07 10:14:15',
        '2022-04-07 10:15:05')`;
        await connection.query(createUser);
    });

    it('should return a status code 200 ', async () => {
        // Test clearing of cookie in frontend
        const response = await request(app).get(
            '/user/logout/7971e668-bffb-4c77-9d0e-c26aaae4a0a6',
        );
        expect(response.statusCode).toBe(200);
    });
    afterAll(async () => {
        await connection.query('DROP TABLE users');
        await connection.end();
    });
});

describe('Refresh Token', () => {
    beforeAll(async () => {
        const createTable = `CREATE TABLE IF NOT EXISTS users (
            id char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
            username varchar(255) DEFAULT NULL,
            password varchar(255) DEFAULT NULL,
            refreshToken varchar(255) DEFAULT NULL,
            createdAt datetime NOT NULL,
            updatedAt datetime NOT NULL,
            PRIMARY KEY (id)
        )`;
        connection = await createPool({
            host: '127.0.0.1',
            user: 'root',
            password: null,
            database: 'test',
            port: process.env.DB_PORT,
        });
        await connection.query(createTable);
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync('123456', salt);
        const createUser = `insert
	into
	\`users\`
        values ('7971e668-bffb-4c77-9d0e-c26aaae4a0a6',
        'luios',
        '$2b$10$8rOwFXm3wCiF9pP0e/NJueVytTeVfEiOOIhUzXIf/yQpCsOe3ueEa',
        '${hashPassword}',
        '2022-04-07 10:14:15',
        '2022-04-07 10:15:05')`;
        await connection.query(createUser);
    });

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

    afterAll(async () => {
        await connection.query('DROP TABLE users');
        await connection.end();
    });
});
