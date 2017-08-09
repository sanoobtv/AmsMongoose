var mongoose = require('mongoose');
var passport = require ('passport');
var flash = require ('connect-flash');
var morgan = require('morgan');
var cookieParser = require ('cookie-parser');
var session = require('express-session');

var PORT =process.env.PORT || 3000;
//express.static
;
var express = require ('express');
var bodyParser = require ('body-parser');
var app=express();
app.use(express.static('public'))
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
mongoose.connect(process.env.MONGOLAB_URI||configDB.url); // connect to our database
var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
                replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };


//var mongodbUri='mongodb://admin:Tnp4ydaf@ds147821.mlab.com:47821/rosterams';
//mongoose.connect(mongodbUri, options);
var conn = mongoose.connection;

conn.on('error', console.error.bind(console, 'connection error:'));
conn.once('open', function() {
//Wait for the database connection to establish, then start the app.
  app.listen( PORT ,function() { console.log ('listening on 3000')})
//


});

//data= {"date":"05/01/2017", "Staff": [ {"name": "Greg", "shift":"T2L"},{"name": "Thiago", "shift":"T2E"}, {"name": "Sanu", "shift":"T1E"},{"name": "Conor", "shift":"T1L"},{"name": "Rosh", "shift":"S1"} ]};
//workDay.collection.insert(data);

//mongoimport -h ds147821.mlab.com:47821 -d rosterams -c <collection> -u <user> -p <password> --file <input file>
