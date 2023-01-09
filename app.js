const express = require('express');
const bodyParser = require('body-parser');
const todosRoutes = require('./routes/todos-routes');
const HttpError = require('./models/http-errors');
const usersRoutes = require('./routes/users-routes');
const mongoose = require('mongoose');

const app = express();

// MiddleWare
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
    next()
})

app.use('/api/todos', todosRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    return next(error)
})

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }

    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occured!' })
});

mongoose
    .set('strictQuery', true)
    .connect('mongodb+srv://shaquon01:Newcolor18!@cluster0.5z0p2cj.mongodb.net/todos?retryWrites=true&w=majority')
    .then(() => {
        app.listen(5050);
    })
    .catch((err) => {
        console.log(err)
    })
