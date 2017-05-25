var mongoose = require('mongoose');
//var bcrypt   = require('bcrypt-nodejs');

var Schema = mongoose.Schema;
var staffSchema = new Schema ({
	name:String,
	shift:String
});

var workDaySchema = new Schema({
	date:{type : String , unique : true},
	staff:[staffSchema]
});

module.exports = mongoose.model('workDay',workDaySchema);
