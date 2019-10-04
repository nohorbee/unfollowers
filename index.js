var Twitter = require('twitter');
const fs = require('fs').promises;
var db = require('./db');

var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

const express = require('express');
const app = express();
let port = process.env.PORT || 8000;

var dbConfiguration = {};

dbConfiguration.host = process.env.dbHost;
dbConfiguration.port = process.env.dbPort;
dbConfiguration.name = process.env.dbName;
dbConfiguration.user = process.env.dbUser || '';
dbConfiguration.password = process.env.dbPassword || '';


dbConfiguration.toURL = function() {

  var securityString = '';
  if (this.user.length>0) {
    securityString = this.user + ':' + this.password + '@';
  }

  var url = 'mongodb://' + securityString + this.host +':'+ this.port +'/'+ this.name +'';
  console.log('URL' + url);
  return url;
}

db.connect(dbConfiguration, function(err) {
  if (err) {
    console.log('Unable to connect to Mongo.')
    process.exit(1)
  } else {
    console.log("Connected to Gauss DB");
  }
});

app.get("/", (req, res) => {

  getFollowers(process.env.SCREEN_NAME).then(async currentFollowers => {
    let data = {}
    try {
      data = await getPreviousFollowers();
    } catch (err) {
      console.log(err.errno);
      if(err.errno === -6) {
        console.log("entro por err -6")
        await saveFollowers({"ids":[],"next_cursor":0,"next_cursor_str":"0","previous_cursor":0,"previous_cursor_str":"0","total_count":null});
        console.log("grabo datos falsos")
        data = await getPreviousFollowers();
        console.log("leyo datos falsos")
      }
    }
  
    let oldFollowers = data;
    let newFollowers = diff(oldFollowers.ids, currentFollowers.ids);
    let newUnfollowers = diff(currentFollowers.ids, oldFollowers.ids);
  
    (async () => {
      //await fs.writeFile('./followers.json', JSON.stringify(currentFollowers), 'utf8');
      await saveFollowers(currentFollowers);
    })();

    let response = ""
  
    if (newFollowers.length) {
      response += "Your new followers: ";
      await getUsers(newFollowers.join(',')).then(users => { response += generateTable(users) } ).catch(console.log);
    } else {
      response += "no new followers";
    }
      
    if (newUnfollowers.length) {
      response += "Your new unfollowers: ";
      await getUsers(newUnfollowers.join(',')).then(users => { response+= generateTable(users) } ).catch(console.log);
    } else {
      response += "no new unfollowers";
    }
  
    res.send(response);
    
  
  }).catch(err => {console.log(err); res.status(500).send("Something went wrong. Please check your logs to get more info")});

});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))



let getUsers = (ids, cursor) => {
  return new Promise((resolve, reject) => {
    var params = { user_id: ids, cursor: cursor, count: 5000 };
    client.get('users/lookup', params, function getData(error, followers, response) {
      if (error) {
        reject(error);
      } else {
        resolve(followers);
      }

    });
  });
}

let getFollowers = (screenName, cursor) => {
  return new Promise((resolve, reject) => {
    if(!screenName) reject ({err: "The screenName is not specified"});
    var params = { screen_name: screenName, cursor: cursor, stringify_ids: true, count: 5000 };
    var totalFollowers = [];
    client.get('followers/ids', params, function getData(error, followers, response) {
      if (error) {
        reject(error);
      } else {
        resolve(followers);
      }
    });

  })
}

function diff(newArr, oldArr) {
  let newSet = new Set(newArr);
  let oldSet = new Set(oldArr);
  return [...oldSet].filter(x => !newSet.has(x));
}

function generateTable(usersList) {
  rows = usersList.map(createRow)
  let table = `
  <table>
  `
  + rows.join('') +
  `
  </table>
  `

  return table;
}

function createRow(user) {

  let str = `
    <tr>
      <td>`+ user['screen_name'] + `</td>
    </tr>
  `;

  return str;
}

function saveFollowers(message) {
  return new Promise((resolve, reject) => {
    var collection = db.get().collection('followers');
    deleteCollection(collection);
    collection.insert({"message": message}, function(err, result) {
      if (err) {
        reject(err);
      } else {
        console.log("Succesfully saving a list of followers" + message.ids.length);
        resolve(result);
      }
    });
  });
  
}


function deleteCollection(collection) {
  return new Promise((resolve, reject) => {

    collection.drop(function(err, delOK) {
      if (err) {
        reject(err);
      } else {
        resolve(delOK);
      }
    })

  }); 
  
}

function getPreviousFollowers(callback, convo) {

  return new Promise((resolve, reject) => {
    var collection = db.get().collection('followers');

    collection.find().toArray(function(err, docs) {
      if (err) {
        console.log("entro por err 1")
        reject(err);
      } else {
        console.log("entro por err 2")
        if(!docs || docs.length == 0) {
          err = {errno: -6}
          reject(err);
        } else {
          console.log("successfully read followers " + docs[0].message);
          resolve(docs[0].message)
        }
        
      }      
    });
  });

  
}

// console.log(followers);

// totalFollowers = followers.users;
// cursor = followers.next_cursor;
// console.log(totalFollowers);
// console.log(cursor)



