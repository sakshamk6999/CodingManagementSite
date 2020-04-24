const redis = require('redis');

const client = redis.createClient();

client.on("error", function(error){
    console.error(error);
})
// client.on("connect", function(err, response){
//     console.log('cache db connected');
// });

module.exports = client;