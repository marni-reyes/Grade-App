'use strict';
var debug = require('debug')('my express app');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var formidable = require('formidable');
var fs = require('fs');


var routes = require('./routes/index');
var clear = require('./routes/clear');
var users = require('./routes/users');
var grades = require('./routes/grades');
var uploadFile = require('./routes/uploadFile');
var uploadText = require('./routes/uploadText');
var fileupload = require('./routes/fileupload');
var textupload = require('./routes/textupload');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/Clear', clear);
app.use('/users', users);
app.use('/grades', grades);
app.use('/uploadText', uploadText);
app.use('/uploadFile', uploadFile);
app.use('/fileupload', fileupload);
app.use('/textupload', textupload);

function getMySQLConnection() {
    return mysql.createConnection({
        host: "edukasyon-test.cerggtylvong.ap-southeast-1.rds.amazonaws.com", // Replace with your host name
        user: 'admin',      // Replace with your database username
        password: 'admin123',      // Replace with your database password
        database: 'edukasyon' // // Replace with your database Name
    });
}

function delayer(arg) {
    console.log(`arg was => ${arg}`);
}

app.get('/back', function (req, res) {

    res.render('index', { title: 'Welcome to Grading App!' });
});

app.post('/textupload', function (req, res) {
    var sql = '';
    var queries = [];
    var quarter = 0;
    var year = 0;
    var student = [];

    let current = new Date();
    let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
    let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
    let dateTime = cDate + ' ' + cTime;


    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var data = fields.texttoupload;
        const lines = data.split(/\r?\n/);
        // print all lines
        lines.forEach((line) => {
            var wordcount = 0;
            var quarterline = 0;
            var firstName = '';
            var lastName = '';
            var fullName = '';
            var type = '';
            var stud = {};
            var homework = [];
            var test = [];
            const linesplit = line.split(' ');
            linesplit.forEach((linesplitline) => {
                if ((wordcount == 0) && (linesplitline == 'Quarter' || linesplitline == 'quarter')) {
                    quarterline = 1;
                    wordcount = 1;
                    //res.write('Quarter: ');
                }
                else {
                    if (quarterline == 1) {
                        if (wordcount == 1) {
                            //res.write('Number: ');
                            quarter = parseInt(linesplitline.replace(',', ''));
                            //res.write(linesplitline.replace(',', '') + ' ');
                            wordcount = wordcount + 1;
                        }
                        else {
                            if (wordcount == 2) {
                                //res.write('Year: ');
                                year = parseInt(linesplitline);
                                //res.write(linesplitline + ' ');
                                wordcount = wordcount + 1;
                            }
                            else {
                                res.write('Error');
                                res.status(500).json({ "status_code": 500, "status_message": "File upload format failed." });
                                wordcount = wordcount + 1;
                            }
                        }
                    }
                    else {
                        if (wordcount == 0) {
                            if (isNaN(linesplitline)) {
                                //res.write('FirstName: ');
                                firstName = linesplitline;
                                //res.write(linesplitline + ' ');
                                wordcount = wordcount + 1;
                            }
                            else {
                                res.write('Error');
                                res.status(500).json({ "status_code": 500, "status_message": "File upload format failed." });
                                wordcount = wordcount + 1;
                            }
                        }
                        else {
                            if (wordcount == 1) {
                                if (isNaN(linesplitline)) {
                                    //res.write('LastName: ');
                                    if ((linesplitline == 'H') || (linesplitline == 'T')) {
                                        if (linesplitline == 'H') {
                                            type = 'H';
                                        }
                                        if (linesplitline == 'T') {
                                            type = 'T';
                                        }
                                        //res.write('Type: ' + linesplitline);
                                    }
                                    else {
                                        lastName = linesplitline;
                                    }
                                }
                                else {
                                    res.write('Error');
                                    res.status(500).json({ "status_code": 500, "status_message": "File upload format failed." });
                                }
                                //res.write(linesplitline + ' ');
                                wordcount = wordcount + 1;
                            }
                            else {
                                if ((linesplitline == 'H') || (linesplitline == 'T')) {
                                    if (linesplitline == 'H') {
                                        type = 'H';
                                    }
                                    if (linesplitline == 'T') {
                                        type = 'T';
                                    }
                                    //res.write('Type: ' + linesplitline);
                                }
                                else {
                                    if (type == 'H') {
                                        //res.write('wordcount: ' + wordcount + ' ');
                                        //res.write('H: ' + linesplitline + '\n');
                                        fullName = firstName + ' ' + lastName;
                                        var grade = [fullName, quarter, year, 'homework', linesplitline];
                                        //console.log(grade);

                                        homework.push(linesplitline);
                                    }
                                    if (type == 'T') {
                                        //res.write('wordcount: ' + wordcount + ' ');
                                        //res.write('T: ' + linesplitline + '\n');
                                        test.push(linesplitline);
                                    }
                                }
                                wordcount = wordcount + 1;
                            }
                        }
                    }
                }

            });

            fullName = firstName + ' ' + lastName;
            if (fullName.trim().length > 0) {
                //Show Student data
                stud = {
                    Name: fullName,
                    Quarter: quarter,
                    Year: year,
                    Homework: homework,
                    Test: test
                };
                student.push(stud);
            }
            //res.write('\n');
        });

        //console.log(util.inspect(student, { depth: null }));

        student.forEach((s) => {
            //res.write(s['Name'] + '\n');
            //res.write(s['Quarter'] + '\n');
            //res.write(s['Year'] + '\n');
            s['Homework'].forEach((h) => {
                //res.write(h + '\n');
                sql = "('" + s['Name'] + "'," + s['Quarter'] + "," + s['Year'] + ",'homework'," + h + ",'" + dateTime + "'" + ")";
                queries.push(sql);


                //res.write(sql + '\n');
            });
            s['Test'].forEach((t) => {
                //res.write(t + '\n');
                sql = "('" + s['Name'] + "'," + s['Quarter'] + "," + s['Year'] + ",'test'," + t + ",'" + dateTime + "'" + ")";
                queries.push(sql);
                //res.write(t + '\n');
            });
        });

        //console.log('queries');
        //console.log(queries);
        var sql1 = queries.join(',\n');

        sql1 = "INSERT INTO edukasyon.grades_raw (student_name, quarter, year, type, value,timestamp) VALUES \n" + sql1;
        //res.write(sql1 + '\n');
        //console.log('SQL1');
        //console.log(sql1);
        //res.send(sql1);
        
        var con = getMySQLConnection();
        con.connect();
        
        con.query(sql1, function (err, result, fields) {
            if (err) {
                res.send(err);
            } else {
                console.log("Records processed.");
            }
        });
        
        // Close the MySQL connection
        con.end();
    });

    res.render('index', { title: 'Text has been uploaded!' });

});

