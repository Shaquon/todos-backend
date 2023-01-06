const DUMMY_TODOS = [
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

const HttpError = require('../models/http-errors');

const getTodoByTodoId = (req, res, next) => {
    console.log('GET Request in Todos route - get todo by tid');
    const todoId = req.params.todoId;
    const todo = DUMMY_TODOS.find((t) => {
        return t.id === todoId;
    });

    if (!todo) {
        return next(new HttpError('Could not find a todo or provided todo id', 404));
    }

    res.json(todo);
};

const getTodosByUserId = (req, res, next) => {
    console.log('GET Request in Todos route - get todo by uid');
    const userId = req.params.userId;

    const todo = DUMMY_TODOS.filter((u) => {
        return u.creatorId === userId;
    });

    if (!todo) {
        if (!todo) {
            return next(new HttpError('Could not find a todo or provided user id', 404));
        }
    }

    res.json(todo);
}

const createTodo = (req, res, next) => {
    const { title, description, dueDate, creatorId } = req.body;

    const createdTodo = {
        title,
        description,
        dueDate,
        creatorId
    }

    DUMMY_TODOS.push(createdTodo);

    res.status(201).json({ todo: createdTodo });
}

exports.getTodoByTodoId = getTodoByTodoId;
exports.getTodosByUserId = getTodosByUserId;
exports.createTodo = createTodo;