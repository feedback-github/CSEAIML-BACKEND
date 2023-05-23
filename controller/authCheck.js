const jwt=require('jsonwebtoken');
const adminModel=require('../db/models/adminModel');

const authCheck=async(req,res,next)=>{
    const token=req.headers['x-admin-token'];
    try{
        if(!token){
            return res.status(401).send({msg:"unauthorized access "});
        } 
        var decoded = jwt.verify(token, 'xxEEzz');
        if(!decoded){
            return res.status(401).send({msg:"unauthorized access "});
        }else{
            const admin=await adminModel.findById(decoded.id);
        req.admin=admin;
        next();
        }
    }catch(err){
        return res.status(401).send({msg:"unauthorized access "});
    }
}

module.exports = authCheck;