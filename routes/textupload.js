'use strict';
var express = require('express');
var router = express.Router();

/* GET File Upload page. */
router.get('/textupload', function (req, res) {
    res.render('textupload', { title: 'Upload Text Done' });
});

module.exports = router;
