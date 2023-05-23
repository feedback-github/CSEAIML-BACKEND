const mongoose=require('mongoose');

const feedbackSchema=new mongoose.Schema({
    opinion:String,
})

module.exports =  mongoose.model('Feedback',feedbackSchema);