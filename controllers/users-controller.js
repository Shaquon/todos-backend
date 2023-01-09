const uuid = require('uuid');
const HttpError = require('../models/http-errors')
const { validationResult } = require('express-validator');
const user = require('../models/user');

const DUMMY_USERS = [
    {
        id: 'u1',
        name: 'Shaquon',
        email: 'shaqon@gmail.com',
        password: 'test'
    },
    {
        id: 'u2',
        name: 'spacey',
        email: 'spacey@gmail.com',
        password: 'test2'
    }
]

const getUsers = (req, res, next) => {
    res.json({ users: DUMMY_USERS })
};

const signup = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new HttpError('invalid inputs passed. ', 422));
    }

    const { name, email, password } = req.body;
    let existingUser;

    try {
        existingUser = await user.findOne({ email: email });
    } catch (err) {
        return next(new HttpError('Signing up failed. Please try again.', 500));
    }

    if (existingUser) {
        const error = new HttpError('User exists already, please login instead.', 422);
        return next(error);
    }

    const createdUser = new user({
        name,
        email,
        password,
        todos: []
    });
    try {
        await createdUser.save();
    } catch (err) {
        return next(new HttpError('Signing up failed. Please try again.', 500));
    }

    res.status(201).json({ user: createdUser.toObject({ getters: true }) })
};

const login = (req, res, next) => {
    const { email, password } = req.body;

    const identifiedUser = DUMMY_USERS.find(u => {
        return u.emial === email
    })
    if (!identifiedUser || identifiedUser.password !== password) {
        next(new HttpError('Could not identify user. Credentials are wrong.', 401));
    }

    res.json({ message: 'logged in' });

}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;