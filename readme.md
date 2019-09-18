# Unfolowers

This repo contains a couple of files. 
`index.js` launches an express application that queries the twitter API for a set of credentials and compares with the previous run to determine if there are new followers or unfollowers.
The code is really rustic since I was trying to play with the APIs, but I might shape it a bit better in the future.

--
It's using dotenv as development dependency. This means that you can use a .env file locally. Check [this article](https://medium.com/the-node-js-collection/making-your-node-js-work-everywhere-with-environment-variables-2da8cdf6e786) for more information.

## Run
`npm start` = `node index.js`. You will need to configure the environment variables.
`npm run start-local` = `node -r dotenv/config index.js` It will try to read the configuration from the .env file

## Environment variables
It requires the twitter credentials in order to work. Here is a .env file example (you might configure the environment variables honoring the variables names). 

```
CONSUMER_KEY = "RANDOMRANDOMRANDOM"
CONSUMER_SECRET = "RANDOMRANDOMRANDOM"
ACCESS_TOKEN_KEY = "RANDOMRANDOMRANDOM"
ACCESS_TOKEN_SECRET = "RANDOMRANDOMRANDOM"
```
For getting the keys and secrets required by this configuration, you can create a Twitter application: https://developer.twitter.com/en/apps


## Limitations
The code isn't pretty, it's just working. Beyond that, there are unsupported scenarios that are not a problem for me, but could be an issue for you. You might want to try it anyway, or even better, add functionality and go for a pull request!

### Number of total followers
The application uses the Twitter API endpoint [`followers/ids`](https://developer.twitter.com/en/docs/accounts-and-users/follow-search-get-users/api-reference/get-followers-ids.html) to get all your current followers. It will then compare the list with the previous run to detect new and removed elements. This endpoint returns pages of 5000 ids and the application is not paginating. So, if you have more than 5000 followers, it won't completely work. Since the endpoint sorts the results by last followers first, you might detect unfollowing people that are on the last 5000 followers list.

### Number of changes since the last run
The application uses the Twitter API endpoint [`users/lookup`](https://developer.twitter.com/en/docs/accounts-and-users/follow-search-get-users/api-reference/get-users-lookup) to convert the resulting list of ids into twitter usernames. This endpoint supports up to 100 convertions per request and the application is not making many requests either. So, if you have more than 100 new followers or unfollowers since the last time you ran the application, you won't see all of these.

## Fixing limitations
If you are trying to fix these limitations in order to make a pull request, please take into account that you can't call the endpoints limitlessly. For instance:

[`followers/ids`](https://developer.twitter.com/en/docs/accounts-and-users/follow-search-get-users/api-reference/get-followers-ids.html) can be called 15 times every 15 minutes.


[`users/lookup`](https://developer.twitter.com/en/docs/accounts-and-users/follow-search-get-users/api-reference/get-users-lookup) can be called 300 times every 15 minutes using application authentication, or 900 times every 15 minutes using user authentication.

That would limit us to accounts with less than:
- 75000 followers
- 4500000 changes between checks

The application is thought to run the checks based on a request. This is due to it's not thought to be deployed on paid infrastructure that would allow us to run crons or similars.

Any idea to overcome this issues is more than welcome :)