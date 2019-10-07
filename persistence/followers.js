import db from '../datasources/db';


export async function saveFollowers(message) {
    var collection = db.get().collection('followers');
    try {
        await collection.drop();
    } catch (err) {
        console.log("WARN: Could not drop the collection. It's ok for the first time running the app" + err);
    }
    let result;
    try {
        result = await collection.insert({ "message": message });
        console.log("Succesfully saving a list of followers" + message.length);
    } catch (err) {
        console.log("Error while inserting: " + err);
    }
}

export async function getPreviousFollowers() {
    var collection = db.get().collection('followers');
    let result;
    try {
        result = await collection.find().toArray();
        return result[0].message;
    } catch (err) {
        console.log("WARN: Could not retrieve previous followers. It's ok for the first time running the app" + err);
    }
}