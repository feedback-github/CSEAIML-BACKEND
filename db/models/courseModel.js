const mongoose=require('mongoose');

const courseSchema=new mongoose.Schema({
    name:String,
    duration:String,
    credit:Number,
    website:String
})

module.exports =  mongoose.model('Course',courseSchema);