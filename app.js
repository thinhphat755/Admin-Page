var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require ('express-handlebars');

var indexRouter = require('./routes/index');
var homeRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var addCourseRouter = require('./routes/add-course');
var allCoursesRouter = require('./routes/all-courses');
var allStudentsRouter = require('./routes/all-students');
var analyticsRouter = require('./routes/analytics');
var dataTableRouter = require('./routes/data-table');
var editCourseRouter = require('./routes/edit-course');
var editStudentRouter = require('./routes/edit-student');
var studentProfileRouter = require('./routes/student-profile');

var app = express();

// view engine setup
app.engine('hbs',hbs({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layouts/'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static('public'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/index', homeRouter);
app.use('/users', usersRouter);
app.use('/add-course', addCourseRouter);
app.use('/all-courses', allCoursesRouter);
app.use('/all-students', allStudentsRouter);
app.use('/analytics', analyticsRouter);
app.use('/data-table', dataTableRouter);
app.use('/edit-course', editCourseRouter);
app.use('/edit-student', editStudentRouter);
app.use('/student-profile', studentProfileRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
