const request = require('supertest');
const { createPool } = require('mysql2/promise');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const app = require('../app');
require('dotenv').config();

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

    mongoConnection = await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    db = mongoose.connection;
    await db.createCollection('test_todos');
});

const user = async () => {
    const response = await request(app).post('/user/login').send({
        username: 'luios',
        password: '123456',
    });
    return response.body;
};

const todoMock = async () => {
    const { userId, accessToken } = await user();
    await request(app).post('/todos/create').send({
        userId,
        description: 'Test Description',
    });
    const response = await request(app)
        .get(`/todos/read/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`);
    return response.body;
};

describe('Create Todo ', () => {
    it('should return a status code 201 and return Todo', async () => {
        const { accessToken, userId } = await user();
        const response = await request(app)
            .post('/todos/create')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                userId,
                description: 'test',
            });
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('todo');
    });
});

describe('Read Todo ', () => {
    it('should return a status code 200 and return Todo', async () => {
        const { accessToken, userId } = await user();
        const response = await request(app)
            .get(`/todos/read/${userId}`)
            .set('Authorization', `Bearer ${accessToken}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('todos');
    });
});

describe('Update Todo ', () => {
    it('should return a status code 200 and return Todo', async () => {
        const { todos } = await todoMock();
        const { accessToken, userId } = await user();
        const response = await request(app)
            .put(`/todos/update/${todos[0]._id}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                userId,
                description: 'test',
            });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.todo.completed).toBe(true);
    });
});

describe('Delete Todo ', () => {
    it('should return a status code 200 and return Todo', async () => {
        const { todos } = await todoMock();
        const { accessToken, userId } = await user();
        const response = await request(app)
            .delete(`/todos/delete/${todos[0]._id}`)
            .set('Authorization', `Bearer ${accessToken}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message');
        // Check Database if todo is deleted
        const response2 = await request(app)
            .get(`/todos/read/${userId}`)
            .set('Authorization', `Bearer ${accessToken}`);
        expect(response2.body.todos.length).toBe(0);
    });
});

afterAll(async () => {
    await connection.query('DROP TABLE users');
    await connection.end();
    const collection = 'test_todos';
    await db.dropCollection(collection);
    await db.close();
});
