
var allTopics = { 'implementation': 0,
'dp': 0,
'math': 0,
'greedy': 0,
'brute force': 0,
'data structures': 0,
'constructive algorithms': 0,
'dfs and similar': 0,
'sortings': 0,
'binary search': 0,
'graphs': 0,
'trees': 0,
'strings': 0,
'number theory': 0,
'geometry': 0,
'combinatorics': 0,
'two pointers': 0,
'dsu': 0,
'bitmasks': 0,
'probabilities': 0,
'shortest paths': 0,
'hashing': 0,
'divide and conquer': 0,
'games': 0,
'matrices': 0,
'flows': 0,
'string suffix structures': 0,
'expression parsing': 0,
'graph matchings': 0,
'ternary search': 0,
'meet-in-the-middle': 0,
'fft': 0,
'2-sat': 0,
'chinese remainder theorem': 0,
'schedules': 0 };



var getTopicDistribution = async function(res){
    var topics = {
        'weak': [],
        'moderate' : [],
        'strong': []
    };

    return getSubmissions(sess.handle).then(function(response){
        setSubmissions(response.data.result, sess.handle).then(function(done){
            var solved = done[0].length;
            for(var topic in done[1]){
                if(done[1][topic]/solved >= 0.35){
                    topics['strong'].push(topic);
                }else if(done[1][topic]/solved < 0.35 && done[1][topic]/solved >= 0.05){
                    topics['moderate'].push(topic);
                }else{
                    topics['weak'].push(topic);
                }
            }
            res.json(topics);
        }).catch(function(err){
            console.log(err);
        });
        // console.log('done');
    }).catch(function(err){
        res.json(err);
    })
}


var getQuestions = async function(){
    return axios.get('https://codeforces.com/api/problemset.problems');
}

var recommendQuestions = function(res, handle, n){
    getSubmissions(handle).then(function(response){
        setSubmissions(response.data.result).then(function(retVals){


        }).catch(function(err){
            console.log(err);
        })
    }).catch(function(err){
        console.log(err);
    })
}