app.post('/fileupload', function (req, res) {
    var sql = '';
    var queries = [];

    let current = new Date();
    let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
    let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
    let dateTime = cDate + ' ' + cTime;

    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var oldpath = files.filetoupload.filepath;
        var testType = null;
        try {
            // read contents of the file
            const data = fs.readFileSync(oldpath, 'UTF-8');

            // split the contents by new line
            const lines = data.split(/\r?\n/);
            var quarter = 0;
            var year = 0;
            var student = [];

            // print all lines
            lines.forEach((line) => {
                var wordcount = 0;
                var quarterline = 0;
                var firstName = '';
                var lastName = '';
                var fullName = '';
                var type = '';
                var stud = {};
                var homework = [];
                var test = [];
                const linesplit = line.split(' ');
                linesplit.forEach((linesplitline) => {
                    if ((wordcount == 0) && (linesplitline == 'Quarter' || linesplitline == 'quarter')) {
                        quarterline = 1;
                        wordcount = 1;
                        //res.write('Quarter: ');
                    }
                    else {
                        if (quarterline == 1) {
                            if (wordcount == 1) {
                                //res.write('Number: ');
                                quarter = parseInt(linesplitline.replace(',', ''));
                                res.write(linesplitline.replace(',', '') + ' ');
                                wordcount = wordcount + 1;
                            }
                            else {
                                if (wordcount == 2) {
                                    //res.write('Year: ');
                                    year = parseInt(linesplitline);
                                    res.write(linesplitline + ' ');
                                    wordcount = wordcount + 1;
                                }
                                else {
                                    res.write('Error');
                                    res.status(500).json({ "status_code": 500, "status_message": "File upload format failed." });
                                    wordcount = wordcount + 1;
                                }
                            }
                        }
                        else {
                            if (wordcount == 0) {
                                if (isNaN(linesplitline)) {
                                    //res.write('FirstName: ');
                                    firstName = linesplitline;
                                    //res.write(linesplitline + ' ');
                                    wordcount = wordcount + 1;
                                }
                                else {
                                    res.write('Error');
                                    res.status(500).json({ "status_code": 500, "status_message": "File upload format failed." });
                                    wordcount = wordcount + 1;
                                }
                            }
                            else {
                                if (wordcount == 1) {
                                    if (isNaN(linesplitline)) {
                                        //res.write('LastName: ');
                                        if ((linesplitline == 'H') || (linesplitline == 'T')) {
                                            if (linesplitline == 'H') {
                                                type = 'H';
                                            }
                                            if (linesplitline == 'T') {
                                                type = 'T';
                                            }
                                            //res.write('Type: ' + linesplitline);
                                        }
                                        else {
                                            lastName = linesplitline;
                                        }
                                    }
                                    else {
                                        res.write('Error');
                                        res.status(500).json({ "status_code": 500, "status_message": "File upload format failed." });
                                    }
                                    //res.write(linesplitline + ' ');
                                    wordcount = wordcount + 1;
                                }
                                else {
                                    if ((linesplitline == 'H') || (linesplitline == 'T')) {
                                        if (linesplitline == 'H') {
                                            type = 'H';
                                        }
                                        if (linesplitline == 'T') {
                                            type = 'T';
                                        }
                                        //res.write('Type: ' + linesplitline);
                                    }
                                    else {
                                        if (type == 'H') {
                                            //res.write('wordcount: ' + wordcount + ' ');
                                            //res.write('H: ' + linesplitline + '\n');
                                            fullName = firstName + ' ' + lastName;
                                            var grade = [fullName, quarter, year, 'homework', linesplitline];
                                            //console.log(grade);

                                            homework.push(linesplitline);
                                        }
                                        if (type == 'T') {
                                            //res.write('wordcount: ' + wordcount + ' ');
                                            //res.write('T: ' + linesplitline + '\n');
                                            test.push(linesplitline);
                                        }
                                    }
                                    wordcount = wordcount + 1;
                                }
                            }
                        }
                    }

                });

                fullName = firstName + ' ' + lastName;
                if (fullName.trim().length > 0) {
                    //Show Student data
                    stud = {
                        Name: fullName,
                        Quarter: quarter,
                        Year: year,
                        Homework: homework,
                        Test: test
                    };
                    student.push(stud);
                }
                //res.write('\n');
            });

            //console.log(util.inspect(student, { depth: null }));

            student.forEach((s) => {
                //res.write(s['Name'] + '\n');
                //res.write(s['Quarter'] + '\n');
                //res.write(s['Year'] + '\n');
                s['Homework'].forEach((h) => {
                    //res.write(h + '\n');
                    sql = "('" + s['Name'] + "'," + s['Quarter'] + "," + s['Year'] + ",'homework'," + h + ",'" + dateTime + "'" + ")";
                    queries.push(sql);


                    //res.write(sql + '\n');
                });
                s['Test'].forEach((t) => {
                    //res.write(t + '\n');
                    sql = "('" + s['Name'] + "'," + s['Quarter'] + "," + s['Year'] + ",'test'," + t + ",'" + dateTime + "'" + ")";
                    queries.push(sql);
                    //res.write(t + '\n');
                });
            });


        } catch (err) {
            res.write(err);
        }
        //console.log('queries');
        //console.log(queries);

        var sql1 = queries.join(',\n');

        sql1 = "INSERT INTO edukasyon.grades_raw (student_name, quarter, year, type, value,timestamp) VALUES \n" + sql1;
        //res.write(sql1 + '\n');
        //console.log('SQL1');
        //console.log(sql1);

        var con5 = getMySQLConnection();
        con5.connect();

        con5.query(sql1, function (err, result, fields) {
            if (err) {
                //res.status(500).json({ "status_code": 500, "status_message": "internal server error" });
            } else {
                console.log("Records processed.");
            }
        });

        // Close the MySQL connection
        con5.end();
    });

    //put a drelay to be able to process the uploaded file
    setTimeout(delayer, 1500, 'funky');
    setTimeout(delayer, 1500, 'funky1');
    setTimeout(delayer, 1500, 'funky2');
    setTimeout(delayer, 1500, 'funky3');
    setTimeout(delayer, 1500, 'funky4');
    setTimeout(delayer, 1500, 'funky5');
    setTimeout(delayer, 1500, 'funky6');
    setTimeout(delayer, 1500, 'funky7');
    setTimeout(delayer, 1500, 'funky8');
    setTimeout(delayer, 1500, 'funky9');

    res.render('index', { title: 'File has been uploaded!' });

});

