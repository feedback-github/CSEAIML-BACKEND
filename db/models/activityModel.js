const mongoose=require('mongoose');

const activitySchema=new mongoose.Schema({
    name:String,
    minpoint:Number,
    maxpoint:Number,
})

module.exports =  mongoose.model('Activity',activitySchema);