var MongoClient = require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectID;

var state = {
  db: null,
}

exports.connect = async function(dbConfiguration) {
  url = dbConfiguration.toURL();
  if (state.db) return state.db;
  await MongoClient.connect(url).then(client => {
    state.db = client.db(dbConfiguration.name);
    console.log("Connected to DB: " + dbConfiguration.toURL());
  }).catch(err => {
    console.log('Unable to connect to Mongo ' + err);
    process.exit(1);
  });
  return state.db
}

exports.get = function() {
  return state.db
}

exports.close = function(done) {
  if (state.db) {
    state.db.close(function(err, result) {
      state.db = null
      state.mode = null
      done(err)
    })
  }
}

exports.ObjectId = ObjectId;
