const express = require('express');
const { check } = require('express-validator');
const checkAuth = require('../middleware/check-auth');
const todosController = require('../controllers/todos-controller');

const router = express.Router();

router.use(checkAuth);

router.get('/:todoId', todosController.getTodoById);

router.get('/user/:userId', todosController.getTodosByUserId);

router.post('/', [check('title').not().isEmpty(), check('description').isLength({ min: 5 })], todosController.createTodo);

router.patch('/:todoId', [check('title').not().isEmpty(), check('description').isLength({ min: 5 })], todosController.updateTodo);

router.delete('/:todoId', todosController.deleteTodo);

module.exports = router;
