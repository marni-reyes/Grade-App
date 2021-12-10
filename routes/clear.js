'use strict';
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/Clear', function (req, res) {
    res.render('clear', { title: 'Data has been cleared.' });
});

module.exports = router;
