const express = require('express');

const todosController = require('../controllers/todos-controller');

const router = express.Router();

router.get('/:todoId', todosController.getTodoById);

router.get('/user/:userId', todosController.getTodosByUserId);

router.post('/', todosController.createTodo);

router.patch('/:todoId', todosController.updateTodo);

router.delete('/:todoId', todosController.deleteTodo);

module.exports = router;
