var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var swapSchema = new Schema
 ({
 firstDate:{type:String, required:true},
 firstName:{type:String, required:true},
 firstShift:{type:String, required:true},
 secondDate:{type:String},
 secondName:{type:String},
 secondShift:{type:String},
 isApproved:{type:Boolean,required:true, default:false},
 submitDate:{type:String},
 approvedDate:{type:String},
 submittedBy:{type:String}
});

module.exports = mongoose.model('swap',swapSchema);
