var express = require('express');
var axios = require('axios');
var client = require('../cache/redis_db');
var router = express.Router();


var getUserInfo = async function(handle){
    return axios.get('https://codeforces.com/api/user.info?handles=' + handle);
}

var getSubmissions = async function(handle){
    return axios.get('https://codeforces.com/api/user.status?handle=' + handle);
}

var setSubmissions = async function(submissions){
    successSubmissions = [];
    // submissionDistribution = {};
    favTopics = {};
    for(var i = 0; i < submissions.length; i++){
        if(submissions[i]['verdict'] === 'OK'){
            successSubmissions.push(submissions[i]);
            for(var j = 0; j < submissions[i].problem.tags.length; j++){
                if(favTopics[submissions[i].problem.tags[j]]){
                    favTopics[submissions[i].problem.tags[j]] += 1;
                }else{
                    favTopics[submissions[i].problem.tags[j]] = 1;
                }
            }
        }
    }
    client.setex('topicDist', 24*3600,JSON.stringify(favTopics));
    client.set('numSolved', successSubmissions.length);
    console.log(favTopics);
    return [successSubmissions, favTopics];
}


var submissionRequest = function(res, reqType){
    getSubmissions(sess.handle).then(function(response){
        setSubmissions(response.data.result).then(function(done){
            if(reqType == 'submissions'){
            res.json(response.data.result);
            // console.log(done.length);
            }else if(reqType == 'successSubmissions'){
                res.json(done[0]);
            }else{
                res.json(done[1]);
            }
        }).catch(function(err){
            console.log(err);
        });
        // console.log('done');
    }).catch(function(err){
        res.json(err);
    })
    
}

router.get('/', function(req, res){
    sess = req.session;
    if(sess.handle){

        client.get('userInfo', (err, r)=>{
            if(r){
                res.send(r);
            }else{
                var result = {};
                getUserInfo(sess.handle).then(function(response){
                    var temp = response.data.result[0];
                    result['handle'] = sess.handle;
                    result['rank'] = temp['rank'];
                    result['rating'] = temp['rating'];
                    result['maxRating'] = temp['maxRating'];
                    result['maxRank'] = temp['maxRank'];
                    client.setex('userInfo', 3600, JSON.stringify(result));
                    res.json(result);
                }).catch(function(err){
                    res.json(err);
                })
            }
        });

    }else{
        res.redirect('/login');
    }
});

router.get('/submissions', function(req, res){
    sess = req.session;
    if(sess.handle){
        submissionRequest(res, 'submissions');
    }else{
        res.redirect('/login');
    }
})

router.get('/topicDist', function(req, res){
    sess = req.session;
    if(sess.handle){
        
        client.get('topicDist', (err, r)=>{
            if(r){
                res.send(r);
            }else{
                submissionRequest(res, 'favTopics');
            }
        })
    }else{
        res.redirect('/login');
    }
})

module.exports = router;