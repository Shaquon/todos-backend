const uuid = require('uuid');

const DUMMY_USERS = [
    {
        id: 'u1',
        name: 'Shaquon',
        email: 'shaqon@gmail.com',
        password: 'test'
    }
]

const getUsers = (req, res, next) => {

}

const signup = (req, res, next) => {
    const { name, email, passowrd } = req.body;

    res.json({ user: DUMMY_USERS });
}

const login = (req, res, next) => {

}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;