var mongoose = require('mongoose');

//var bcrypt   = require('bcrypt-nodejs');

var Schema = mongoose.Schema;
var workDaySchema = new Schema({
	date:{type : String , unique : true},
	staff:[{
		name:String,
		shift:String
		     }]
});

module.exports = mongoose.model('workDay',workDaySchema);
