# Unfolowers

This repo contains a couple of files. 
`index.js` queries the twitter API for a set of credentials and compares with the previous run to determine if there are new followers or unfollowers.
The code is really rustic since I was trying to play with the APIs, but I might shape it a bit better in the future.

--
It's using dotenv as development dependency. This means that you can use a .env file locally. Check [this article](https://medium.com/the-node-js-collection/making-your-node-js-work-everywhere-with-environment-variables-2da8cdf6e786) for more information.

## Run
`node index.js`. You will need to configure the environment variables.
`node -r dotenv/config index.js` It will try to read the configuration from the .env file

## Environment variables
It requires the twitter credentials in order to work. Here is a .env file example (you might configure the environment variables honoring the variables names).

```
CONSUMER_KEY = "RANDOMRANDOMRANDOM"
CONSUMER_SECRET = "RANDOMRANDOMRANDOM"
ACCESS_TOKEN_KEY = "RANDOMRANDOMRANDOM"
ACCESS_TOKEN_SECRET = "RANDOMRANDOMRANDOM"
```