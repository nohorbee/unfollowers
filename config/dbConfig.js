let dbConfig = {}

dbConfig.host = process.env.DB_HOST;
dbConfig.port = process.env.DB_PORT;
dbConfig.name = process.env.DB_NAME;
dbConfig.user = process.env.DB_USER || '';
dbConfig.password = process.env.DB_PASSWORD || '';


dbConfig.toURL = function() {

  var securityString = '';
  if (this.user.length>0) {
    securityString = this.user + ':' + this.password + '@';
  }

  var url = 'mongodb+srv://' + securityString + this.host +'/'+ this.name +'?retryWrites=true&w=majority';
  return url;
}

export default dbConfig;