import routes from './routes';
import { dbConfiguration } from './config';
import db from './datasources/db';


// DEFINE AN EXPRESS APP
const express = require('express');
const app = express();
let port = process.env.PORT || 8000;
// DEFINE ROUTES
app.use("/unfollowers", routes.unfollowers);


// CONNECT TO DB
db.connect(dbConfiguration);



// EXPRESS APP START

app.listen(port, () => console.log(`Unfollowers app is listening in port ${port}!`))





