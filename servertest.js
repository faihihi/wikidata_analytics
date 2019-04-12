var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');

var surveyRouter = require('./app/routes/analytics.server.routes');

var app = express();

app.set('views', path.join(__dirname, 'app/views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//The session will expire in 60 sec (60,000 miliseconds)
app.use(session({
  secret: 'ssshhhh',
  cookie: {maxAge: 60000},
  resave: true,
  saveUninitialized: true
}));

app.use('/', surveyRouter);

app.listen(3000, function() {
    console.log('survey app is listening on port 3000!');
});
