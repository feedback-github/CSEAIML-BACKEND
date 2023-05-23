const mongoose=require('mongoose');

const techerSchema=new mongoose.Schema({
    subcode:String,
    subname:String,
    teachername:String,
    totalresponse:{type:Number,default:0},
    opinions:[{type:mongoose.Schema.Types.ObjectId,ref:'Feedback'}],
    q1:{poor:{type:Number,default:0},fair:{type:Number,default:0},good:{type:Number,default:0},vgood:{type:Number,default:0},excellent:{type:Number,default:0}},
    q2:{poor:{type:Number,default:0},fair:{type:Number,default:0},good:{type:Number,default:0},vgood:{type:Number,default:0},excellent:{type:Number,default:0}},
    q3:{poor:{type:Number,default:0},fair:{type:Number,default:0},good:{type:Number,default:0},vgood:{type:Number,default:0},excellent:{type:Number,default:0}},
    q4:{poor:{type:Number,default:0},fair:{type:Number,default:0},good:{type:Number,default:0},vgood:{type:Number,default:0},excellent:{type:Number,default:0}},
    q5:{poor:{type:Number,default:0},fair:{type:Number,default:0},good:{type:Number,default:0},vgood:{type:Number,default:0},excellent:{type:Number,default:0}},
    q6:{poor:{type:Number,default:0},fair:{type:Number,default:0},good:{type:Number,default:0},vgood:{type:Number,default:0},excellent:{type:Number,default:0}},
    q7:{poor:{type:Number,default:0},fair:{type:Number,default:0},good:{type:Number,default:0},vgood:{type:Number,default:0},excellent:{type:Number,default:0}},
    q8:{poor:{type:Number,default:0},fair:{type:Number,default:0},good:{type:Number,default:0},vgood:{type:Number,default:0},excellent:{type:Number,default:0}},
    q9:{poor:{type:Number,default:0},fair:{type:Number,default:0},good:{type:Number,default:0},vgood:{type:Number,default:0},excellent:{type:Number,default:0}},
    q10:{poor:{type:Number,default:0},fair:{type:Number,default:0},good:{type:Number,default:0},vgood:{type:Number,default:0},excellent:{type:Number,default:0}},    
})

module.exports =  mongoose.model('Teacher',techerSchema);