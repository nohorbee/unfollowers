import dbConfig from './dbConfig.js';
import twitterConfig from './twitterConfig.js';
//var twitterConfig = {}


export default {
    dbConfiguration: dbConfig,
    twitterConfiguration: twitterConfig
}

export const dbConfiguration = dbConfig;
export const twitterConfiguration = twitterConfig;

// Exporting de default containing all the named exported let us import as
// import config from './config' 
// and then
// let dbConfiguration = config.dbConfiguration

// OR directly

// import { dbConfiguration } from './config'