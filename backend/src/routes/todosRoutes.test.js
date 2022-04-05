const request = require('supertest');
const app = require('../app');

const user = async () => {
    await request(app).post('/user/register').send({
        username: 'luios',
        password: '123456',
    });
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
            .put(`/todos/update/${todos[0].id}`)
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
            .delete(`/todos/delete/${todos[0].id}`)
            .set('Authorization', `Bearer ${accessToken}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message');
        //Check Database if todo is deleted
        const response2 = await request(app)
            .get(`/todos/read/${userId}`)
            .set('Authorization', `Bearer ${accessToken}`);
        expect(response2.body.todos.length).toBe(0);
    });
});
