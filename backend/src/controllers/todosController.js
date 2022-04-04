const { Todos } = require('../model/data');
const { v4: uuidv4 } = require('uuid');

const todosController = {
    create: (req, res) => {
        const { description, userId } = req.body;
        if (!description)
            return res
                .status(400)
                .json({ message: 'Es necesario  una descripción' });

        const todo = {
            id: uuidv4(),
            userId,
            description,
            completed: false,
        };
        Todos.push(todo);
        console.log('Todos', Todos);
        res.status(201).json({
            message: `Todo ${todo.description.slice(0, 20)}... creado`,
            todo,
        });
    },
    read: (req, res) => {
        const { userId } = req.params;
        const todos = Todos.filter((todo) => todo.userId === userId);
        res.status(200).json({
            todos,
        });
    },
    update: (req, res) => {
        const { id } = req.params;

        const todo = Todos.find((todo) => todo.id === id);
        todo.completed = !todo.completed;
        console.log('Todos', Todos);
        res.status(200).json({
            message: `Todo ${todo.description.slice(0, 20)}... actualizado`,
        });
    },
    delete: (req, res) => {
        const { id } = req.params;
        const todo = Todos.find((todo) => todo.id === id);
        Todos.splice(Todos.indexOf(todo), 1);
        console.log('Todos', Todos);
        res.status(200).json({
            message: `Todo ${todo.description.slice(0, 20)}... eliminado`,
        });
    },
};

module.exports = todosController;
