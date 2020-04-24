var express = require('express');
var axios = require('axios');
var client = require('../cache/redis_db');
var router = express.Router();


var months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

router.get('/', function(req, res){

    client.get('competitionsData', (err, r)=>{
        if(r){
            res.send(r);
        }else{

            axios.get('https://codeforces.com/api/contest.list').then(function(response){
            var result = [];
            var got = response.data.result;
            var i = 0;
            var com = new Date().getTime();

            while(got[i]['startTimeSeconds']*1000 > com){
                d = new Date(got[i]['startTimeSeconds']*1000);
                var hours = d.getHours();
                var minutes = "0" + d.getMinutes();
                result.push({
                    'name' : got[i]['name'],
                    'date' : d.getDate(),
                    'month': months_arr[d.getMonth()],
                    'time': hours + ':' + minutes.substr(-2)
                });
                // console.log(result);
                i += 1;
            }
            
            client.setex('competitionsData', 3600, JSON.stringify(result));
            res.json(result);
        }).catch((err)=>{
            res.send(err);
        })

        }
    })
});

module.exports = router;