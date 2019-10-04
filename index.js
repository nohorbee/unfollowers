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

dbConfiguration.host = process.env.DB_HOST;
dbConfiguration.port = process.env.DB_PORT;
dbConfiguration.name = process.env.DB_NAME;
dbConfiguration.user = process.env.DB_USER || '';
dbConfiguration.password = process.env.DB_PASSWORD || '';


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

app.get("/", async (req, res) => {

  try {
    currentFollowers = await getFollowers(process.env.SCREEN_NAME);
  } catch (err) {
    console.log("Error: can't get the current followers " + err); 
    res.status(500).send("Can't get the current followers");
  }
  let oldFollowers = [];
  try {
    oldFollowers = await getPreviousFollowers();
    console.log(oldFollowers);
  } catch (err) {
    console.log("WARN: Could not get the previous followers" + err)
  }
  let newFollowers = diff(oldFollowers, currentFollowers.ids);
  let newUnfollowers = diff(currentFollowers.ids, oldFollowers);

  await saveFollowers(currentFollowers.ids);

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

async function saveFollowers(message) {
  var collection = db.get().collection('followers');
  try {
    await collection.drop();
  } catch (err) {
    console.log("WARN: Could not drop the collection. It's ok for the first time running the app" + err);
  }
  try {
    result = await collection.insert({"message": message});
    console.log("Succesfully saving a list of followers" + message.length);
  } catch (err) {
    console.log("Error while inserting: " + err);
  } 
}

async function getPreviousFollowers() {
  var collection = db.get().collection('followers');
  try {
    result = await collection.find().toArray();
    return result[0].message;
  } catch (err) {
    console.log("WARN: Could not retrieve previous followers. It's ok for the first time running the app" + err);
  }
}