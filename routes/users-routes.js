const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
    console.log('GET Request in Todos route');
    res.json({ message: 'Users route works!' });
});

module.exports = router;