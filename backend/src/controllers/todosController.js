const Todo = require('../databasemdb/models/todos');
const { v4: uuidv4 } = require('uuid');

const todosController = {
    create: async (req, res) => {
        const { description, userId } = req.body;
        if (!description)
            return res
                .status(400)
                .json({ message: 'Es necesario  una descripción' });

        const newTodo = {
            userId,
            description,
        };
        const todo = await Todo.create(newTodo);
        console.log('todo', todo._id);
        res.status(201).json({
            message: `Todo ${todo.description.slice(0, 20)}... creado`,
            todo,
        });
    },
    read: async (req, res) => {
        const { userId } = req.params;
        const todos = await Todo.find({ userId });
        res.status(200).json({
            todos,
        });
    },
    update: async (req, res) => {
        const { id } = req.params;

        const todo = await Todo.findById(id);
        todo.completed = !todo.completed;
        await todo.save();
        res.status(200).json({
            message: `Todo ${todo.description.slice(0, 20)}... actualizado`,
            todo,
        });
    },
    delete: async (req, res) => {
        const { id } = req.params;
        const todo = await Todo.findByIdAndDelete(id);

        res.status(200).json({
            message: `Todo ${todo.description.slice(0, 20)}... eliminado`,
        });
    },
};

module.exports = todosController;
