const mongoose=require('mongoose');

const cetificateSchema=new mongoose.Schema({
    name:String,
    imageurl:String,
    isverified:{type:Boolean,default:false},
    ispending:{type:Boolean,default:true},
    countid:{type:mongoose.Schema.Types.ObjectId,ref:'Activitycount'},
    point:Number,
    remark:String
})

module.exports =  mongoose.model('Certificate',cetificateSchema);