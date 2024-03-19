
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

    

    let user_id = "";

    try {

      const verify = jwt.verify(token, process.env.TOKEN_KEY);

      if(!verify){

        res.status(403).send({error: "access forbidden"});
        return;
       }else{
         const usr = await User.findOne({email: verify.email,}, {email:1, isAdmin:1}).exec();

        //  console.log(usr);

         user_id = usr._id + "";

        // res.status(200).send(usr);
         if (!usr.isAdmin){
            res.status(403).send({error: "access forbidden"});
            return;
         }
    }
       let log = function (db, body, user_id,verify){
        const Log = require("../models/log.model.js");
        let nl = new Log({
          user_id: user_id ,
          // ip: String,
          // mac: String,
          email: verify.email,
          datetime: Date.now(),
          table: "Call",
          data_id: db._id + "",
          data_name: `${verify.email} membuat kontak "${db.name}" `,
          value: body,
          prev_value: {},
          activity: "create"
        });
  
        nl.save();
      };

      controller.create(res, Call, req.body, null, inputList, struct , "Call",log, user_id,verify );
      
    } catch (error) {
      res.status(403).send({error: "access forbidden"});
      return;
    }

    
  

    
    
}

exports.update =  async(req, res) => {

     
    // console.log(f);

    const tokenBearer = req.headers.authorization + "";
       
    const token = tokenBearer.replace("Bearer ", "");

    const jwt = require("jsonwebtoken");

    

    let user_id = "";

    try {

      const verify = jwt.verify(token, process.env.TOKEN_KEY);

      if(!verify){

        res.status(403).send({error: "access forbidden"});
        return;
       }else{
         const usr = await User.findOne({email: verify.email,}, {email:1, isAdmin:1}).exec();

         user_id = usr._id + "";

        // res.status(200).send(usr);
         if (!usr.isAdmin){
            res.status(403).send({error: "access forbidden"});
            return;
         }
       }
   
       let log = function (db, body, user_id, verify){
        const Log = require("../models/log.model.js");
       
        // console.log(db);

        // console.log(body);

        if(db.name != body.name){
            let nl = new Log({
                user_id: user_id ,
                // ip: String,
                // mac: String,
                email: verify.email,
                datetime: Date.now(),
                table: "Call",
                data_id: db._id + "",
                data_name: `${verify.email} mengubah nama kontak emergency dari "${db.name}" menjadi "${body.name}" `,
                value: body.name,
                prev_value: db.name,
                activity: "update"
              });
        
              nl.save();
        }

        if(db.call != body.call){
            let nl = new Log({
                user_id: user_id ,
                // ip: String,
                // mac: String,
                email: verify.email,
                datetime: Date.now(),
                table: "Call",
                data_id: db._id + "",
                data_name: `${verify.email} mengubah nomor telphon kontak emergency  "${db.name}" dari "${db.call}" menjadi "${body.call}" `,
                value: body.call,
                prev_value: db.call,
                activity: "update"
              });
        
              nl.save();
        }

        if(db.role != body.role){
            let nl = new Log({
                user_id: user_id ,
                // ip: String,
                // mac: String,
                email: verify.email,
                datetime: Date.now(),
                table: "Call",
                data_id: db._id + "",
                data_name: `${verify.email} mengubah role kontak emergency "${db.name}" dari "${db.role}" menjadi "${body.role}" `,
                value: body.role,
                prev_value: db.role,
                activity: "update"
              });
        
              nl.save();
        }
        
      }

      controller.update(res, Call, req.body, req.params.id, inputList, struct ,  log, user_id,verify);
      
    } catch (error) {
      res.status(403).send({error: "access forbidden"});
      return;
    }

    
    

  
    // console.log(f);

   
    
    
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

    

    let user_id = "";

    try {

      const verify = jwt.verify(token, process.env.TOKEN_KEY);

      if(!verify){

        res.status(403).send({error: "access forbidden"});
        return;
       }else{
         const usr = await User.findOne({email: verify.email,}, {email:1, isAdmin:1}).exec();

         user_id = usr._id + "";

        // res.status(200).send(usr);
         if (!usr.isAdmin){
            res.status(403).send({error: "access forbidden"});
            return;
         }
       }

       let log = function (db, body, user_id,verify){
        const Log = require("../models/log.model.js");
        let nl = new Log({
          user_id: user_id ,
          // ip: String,
          // mac: String,
          email: verify.email,
          datetime: Date.now(),
          table: "Call",
          data_id: db._id,
          data_name: `${verify.email} menghapus kontak "${db.name}" `,
          value: body,
          prev_value: db,
          activity: "delete"
        });
  
        nl.save();
      };

   

    // const f = await Call.findOne({user_id: user_id, mac: mac}).exec();

    controller.delete(res, Call, req.params.id, log, user_id, verify);
      
    } catch (error) {
      res.status(403).send({error: "access forbidden"});
      return;
    }

    

    

    
}