var express = require('express');
var axios = require('axios');
var pug = require('pug');
var bodyParser = require('body-parser');
var session = require('express-session');

var PORT = process.env.PORT || 3000;
var app = express();
app.set("views", "./template");
app.set("view engine", "pug");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
})); 
app.use(session({secret: 'shshs', saveUninitialized: true, resave: true}));
var sess;

var favTopics = {};
var successSubmissions = [];

var contestRoute = require('./routes/contests');
var loginRoute = require('./routes/login');
var userRoute = require('./routes/user');

app.use('/', contestRoute);
app.use('/login', loginRoute);
app.use('/user', userRoute);

app.listen(PORT, function(){
    console.log('up and running now');
});