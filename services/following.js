import { saveFollowers, getPreviousFollowers } from '../persistence/followers';
import { getFollowers, getUsers } from '../datasources/twitter';
import { generateTable } from '../htmlbuilders/followers';
export async function processUnfollowers(req, res) {
    let currentFollowers = {};
    try {
        currentFollowers = await getFollowers(process.env.SCREEN_NAME);
    }
    catch (err) {
        console.log("Error: can't get the current followers " + JSON.stringify(err));
        res.status(500).send("Can't get the current followers");
    }
    let oldFollowers = [];
    try {
        oldFollowers = await getPreviousFollowers();
    }
    catch (err) {
        console.log("WARN: Could not get the previous followers" + err);
    }
    let { newFollowers, newUnfollowers } = followingDifferences(oldFollowers, currentFollowers);
    await saveFollowers(currentFollowers.ids);
    let response = "";
    if (newFollowers.length) {
        response += "Your new followers: ";
        await getUsers(newFollowers.join(',')).then(users => { response += generateTable(users); }).catch(console.log);
    }
    else {
        response += "no new followers";
    }
    if (newUnfollowers.length) {
        response += "Your new unfollowers: ";
        await getUsers(newUnfollowers.join(',')).then(users => { response += generateTable(users); }).catch(console.log);
    }
    else {
        response += "no new unfollowers";
    }
    res.send(response);
}
function followingDifferences(oldFollowers, currentFollowers) {
    let newFollowers = diff(oldFollowers, currentFollowers.ids);
    let newUnfollowers = diff(currentFollowers.ids, oldFollowers);
    return { newFollowers, newUnfollowers };
}
function diff(newArr, oldArr) {
    let newSet = new Set(newArr);
    let oldSet = new Set(oldArr);
    return [...oldSet].filter(x => !newSet.has(x));
}
