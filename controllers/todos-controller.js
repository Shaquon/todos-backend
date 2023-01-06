const uuid = require('uuid');
const HttpError = require('../models/http-errors');
const { validationResult } = require('express-validator');

let DUMMY_TODOS = [
    {
        id: 't1',
        title: 'do the laundry',
        description: 'I need to do the laundry today',
        dueDate: '01/20/2023',
        creatorId: 'u1'
    },
    {
        id: 't2',
        title: 'do my HW',
        description: 'I need to do my hw today',
        dueDate: '01/20/2023',
        creatorId: 'u2'
    },
    {
        id: 't3',
        title: 'do the dishes',
        description: 'I need to do the dishes today',
        dueDate: '01/20/2023',
        creatorId: 'u2'
    }
];

const getTodoById = (req, res, next) => {
    console.log('GET Request in Todos route - get todo by tid');
    const todoId = req.params.todoId;
    const todo = DUMMY_TODOS.find((t) => {
        return t.id === todoId;
    });

    if (!todo) {
        return next(new HttpError('Could not find a todo for provided todo id', 404));
    }

    res.json({ todo });
};

const getTodosByUserId = (req, res, next) => {
    console.log('GET Request in Todos route - get todo by uid');
    const userId = req.params.userId;

    const todos = DUMMY_TODOS.filter((u) => {
        return u.creatorId === userId;
    });

    if (!todos || todos.length === 0) {
        return next(new HttpError('Could not find a todos for provided user id', 404));
    }

    res.json({ todos });
}

const createTodo = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty) {
        console.log(errors);
        throw new HttpError('invalid inputs passed. ', 422);
    }

    const { title, description, dueDate, creatorId } = req.body;
    const createdTodo = {
        id: uuid.v4(),
        title,
        description,
        dueDate,
        creatorId
    }

    DUMMY_TODOS.push(createdTodo);

    res.status(201).json({ todo: createdTodo });
}

const updateTodo = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty) {
        console.log(errors);
        throw new HttpError('invalid inputs passed. ', 422);
    }
    
    const { title, description, dueDate } = req.body;

    const todoId = req.params.todoId;

    const updatedTodo = { ...DUMMY_TODOS.find((t) => t.id === todoId) };
    const todoIndex = DUMMY_TODOS.findIndex(t => t.id === todoId);

    updatedTodo.title = title;
    updatedTodo.description = description;
    updatedTodo.dueDate = dueDate;

    DUMMY_TODOS[todoIndex] = updatedTodo;
    res.status(201).json({ todo: updatedTodo });
}
const deleteTodo = (req, res, next) => {
    const todoId = req.params.id;

    DUMMY_TODOS = DUMMY_TODOS.filter((t) => {
        return t.id === todoId;
    });
    res.status(200).json({ message: 'Deleted todo' })
}

exports.getTodoById = getTodoById;
exports.getTodosByUserId = getTodosByUserId;
exports.createTodo = createTodo;
exports.updateTodo = updateTodo;
exports.deleteTodo = deleteTodo;