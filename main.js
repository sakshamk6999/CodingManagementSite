var express = require('express');
var axios = require('axios');
var pug = require('pug');
var bodyParser = require('body-parser');

var getUserRating = function(handle){
    try{
        return axios.get('https://codeforces.com/api/user.rating?handle=' + handle);
    }catch(error){
        console.error(error);
    }
}

var app = express();
var router = express.Router();
app.set("views", "./template");
app.set("view engine", "pug");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
  })); 


router.get('/:handle', function(req, res, next){
    var rating = getUserRating(req.params.handle).then(function(response){
        res.json(response.data.result[response.data.result.length - 1]);
    }).catch(function(error){
        console.log(error);
    });
});

router.get('/', function(req, res){
    res.render('index')
});

router.post('/', function(req, res){
    var rating = getUserRating(req.body.handle).then(function(response){
        res.json(response.data.result[response.data.result.length - 1]);
    }).catch(function(error){
        console.log(error);
    });
});

app.use('/', router);

app.listen(3000);