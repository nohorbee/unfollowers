var Twitter = require('twitter');
const fs = require('fs').promises;

var client = new Twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
  });


let getFollowers = (screenName, cursor) => {
    return new Promise((resolve, reject) => {
        var params = { screen_name: screenName, cursor: cursor, count: 5000 };
        var totalFollowers = [];
        client.get('followers/list', params, function getData(error, followers, response) {
            if (error) {
                reject(error);
            } else {
                resolve(followers);
            }
        });

    })
}

getFollowers(process.env.screenName)
    .then(followers => {
        console.log("here are your followers: ");
        console.log(followers)
    })
    .catch(console.log);


