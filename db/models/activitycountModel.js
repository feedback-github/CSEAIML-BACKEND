const mongoose=require('mongoose');

const activitucountSchema=new mongoose.Schema({
    name:String,
    point:{type:Number,default:0},
    maxpoint:{type:Number,default:0},
})

module.exports =  mongoose.model('Activitycount',activitucountSchema);