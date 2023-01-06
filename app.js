const express = require('express');
const bodyParser = require('body-parser');
const todosRoutes = require('./routes/todos-routes');
const HttpError = require('./models/http-errors');
const usersRoutes = require('./routes/users-routes');
const app = express();

// MiddleWare
app.use(bodyParser.json());
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

app.listen(5050);
