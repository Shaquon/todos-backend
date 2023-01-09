const mongoose = require('mongoose');
const HttpError = require('../models/http-errors');
const { validationResult } = require('express-validator');
const Todo = require('../models/todo');
const User = require('../models/user');

const getTodoById = async (req, res, next) => {
    const todoId = req.params.todoId;
    let todo;

    try {
        todo = await Todo.findById(todoId)
    } catch (err) {
        console.log(err);
        return next(new HttpError("Something went wrong. Could't find todo.", 500));
    }

    if (!todo) {
        return next(new HttpError('Could not find a todo for provided todo id', 404));
    }

    res.json({ todo: todo.toObject({ getters: true }) });
};

const getTodosByUserId = async (req, res, next) => {
    const userId = req.params.userId;

    let todos;

    try {
        todos = await Todo.find({ creatorId: userId })
        console.log('todos', todos);
    } catch (err) {
        console.log('err: ', err);
        return next(new HttpError('Fetching todos failed. Please try again.', 500));
    }


    if (!todos || todos.length === 0) {
        return next(new HttpError('Could not find a todos for provided user id', 404));
    }

    res.json({ todos: todos.map(todo => todo.toObject({ getter: true })) });
};

const createTodo = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty) {
        console.log(errors);
        throw new HttpError('invalid inputs passed. ', 422);
    };

    let { title, description, complete, creatorId } = req.body;

    const createdTodo = new Todo({
        title,
        description,
        complete,
        creatorId,
        isDeleted: false
    });

    let user;

    try {
        user = await User.findById(creatorId);
    } catch (err) {
        return next('Creating todo failed. Please try again.', 500)
    }

    if (!user) {
        return next(new HttpError('Could not find user for provided id.', 404));
    }

    console.log('User: ', user);

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdTodo.save({ session: sess });
        user.todos.push(createdTodo);
        await user.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        console.log("error: ", err);
        const error = new HttpError('Creating todo failed. Please try again.', 500);
        return next(error);
    }

    res.status(201).json({ todo: createdTodo });
}

const updateTodo = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty) {
        console.log(errors);
        throw new HttpError('invalid inputs passed. ', 422);
    }

    const { title, description, complete } = req.body;
    const todoId = req.params.todoId;

    let todo;

    try {
        todo = await Todo.findById(todoId);
    } catch (err) {
        console.log(err);
        return next(new HttpError('Something went wrong. Could not update todo.', 500))
    }

    todo.title = title;
    todo.description = description;
    todo.comeplete = complete;

    try {
        await todo.save();
    } catch (err) {
        console.log(err);
        return next(new HttpError('Something went wrong. Could not update todo.', 500))
    };

    res.status(200).json({ todo: todo.toObject({ getters: true }) });
};

const deleteTodo = async (req, res, next) => {
    const todoId = req.params.todoId;

    let todo;
    try {
        todo = await Todo.findById(todoId).populate('creatorId');
    } catch (err) {
        console.log(err);
        return next(new HttpError('Something went wrong. Could not delete todo.'), 500)
    };

    if (!todo) {
        return next(new HttpError('Could not find todo with this id'), 404);
    }

    try {
        todo.isDeleted = true;
        await todo.save();
    } catch (err) {
        console.log(err);
        return next(new HttpError('Something went wrong. Could not delete todo.', 500));
    };

    res.status(200).json({ message: 'Deleted todo' });
};

exports.getTodoById = getTodoById;
exports.getTodosByUserId = getTodosByUserId;
exports.createTodo = createTodo;
exports.updateTodo = updateTodo;
exports.deleteTodo = deleteTodo;