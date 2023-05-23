const mongoose=require('mongoose');

const mobatchSchema=new mongoose.Schema({
    batch:String,
    students:[{type:mongoose.Schema.Types.ObjectId,ref:'MoStudent'}]
})

module.exports =  mongoose.model('MoBatch',mobatchSchema);