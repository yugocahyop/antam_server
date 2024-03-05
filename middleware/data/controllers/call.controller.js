
const Call = require("../models/call.model.js");
const User = require("../models/account.model.js");

const controller = require("./controller.js");

const inputList =  [ 
    "role",
    "name",
    "phone" 
];

const struct =  {
    role: "String",
    name : "String",
    phone : "String",
};

exports.structCall = struct;
exports.inputListMontioring = inputList;


exports.create =  async(req, res) => {

    const num = await Call.count({}).exec();

    if(num == 5){
        res.status(400).send({error: "Tidak bisa lebih dari 5"});
        return;
    }

     
    // console.log(f);

    const tokenBearer = req.headers.authorization + "";
       
    const token = tokenBearer.replace("Bearer ", "");

    const jwt = require("jsonwebtoken");

    const verify = jwt.verify(token, process.env.TOKEN_KEY);

    if(!verify){

        res.status(403).send({error: "access forbidden"});
        return;
       }else{
         const usr = await User.findOne({email: verify.email,}, {email:1, isAdmin:1}).exec();

        // res.status(200).send(usr);
         if (!usr.isAdmin){
            res.status(403).send({error: "access forbidden"});
            return;
         }
       }

    
    controller.create(res, Call, req.body, null, inputList, struct , "Call" );
}

exports.update =  async(req, res) => {

     
    // console.log(f);

    const tokenBearer = req.headers.authorization + "";
       
    const token = tokenBearer.replace("Bearer ", "");

    const jwt = require("jsonwebtoken");

    const verify = jwt.verify(token, process.env.TOKEN_KEY);

    if(!verify){

        res.status(403).send({error: "access forbidden"});
        return;
       }else{
         const usr = await User.findOne({email: verify.email,}, {email:1, isAdmin:1}).exec();

        // res.status(200).send(usr);
         if (!usr.isAdmin){
            res.status(403).send({error: "access forbidden"});
            return;
         }
       }
   
    

  
    // console.log(f);

   
    controller.update(res, Call, req.body, req.params.id, inputList, struct , "Call" );
    
}

function escapeRegex(string) {
    return string.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
  }

exports.find = async(req, res ) => {

    const qString = (req.query.q ?? "") + "";

    const key = escapeRegex(qString);
   
    let find = qString === ""? {} : {$or: [{name: {$regex: key, $options: "i"}}, {role: {$regex: key, $options: "i"}}, {phone: {$regex: key, $options: "i"}} ],} ;

    controller.find(res, Call, req.query, find, {name: 1});
}

exports.findLast = async(req, res ) => {
  
    
    controller.findOne(res, Call, req.query, {}, {name: 1});
}

exports.delete = async(req, res) =>{

     
    // console.log(f);

    const tokenBearer = req.headers.authorization + "";
       
    const token = tokenBearer.replace("Bearer ", "");

    const jwt = require("jsonwebtoken");

    const verify = jwt.verify(token, process.env.TOKEN_KEY);

    if(!verify){

        res.status(403).send({error: "access forbidden"});
        return;
       }else{
         const usr = await User.findOne({email: verify.email,}, {email:1, isAdmin:1}).exec();

        // res.status(200).send(usr);
         if (!usr.isAdmin){
            res.status(403).send({error: "access forbidden"});
            return;
         }
       }

   

    // const f = await Call.findOne({user_id: user_id, mac: mac}).exec();

    controller.delete(res, Call, req.params.id);

    

    
}