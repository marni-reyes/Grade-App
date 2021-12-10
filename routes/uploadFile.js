'use strict';
var express = require('express');
var router = express.Router();

/* GET Grades page. */
router.get('/uploadFile', function (req, res) {
    res.render('uploadFile', { title: 'Upload File' });
});

module.exports = router;
