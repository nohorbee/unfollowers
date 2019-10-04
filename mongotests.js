var db = require('./db');


(async () => {

  let dbConfiguration = {};
  dbConfiguration.toURL = function() {

    var securityString = '';
    if (this.user.length>0) {
      securityString = this.user + ':' + this.password + '@';
    }
  
    var url = 'mongodb://' + securityString + this.host +':'+ this.port +'/'+ this.name +'';
    return url;
  }
  dbConfiguration.host = process.env.dbHost;
  dbConfiguration.port = process.env.dbPort;
  dbConfiguration.name = process.env.dbName;
  dbConfiguration.user = process.env.dbUser || '';
  dbConfiguration.password = process.env.dbPassword || '';

  try {
    await db.connect(dbConfiguration);
  } catch (err) {
    console.log('Unable to connect to Mongo.')
    process.exit(1)
  }

  await saveFollowers({ids: [1,2,3,4,5,6,7,8,9,10]})
  previousFollowers = await getPreviousFollowers();
  
  console.log(previousFollowers[0].message.ids);

})();






async function saveFollowers(message) {
    var collection = db.get().collection('followers');
    try {
      await collection.drop();
    } catch (err) {
      console.log("WARN: Could not drop the collection. It's ok for the first time running the app" + err);
    }
    try {
      result = await collection.insert({"message": message});
      console.log("Succesfully saving a list of followers" + message.ids.length);
    } catch (err) {
      console.log("Error while inserting: " + err);
    } 
}

async function getPreviousFollowers() {
  var collection = db.get().collection('followers');
  try {
    result = await collection.find().toArray();
    return result;
  } catch (err) {
    console.log("WARN: Could not retrieve previous followers. It's ok for the first time running the app" + err);
  }
}


// function getPreviousFollowers(callback, convo) {
//   console.log("getPrevious")
//   return new Promise((resolve, reject) => {
//     console.log("creted promise");
//     var collection = db.get().collection('followers');

//     collection.find().toArray().then(docs => {
//       console.log("then del find array")
//         if(!docs || docs.length == 0) {
//           console.log("entro por err 2")
//           err = {errno: -6}
//           reject(err);
//         } else {
//           console.log("successfully read followers " + docs[0].message.length);
//           resolve(docs[0].message)
//         }
//     }).catch(err => {
//       console.log("entro por err 1")
//       reject(err);  
//     });
    
//   });

  
// }




