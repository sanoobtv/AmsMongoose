var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var contactSchema = new Schema ({
 name:{type:String, unique:true, index:true},
 location:{type:String, required:true},
 contactInfo:{type:String, required:true}

});

module.exports = mongoose.model('contact',contactSchema);
