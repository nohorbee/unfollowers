var MongoClient = require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectID;

var state = {
  db: null,
}

exports.connect = function(dbConfiguration, done) {
  url = dbConfiguration.toURL();
  if (state.db) return done()

  MongoClient.connect(url, function(err, db) {
    if (err) return done(err)
    state.db = db
    done()
  })
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