app.get('/Clear', function (req, res) {
    // Connect to MySQL database.
    var con7 = getMySQLConnection();
    con7.connect();
    // Do the query to get data.
    con7.query('CALL edukasyon.sp_clear_tables();', function (err, result, fields) {
        if (err) {
            res.status(500).json({ "status_code": 500, "status_message": "internal server error" });
        } else {
            res.render('clear');
        }
    });

    // Close the MySQL connection
    con7.end();
    
});


app.get('/uploadText', function (req, res) {
    res.render('uploadText');
});

app.get('/uploadFile', function (req, res) {
    res.render('uploadFile');
});

app.get('/grades', function (req, res) {
	// Connect to MySQL database.
    var con8 = getMySQLConnection();
    con8.connect();

	// Do the query to get data.
    con8.query('CALL edukasyon.sp_populate_tables();', function (err, result, fields) {
		if (err) {
			res.status(500).json({ "status_code": 500, "status_message": "internal server error" });
        } else {
            var rows = "";
            var curQuarter = 0;
            //console.log('StudentNames: ');
            //console.log(result.length);

            result = result[0];
            for (var i = 0; i < result.length; i++) {
                //console.log(i);
                if ((curQuarter !== result[i].quarter) && (result[i].quarter == 100)) {
                    //console.log('\nFinal Average:');
                    curQuarter = result[i].quarter;
                    rows = rows + '\n\nFinal Average:';
                }
                else {
                    if (curQuarter !== result[i].quarter) {
                        if (i > 0) {
                            rows = rows + '\n\nQuarter ' + result[i].quarter + ' Average:';
                        }
                        else {
                            rows = rows + 'Quarter ' + result[i].quarter + ' Average:';
                        }
                        //console.log('\nQuarter ' + result[i].quarter + ' Average:');

                        curQuarter = result[i].quarter;
                    }
                }
                //console.log(result[i].student_name + ' ' + result[i].grade);
                rows = rows + '\n' + result[i].student_name + ' ' + result[i].grade;
            }

            var gradeList = []
            var grades = rows.split('\n');

            for (var i = 0; i < grades.length; i++) {
                gradeList.push({ grades: grades[i] });
            }
            
            console.log('gradeList: ');
            console.log(gradeList);
            // Render grades.pug page using array
            res.render('grades', { "gradeList": gradeList });
		}
	});

	// Close the MySQL connection
    con8.end();

});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});
