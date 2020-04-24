var express = require('express');
var bodyParser = require('body-parser');
// const session = require('express-session');

var router = express.Router();

router.get('/', function(req, res){
    sess = req.session;
    if(sess.handle){
        res.redirect('/');
    }else{
        res.sendFile('/home/saksham/coding/CodingManagementSite/zenithPlatform/views/login.html');
    }
});

router.post('/', function(req, res){
    sess = req.session;
    sess.handle = req.body.username;
    console.log(sess.handle);
    res.redirect('/user');
});

module.exports = router;