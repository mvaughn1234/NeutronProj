// const bodyParser = require('body-parser');
// const expressValidator = require('express-validator');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const socketio = require('socket.io');
const http = require('http');

// To satisfy error connecting to db
require('events').EventEmitter.prototype._maxListeners = 100;

// SocketIO Port
const genIoPort = 5001;
const analyzeIoPort = 5002;

// Routes to api
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const matDBRouter = require('./routes/api/v1/matDB');
const propsRouter = require('./routes/api/v1/setting');
const configRouter = require('./routes/api/v1/config');
const matRouter = require('./routes/api/v1/mat');
const energySetRouter = require('./routes/api/v1/energySet');
const analyzerRouter = require('./routes/api/v1/analyzer');

const app = express();

// Controllers that use socket.io
const configController = require('./controllers/configController');
const analyzerController = require('./controllers/analyzerController');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser);

// Socket.io Generate Data
const generator = http.Server(app);
const genIo = socketio(generator);
generator.listen(genIoPort);
genIo.on('connection', (socket) => {
  console.log('connected to socket ', socket.id);
  socket.on('runConfigs', (Configs) => {
    console.log('socketData: ', JSON.stringify(Configs));
    socket.emit('runConfigsClient','running configs');
    configController.runConfigs(socket,Configs);
  });
});

// Socket.io Generate Data
const analyzer = http.Server(app);
const anIo = socketio(analyzer);
analyzer.listen(analyzeIoPort);
anIo.on('connection', (socket) => {
  console.log('connected to socket ', socket.id);
  socket.on('runAnalyzer', (analysisData) => {
    console.log('socketData: ', JSON.stringify(analysisData));
    socket.emit('runAnalyzer','running analysis');
    analyzerController.startAnalyzer(socket,analysisData);
  });
});



// Link Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/v1/props', propsRouter);
app.use('/api/v1/matDB', matDBRouter);
app.use('/api/v1/config', configRouter);
app.use('/api/v1/energySet', energySetRouter);
app.use('/api/v1/mat', matRouter);
app.use('/api/v1/analyzer', analyzerRouter);

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

const dbuser = 'dbuser';
const dbpass = 'Password';

mongoose.connect(`mongodb+srv://${dbuser}:${dbpass}@cluster0-zehp8.mongodb.net/test?retryWrites=true&w=majority`, {useNewUrlParser: true});
// mongodb+srv://dbuser:Password@cluster0-zehp8.mongodb.net/test?retryWrites=true&w=majority
let connection = mongoose.connection;
connection.on('connected',() => console.log('connected to db'));
connection.on('diconnected',() => console.log('diconnected from db'));
connection.on('error',() => console.log('db connection error'));
connection.on('SIGINT',() => connection.close(() => {console.log('db connection error'); process.exit(0);}));

module.exports = app;