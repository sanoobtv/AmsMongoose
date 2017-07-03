var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var swapSchema = new Schema
 ({
 firstDate:{type:String, required:true},
 firstName:{type:String, required:true},
 firstShift:{type:String, required:true},
 secondDate:{type:String, required:true},
 secondName:{type:String, required:true},
 secondShift:{type:String, required:true},
 isApproved:{type:Boolean,required:true, default:false},
 submitDate:{type:String},
 approvedDate:{type:String}
});

module.exports = mongoose.model('swap',swapSchema);
