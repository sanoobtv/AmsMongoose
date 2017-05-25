var express = require ('express');
var bodyParser = require ('body-parser');
var mongoose = require('mongoose');
var passport = require ('passport');
var flash = require ('connect-flash');
var morgan = require('morgan');
var cookieParser = require ('cookie-parser');
var session = require('express-session');
var app=express();

//express.static
//app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
//obtain html data
app.set('view engine','ejs');
app.use(morgan('dev')); //log all request to console
app.use(cookieParser()); // to access cookieParser
app.use(session({ secret : 'itsasecret'}));//session secret value
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // flash messages stored in sessions

require('./routes.js')(app,passport); //loading routes
require('./config/passport')(passport);
var configDB = require('./config/database.js');
var workDay  = require('./models/workDay');
// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database
var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
                replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };

//var mongodbUri='mongodb://admin:Tnp4ydaf@ds147821.mlab.com:47821/rosterams';
//mongoose.connect(mongodbUri, options);
var conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'connection error:'));
conn.once('open', function() {
//Wait for the database connection to establish, then start the app.
  app.listen(process.env.PORT || 3000,function() { console.log ('listening on 3000')})
//
/*var data=
[{"date":"05/01/2017", "Staff": [ {"name": "Greg", "shift":"T2L"},{"name": "Thiago", "shift":"T2E"}, {"name": "Sanu", "shift":"T1E"},{"name": "Conor", "shift":"T1L"},{"name": "Rosh", "shift":"S1"} ]}, {"date":"05/02/2017", "Staff": [ {"name": "Thiago", "shift":"T2E"}, {"name": "Sanu", "shift":"T1E"},{"name": "Conor", "shift":"T1L"},{"name": "Rosh", "shift":"S1"},{"name": "Winston", "shift":"T2L"}]}, {"date":"05/03/2017", "Staff": [ {"name": "Thiago", "shift":"T2E"}, {"name": "Sanu", "shift":"T1E"},{"name": "Conor", "shift":"T1L"},{"name": "Rosh", "shift":"S1"},{"name": "Winston", "shift":"T2L"}]}, {"date":"05/04/2017", "Staff": [{"name": "Kelvin", "shift":"T1L"}, {"name": "Shree", "shift":"T2E"},{"name": "Sanu", "shift":"T1E"} ,{"name": "Rosh", "shift":"S1"},{"name": "Winston", "shift":"T2L"}]}, {"date":"05/05/2017", "Staff": [{"name": "Kelvin", "shift":"T1L"},{"name": "Greg", "shift":"T1E"}, {"name": "Shree", "shift":"T2E"}, ,{"name": "Rosh", "shift":"S1"},{"name": "Winston", "shift":"T2L"}]}, {"date":"05/06/2017", "Staff": [{"name": "Kelvin", "shift":"T1L"},{"name": "Greg", "shift":"T1E"},{"name": "Thiago", "shift":"S1"},{"name": "Shree", "shift":"T2L"}, {"name": "Conor", "shift":"T2E"} ]}, {"date":"05/07/2017", "Staff": [{"name": "Kelvin", "shift":"T1L"},{"name": "Greg", "shift":"T1E"},{"name": "Thiago", "shift":"S1"},{"name": "Shree", "shift":"T2L"}, {"name": "Conor", "shift":"T2E"} ]}, {"date":"05/08/2017", "Staff": [ {"name": "Greg", "shift":"T1E"},{"name": "Thiago", "shift":"T2E"}, {"name": "Sanu", "shift":"T2L"},{"name": "Conor", "shift":"T1L"},{"name": "Rosh", "shift":"S1"} ]}, {"date":"05/09/2017", "Staff": [ {"name": "Thiago", "shift":"T1E"}, {"name": "Sanu", "shift":"T2L"},{"name": "Conor", "shift":"T1L"},{"name": "Rosh", "shift":"S1"},{"name": "Winston", "shift":"T2E"}]}, {"date":"05/10/2017", "Staff": [ {"name": "Thiago", "shift":"T1E"},{"name": "Shree", "shift":"T2L"},{"name": "Sanu", "shift":"T1L"} ,{"name": "Rosh", "shift":"S1"},{"name": "Winston", "shift":"T2E"}]}, {"date":"05/11/2017", "Staff": [{"name": "Kelvin", "shift":"T1E"}, {"name": "Shree", "shift":"T2L"},{"name": "Sanu", "shift":"T1L"} ,{"name": "Rosh", "shift":"S1"},{"name": "Winston", "shift":"T2E"}]}, {"date":"05/12/2017", "Staff": [{"name": "Kelvin", "shift":"T1E"},{"name": "Greg", "shift":"T1L"}, {"name": "Conor", "shift":"T2L"},{"name": "Rosh", "shift":"S1"},{"name": "Winston", "shift":"T2E"}]}, {"date":"05/13/2017", "Staff": [{"name": "Kelvin", "shift":"T1E"},{"name": "Greg", "shift":"T1L"},{"name": "Thiago", "shift":"S1"},{"name": "Shree", "shift":"T2E"}, {"name": "Conor", "shift":"T2L"} ]}, {"date":"05/14/2017", "Staff": [{"name": "Kelvin", "shift":"T1E"},{"name": "Greg", "shift":"T1L"},{"name": "Thiago", "shift":"S1"},{"name": "Shree", "shift":"T2E"}, {"name": "Conor", "shift":"T2L"} ]}, {"date":"05/15/2017", "Staff": [{"name": "Kelvin", "shift":"T2L"},{"name": "Greg", "shift":"T1L"},{"name": "Thiago", "shift":"T2E"}, {"name": "Sanu", "shift":"T1E"} ,{"name": "Rosh", "shift":"S1"} ]}, {"date":"05/16/2017", "Staff": [ {"name": "Greg", "shift":"T2L"},{"name": "Thiago", "shift":"T2E"}, {"name": "Sanu", "shift":"T1E"} ,{"name": "Rosh", "shift":"S1"},{"name": "Winston", "shift":"T1L"}]}, {"date":"05/17/2017", "Staff": [ {"name": "Thiago", "shift":"T2E"},{"name": "Shree", "shift":"T2L"},{"name": "Sanu", "shift":"T1E"} ,{"name": "Rosh", "shift":"S1"},{"name": "Winston", "shift":"T1L"}]}, {"date":"05/18/2017", "Staff": [{"name": "Kelvin", "shift":"T2L"}, {"name": "Thiago", "shift":"T2E"}, {"name": "Sanu", "shift":"T1E"} ,{"name": "Rosh", "shift":"S1"},{"name": "Winston", "shift":"T1L"}]}, {"date":"05/19/2017", "Staff": [{"name": "Kelvin", "shift":"T2L"},{"name": "Greg", "shift":"T1E"}, {"name": "Shree", "shift":"T2E"},{"name": "Sanu", "shift":"T1L"} ,{"name": "Rosh", "shift":"S1"} ]}, {"date":"05/20/2017", "Staff": [{"name": "Kelvin", "shift":"T2L"},{"name": "Greg", "shift":"T1E"},{"name": "Thiago", "shift":"S1"},{"name": "Shree", "shift":"T1L"}, {"name": "Conor", "shift":"T2E"} ]}, {"date":"05/21/2017", "Staff": [{"name": "Kelvin", "shift":"T2L"},{"name": "Greg", "shift":"T1E"},{"name": "Thiago", "shift":"S1"},{"name": "Shree", "shift":"T1L"}, {"name": "Conor", "shift":"T2E"} ]}, {"date":"05/22/2017", "Staff": [ {"name": "Greg", "shift":"T1E"},{"name": "Thiago", "shift":"T2E"},{"name": "Shree", "shift":"T1L"}, ,{"name": "Rosh", "shift":"S1"},{"name": "Winston", "shift":"T2L"}]}, {"date":"05/23/2017", "Staff": [ {"name": "Thiago", "shift":"T2E"},{"name": "Shree", "shift":"T1L"},{"name": "Sanu", "shift":"T1E"} ,{"name": "Rosh", "shift":"S1"},{"name": "Winston", "shift":"T2L"}]}, {"date":"05/24/2017", "Staff": [ {"name": "Shree", "shift":"T1L"},{"name": "Sanu", "shift":"T1E"},{"name": "Conor", "shift":"T2E"},{"name": "Rosh", "shift":"S1"},{"name": "Winston", "shift":"T2L"}]}, {"date":"05/25/2017", "Staff": [{"name": "Kelvin", "shift":"T2E"}, {"name": "Sanu", "shift":"T1L"},{"name": "Conor", "shift":"T1E"},{"name": "Rosh", "shift":"S1"},{"name": "Winston", "shift":"T2L"}]}, {"date":"05/26/2017", "Staff": [{"name": "Kelvin", "shift":"T2E"},{"name": "Greg", "shift":"T2L"}, {"name": "Sanu", "shift":"T1L"},{"name": "Conor", "shift":"T1E"},{"name": "Rosh", "shift":"S1"} ]}, {"date":"05/27/2017", "Staff": [{"name": "Kelvin", "shift":"T1E"},{"name": "Greg", "shift":"T2L"},{"name": "Thiago", "shift":"S1"}, {"name": "Sanu", "shift":"T1L"},{"name": "Conor", "shift":"T2E"} ]}, {"date":"05/28/2017", "Staff": [{"name": "Kelvin", "shift":"T1E"},{"name": "Greg", "shift":"T2L"},{"name": "Thiago", "shift":"S1"},{"name": "Shree", "shift":"T1L"}, ,{"name": "Winston", "shift":"T2E"}]}, {"date":"05/29/2017", "Staff": [ {"name": "Greg", "shift":"T2L"}, {"name": "Sanu", "shift":"T1L"},{"name": "Conor", "shift":"T1E"},{"name": "Rosh", "shift":"S1"},{"name": "Winston", "shift":"T2E"}]}, {"date":"05/30/2017", "Staff": [ {"name": "Thiago", "shift":"T1E"},{"name": "Shree", "shift":"T2L"}, {"name": "Conor", "shift":"T1L"},{"name": "Rosh", "shift":"S1"},{"name": "Winston", "shift":"T2E"}]}, {"date":"05/31/2017", "Staff": [{"name": "Kelvin", "shift":"T2E"}, {"name": "Thiago", "shift":"T1E"},{"name": "Shree", "shift":"T1L"}, {"name": "Conor", "shift":"T2L"},{"name": "Rosh", "shift":"S1"} ]}]

*/
//workDay.collection.insertMany(data);

});

//data= {"date":"05/01/2017", "Staff": [ {"name": "Greg", "shift":"T2L"},{"name": "Thiago", "shift":"T2E"}, {"name": "Sanu", "shift":"T1E"},{"name": "Conor", "shift":"T1L"},{"name": "Rosh", "shift":"S1"} ]};
//workDay.collection.insert(data);

//mongoimport -h ds147821.mlab.com:47821 -d rosterams -c <collection> -u <user> -p <password> --file <input file>
