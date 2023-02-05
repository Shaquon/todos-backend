const HttpError = require('../models/http-errors');
const { validationResult } = require('express-validator');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const getUser = async (req, res, next) => {
    const userId = req.params.userId;
    let user;

    try {
        user = await User.findById(userId);
    } catch (err) {
        console.log('Error:', err);
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
        console.log('Error:', err);
        return next(new HttpError('Signing up failed. Please try again.', 500));
    }

    if (existingUser) {
        const error = new HttpError('User exists already, please login instead.', 422);
        return next(error);
    }

    let hashedPassword;

    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        console.log('Error:', err);
        const error = new HttpError('Could not create user, please try again.', 500);
        return next(error);
    }

    const createdUser = new User({
        name,
        email,
        password: hashedPassword,
        todos: []
    })

    try {
        await createdUser.save();
        console.log('createdUser saved!');
    } catch (err) {
        console.log(err);
        return next(new HttpError('Signing up failed. Please try again.', 500));
    }

    let token;
    try {
        token = jwt.sign(
            { userId: createdUser.id, email: createdUser.email },
            process.env.JWT_KEY,
            { expiresIn: '1h' }
        );
        console.log('token created!');
    } catch (err) {
        console.log('Error:', err);
        return next(new HttpError('Signing up failed. Please try again.', 500));
    }

    res.status(201).json({ userId: createdUser.id, email: createdUser.email, token: token });
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;

    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        console.log('Error:', err);
        return next(new HttpError('Logging in failed. Please try again.', 500));
    }

    if (!existingUser) {
        console.log('no existing user');
        return next(new HttpError('Invalid credentials, could not log you in.'));
    }

    let isValidPassword = false;

    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
        console.log('Error:', err);
        const error = new HttpError('Could not log you in, please check your credentials and try again.');
        return next(error);
    }

    if (!isValidPassword) {
        console.log('is not a valid password');
        const error = new HttpError('Could not log you in, please check your credentials and try again.');
        return next(error);
    }

    let token;

    try {
        token = jwt.sign(
            { userId: existingUser.id, email: email },
            process.env.JWT_KEY,
            { expiresIn: '1h' }
        );
    } catch (err) {
        console.log('Error:', err);
        return next(new HttpError('Logging in failed. Please try again.', 500));
    }

    res.json({ userId: existingUser.id, email: existingUser.email, token: token })
}

exports.getUser = getUser;
exports.signup = signup;
exports.login = login;