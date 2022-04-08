const Todo = require('../databasemdb/models/todos');
// const sanitize = require('../lib/sanitizer');

const todosController = {
    create: async (req, res) => {
        const { userId } = req.body;
        const { description } = req.body;
        // const reg = /[&<>"'/]/gi;
        // if (reg.test(description)) {
        //     return res.status(400).json({
        //         message: 'La tarea no puede contener caracteres especiales.',
        //     });
        // }
        // description = sanitize(description.trim());

        if (!description) {
            return res
                .status(400)
                .json({ message: 'Es necesario  una descripción' });
        }

        const newTodo = {
            userId,
            description,
        };
        const todo = await Todo.create(newTodo);
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
