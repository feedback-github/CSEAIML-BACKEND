const jwt=require('jsonwebtoken');
const studentModel=require('../db/models/studentModel');

const sauthCheck=async(req,res,next)=>{
    const token=req.headers['x-student-token'];
    try{
        if(!token){
            return res.status(401).send({msg:"unauthorized access "});
        } 
        var decoded = jwt.verify(token, 'xFuck');
        if(!decoded){
            return res.status(401).send({msg:"unauthorized access "});
        }else{
            const student=await studentModel.findById(decoded.id);
        req.student=student;
        next();
        }
    }catch(err){
        return res.status(401).send({msg:"unauthorized access "});
    }
}

module.exports = sauthCheck;