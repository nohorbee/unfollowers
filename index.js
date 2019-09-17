var Twitter = require('twitter');
const fs = require('fs').promises;

var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

const express = require('express');
const app = express();
const port = 3000;

app.get("/", (req, res) => {

  getFollowers('nohorbee').then(async currentFollowers => {
    let data = {}
    try {
      data = await fs.readFile('./followers.json');
    } catch (err) {
      if(err.errno === -2) {
        await fs.writeFile("./followers.json", '{"ids":[],"next_cursor":0,"next_cursor_str":"0","previous_cursor":0,"previous_cursor_str":"0","total_count":null}');
        data = await fs.readFile('./followers.json');
      }
    }
  
    let oldFollowers = JSON.parse(data);
    let newFollowers = diff(oldFollowers.ids, currentFollowers.ids);
    let newUnfollowers = diff(currentFollowers.ids, oldFollowers.ids);
  
    (async () => {
      await fs.writeFile('./followers.json', JSON.stringify(currentFollowers), 'utf8');
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
    
  
  }).catch(console.log);

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

// console.log(followers);

// totalFollowers = followers.users;
// cursor = followers.next_cursor;
// console.log(totalFollowers);
// console.log(cursor)



