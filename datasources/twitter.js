import Twitter from 'twitter';
import { twitterConfiguration } from '../config'
export let client = new Twitter(twitterConfiguration);

export let getUsers = (ids, cursor) => {
    return new Promise((resolve, reject) => {
        var params = { user_id: ids, cursor: cursor, count: 5000 };
        client.get('users/lookup', params, function getData(error, followers, response) {
            if (error) {
                reject(error);
            }
            else {
                resolve(followers);
            }
        });
    });
};

export let getFollowers = (screenName, cursor) => {
    return new Promise((resolve, reject) => {
        if (!screenName)
            reject({ err: "The screenName is not specified" });
        var params = { screen_name: screenName, cursor: cursor, stringify_ids: true, count: 5000 };
        var totalFollowers = [];
        client.get('followers/ids', params, function getData(error, followers, response) {
            if (error) {
                reject(error);
            }
            else {
                resolve(followers);
            }
        });
    });
};
