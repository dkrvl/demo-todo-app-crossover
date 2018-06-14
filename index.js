//requiring NPM modeles
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var q = require('q');
var db = mongoose.connection;
var app = express();
var path = require('path');

db.on('error', console.error);
mongoose.Promise = q.Promise;

//requiring local modeles
var configs = require('./config');
var routes = require('./routes/routes');
var userModel = require('./models/users');
var helperFunctions = require('./helpers/helperFunctions');
app.set('views', path.join(__dirname, 'views'));

// Uncomment the following lines to start logging requests to consoles.
// app.use(morgan('combined'));
// parse application/x-www-form-urlencoded.
app.use(bodyParser.urlencoded({
	extended: false
}));
// parse application/json.
app.use(bodyParser.json());

//connedting to mongoDB
mongoose.connect('mongodb://' + configs.dbHost + ":" + configs.dbPort + '/' + configs.dbName, {
	useMongoClient: true
});

//populating data if DB is not already populated.
helperFunctions.populateDb();



//Initilizing routes.
routes(app);

// serve client side code.


app.use('/', express.static('client'));


app.get('/*', function (req, res) {
	res.sendFile(path.join(__dirname + '/client/index.html'));
});





//Finally starting the listener
app.listen(configs.applicationPort, function () {
	console.log('Crossover Todo app listening on port ' + configs.applicationPort + '!');
});