const HttpError = require('../models/http-errors')
const { validationResult } = require('express-validator');
const User = require('../models/user');


const getUser = async (req, res, next) => {
    const userId = req.params.userId;
    let user;

    try {
        user = await User.findById(userId);
    } catch (err) {
        return next(new HttpError("Something went wrong. Couldn't find user.", 500))
    };

    if (!user) {
        return next(new HttpError('Could not find user by provided id', 404))
    };

    res.json({ user: user.toObject({ getters: true }) })
};

const signup = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new HttpError('invalid inputs passed. ', 422));
    }

    const { name, email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        return next(new HttpError('Signing up failed. Please try again.', 500));
    }

    if (existingUser) {
        const error = new HttpError('User exists already, please login instead.', 422);
        return next(error);
    }

    const createdUser = new User({
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

const login = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;

    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        return next(new HttpError('Logging in failed. Please try again.', 500));
    }

    // console.log("existing user: ", existingUser);

    if (!existingUser || existingUser.password !== password) {
        console.log("inside error block")
        return next(new HttpError('Invalid credentials, could not log you in.'));
    }

    res.json({ message: 'Logged in!', user: existingUser.toObject({ getters: true }) })
}

exports.getUser = getUser;
exports.signup = signup;
exports.login = login;