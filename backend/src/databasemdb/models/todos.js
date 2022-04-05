const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new Schema({
    description: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    completed: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model('Todo', todoSchema);
