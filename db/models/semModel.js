const mongoose=require('mongoose');

const semSchema=new mongoose.Schema({
    batch:String,
    semester:Number,
    session:String,
    isstarted:{type:Boolean,default:false},
    teachers:[{type:mongoose.Schema.Types.ObjectId,ref:'Teacher'}]
})

module.exports =  mongoose.model('Sem',semSchema);