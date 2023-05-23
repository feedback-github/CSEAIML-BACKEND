const mongoose=require('mongoose');

const mastudentSchema=new mongoose.Schema({
    name:String,
    username:Number,
    password:Number,
    currentyear:Number,

    previouspoint:{type:Number,default:0},
    currentpoint:{type:Number,default:0},
    activityCertificates:[{type:mongoose.Schema.Types.ObjectId,ref:'Certificate'}],
    activityCount:[{type:mongoose.Schema.Types.ObjectId,ref:'Activitycount'}]
    //teachers:[{type:mongoose.Schema.Types.ObjectId,ref:'Teacher'}]
})

module.exports =  mongoose.model('Student',mastudentSchema);