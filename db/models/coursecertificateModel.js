const mongoose=require('mongoose');

const coursecertificateSchema=new mongoose.Schema({
    name:String,
    s_id:{type:mongoose.Schema.Types.ObjectId,ref:'MoStudent'},
    imageurl:String,
    isverified:{type:Boolean,default:false},
    ispending:{type:Boolean,default:true},
    website:String,
    point:Number,
    duration:String,
    remark:String
})

module.exports =  mongoose.model('Moocscertificate',coursecertificateSchema);