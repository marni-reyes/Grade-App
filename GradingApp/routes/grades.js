'use strict';
var express = require('express');
var router = express.Router();

/* GET Grades page. */
router.get('/grades', function (req, res) {
    res.render('grades', { title: 'Grades' });
});

module.exports = router;
