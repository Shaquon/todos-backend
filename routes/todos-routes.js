const express = require('express');

const todosController = require('../controllers/todos-controller');

const router = express.Router();

router.get('/:todoId', todosController.getTodoByTodoId);

router.get('/user/:userId', todosController.getTodosByUserId);

router.post('/', todosController.createTodo)

module.exports = router;
