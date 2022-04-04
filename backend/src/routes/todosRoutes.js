const express = require('express');
const router = express.Router();
const todosController = require('../controllers/todosController');

// Create
router.post('/create', todosController.create);
//Read
router.get('/read/:userId', todosController.read);
//Update
router.put('/update/:id', todosController.update);
//Delete
router.delete('/delete/:id', todosController.delete);

module.exports = router;
