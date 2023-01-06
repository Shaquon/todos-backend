const uuid = require('uuid');
const HttpError = require('../models/http-errors')
const { validationResult } = require('express-validator');

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
}

const signup = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty) {
        console.log(errors);
        throw new HttpError('invalid inputs passed. ', 422);
    }
    
    const { name, email, passowrd } = req.body;
    hasUser = DUMMY_USERS.find((u) => u.email === email)
    if (hasUser) {
        throw new HttpError('Could not create user, email already exists.', 422);
    }
    const createdUser = {
        id: uuid.v4(),
        name,
        email,
        passowrd
    }

    DUMMY_USERS.push(createdUser);

    res.status(201).json({ user: createdUser })
}

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