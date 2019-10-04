var MongoClient = require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectID;

var state = {
  db: null,
}

exports.connect = async function(dbConfiguration) {
  url = dbConfiguration.toURL();
  if (state.db) return;
  console.log("Trying to connect to: " + url);
  await MongoClient.connect(url).then(db => {state.db = db;})
  console.log("connected to DB");
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
