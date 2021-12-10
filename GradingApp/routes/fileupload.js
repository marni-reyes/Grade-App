'use strict';
var express = require('express');
var router = express.Router();

/* GET File Upload page. */
router.get('/fileupload', function (req, res) {
    res.render('fileupload', { title: 'Upload File Done' });
});

module.exports = router;
