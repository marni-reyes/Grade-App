'use strict';
var express = require('express');
var router = express.Router();

/* GET Grades page. */
router.get('/uploadText', function (req, res) {
    res.render('uploadText', { title: 'Upload Text' });
});

module.exports = router;
