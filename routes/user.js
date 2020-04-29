var express = require('express');
var axios = require('axios');
var client = require('../cache/redis_db');
var router = express.Router();
var redis = require('redis');

var getUserInfo = async function(handle){
    return axios.get('https://codeforces.com/api/user.info?handles=' + handle);
}

var getSubmissions = async function(handle){
    return axios.get('https://codeforces.com/api/user.status?handle=' + handle);
}

var setSubmissions = async function(submissions, handle){
    successSubmissions = [];
    successProblems = {};
    // submissionDistribution = {};
    favTopics = {};

    for(var i = 0; i < submissions.length; i++){
        if(submissions[i]['verdict'] === 'OK'){
            successSubmissions.push(submissions[i]);
            successProblems[submissions[i].problem.name] = 1;
            for(var j = 0; j < submissions[i].problem.tags.length; j++){
                if(favTopics[submissions[i].problem.tags[j]]){
                    favTopics[submissions[i].problem.tags[j]] += 1;
                }else{
                    favTopics[submissions[i].problem.tags[j]] = 1;
                }
            }
        }
    }
    console.log(handle);
    client.set(handle + ' topicDist',JSON.stringify(favTopics), redis.print);
    // client.set(handle + ' numSolved',successSubmissions.length, redis.print);
    // console.log(favTopics);
    return [successSubmissions, favTopics, successProblems];
}


var submissionRequest = async function(res, reqType, sess){
    return getSubmissions(sess.handle).then(function(response){
        // console.log('done1');
        return setSubmissions(response.data.result, sess.handle).then(function(done){
            // console.log('donne2');
            if(reqType == 'submissions'){
                // console.log('yes');
                // console.log(response.data.result);
                return response.data.result;
            // console.log(done.length);
            }else if(reqType == 'successSubmissions'){
                return done[0];
            }else{
                return done[1];
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

        client.get(sess.handle + ' userInfo', (err, r)=>{
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
                    client.setex(sess.handle + ' userInfo', 600, JSON.stringify(result));
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
        submissionRequest(res, 'submissions', sess).then((data)=>{
            res.json(data[0]);
            // console.log(data);
        })
    }else{
        res.redirect('/login');
    }
})

router.get('/topicDist', function(req, res){
    sess = req.session;
    if(sess.handle){
        getTopicDistribution(res);
        // client.get(sess.handle + ' topicDist', (err, r)=>{
        //     if(r){
        //         res.send(r);
        //     }else{
                
        //     }
        // })
    }else{
        res.redirect('/login');
    }
})

router.get('/successSubmission', function(req, res){
    sess = req.session;
    if(sess.handle){
        submissionRequest(res, 'successSubmissions', sess).then((result)=>{
            res.json(result);
        });
    }else{
        res.redirect('/login');
    }
})

// router.get('/temp', function(req, res){

// })
// router.get('/recommendQues', )

module.exports = router;