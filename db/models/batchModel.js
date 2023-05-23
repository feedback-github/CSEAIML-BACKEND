const mongoose=require('mongoose');

const batchSchema=new mongoose.Schema({
    batch:String,
    students:[{type:mongoose.Schema.Types.ObjectId,ref:'Student'}]
})

module.exports =  mongoose.model('Batch',batchSchema);