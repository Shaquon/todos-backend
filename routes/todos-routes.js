const express = require('express');

const router = express.Router();

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
    }
]

router.get('/:todoId', (req, res, next) => {
    console.log('GET Request in Todos route - get todo by tid');
    const todoId = req.params.todoId;
    const todo = DUMMY_TODOS.find((t) => {
        return t.id === todoId;
    });

    if (!todo) {
        const error = new Error('Could not find a todo or provided todo id');
        error.code = 404;
        return next(error);
    }

    res.json(todo);
});

router.get('/user/:userId', (req, res, next) => {
    console.log('GET Request in Todos route - get todo by uid');
    const userId = req.params.userId;

    const todo = DUMMY_TODOS.find((u) => {
        return u.creatorId === userId;
    });

    if (!todo) {
        if (!todo) {
            const error = new Error('Could not find a todo or provided user id');
            error.code = 404;
            return next(error);
        }
    }

    res.json(todo);
});

module.exports = router;
