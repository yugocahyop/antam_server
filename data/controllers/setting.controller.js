
const Setting = require("../models/setting.model.js");
const User = require("../models/account.model.js");

const controller = require("./controller.js");

const inputList =  [ 
    "teganganAtas","arusBawah","arusAtas" ,"suhuBawah","suhuAtas" ,"phBawah" ,"phAtas"
];

const struct =  {
    teganganAtas: "Number",arusBawah: "Number",arusAtas : "Number",suhuBawah: "Number",suhuAtas : "Number",phBawah : "Number",phAtas: "Number"
};

exports.structSetting = struct;
exports.inputListMontioring = inputList;


exports.create =  async(req, res) => {

    const num = await Setting.count({}).exec();

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
          table: "Setting",
          data_id: db._id + "",
          data_name: `${verify.email} membuat kontak "${db.name}" `,
          value: body,
          prev_value: {},
          activity: "update"
        });
  
        nl.save();
      };

    

        controller.create(res, Setting, req.body, null, inputList, struct , "Setting",log, user_id,verify );


      

      
      
      
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

        if(db.phAtas != body.phAtas){
            let nl = new Log({
                user_id: user_id ,
                // ip: String,
                // mac: String,
                email: verify.email,
                datetime: Date.now(),
                table: "Setting",
                data_id: db._id + "",
                data_name: `${verify.email} mencoba mengubah setting maximum ph dari "${db.phAtas ?? 0}" menjadi "${body.phAtas}" `,
                value: body.phAtas,
                prev_value: db.phAtas,
                activity: "update"
              });
        
              nl.save();
        }

        if(db.phBawah != body.phBawah){
            let nl = new Log({
                user_id: user_id ,
                // ip: String,
                // mac: String,
                email: verify.email,
                datetime: Date.now(),
                table: "Setting",
                data_id: db._id + "",
                data_name: `${verify.email} mencoba mengubah setting minimum ph dari "${db.phBawah ?? 0}" menjadi "${body.phBawah}" `,
                value: body.phBawah,
                prev_value: db.phBawah,
                activity: "update"
              });
        
              nl.save();
        }

        if(db.arusAtas != body.arusAtas){
            let nl = new Log({
                user_id: user_id ,
                // ip: String,
                // mac: String,
                email: verify.email,
                datetime: Date.now(),
                table: "Setting",
                data_id: db._id + "",
                data_name: `${verify.email} mencoba mengubah setting maximum arus dari "${db.arusAtas ?? 0}" menjadi "${body.arusAtas}" `,
                value: body.arusAtas,
                prev_value: db.arusAtas,
                activity: "update"
              });
        
              nl.save();
        }

        if(db.arusBawah != body.arusBawah){
            let nl = new Log({
                user_id: user_id ,
                // ip: String,
                // mac: String,
                email: verify.email,
                datetime: Date.now(),
                table: "Setting",
                data_id: db._id + "",
                data_name: `${verify.email} mencoba mengubah setting minimum arus dari "${db.arusBawah ?? 0}" menjadi "${body.arusBawah}" `,
                value: body.arusBawah,
                prev_value: db.arusBawah,
                activity: "update"
              });
        
              nl.save();
        }

        if(db.suhuAtas != body.suhuAtas){
            let nl = new Log({
                user_id: user_id ,
                // ip: String,
                // mac: String,
                email: verify.email,
                datetime: Date.now(),
                table: "Setting",
                data_id: db._id + "",
                data_name: `${verify.email} mencoba mengubah setting maximum suhu dari "${db.suhuAtas ?? 0}" menjadi "${body.suhuAtas}" `,
                value: body.suhuAtas,
                prev_value: db.suhuAtas,
                activity: "update"
              });
        
              nl.save();
        }

        if(db.suhuBawah != body.suhuBawah){
            let nl = new Log({
                user_id: user_id ,
                // ip: String,
                // mac: String,
                email: verify.email,
                datetime: Date.now(),
                table: "Setting",
                data_id: db._id + "",
                data_name: `${verify.email} mencoba mengubah setting minimum suhu dari "${db.suhuBawah ?? 0}" menjadi "${body.suhuBawah}" `,
                value: body.suhuBawah,
                prev_value: db.suhuBawah,
                activity: "update"
              });
        
              nl.save();
        }

        if(db.teganganAtas != body.teganganAtas){
            let nl = new Log({
                user_id: user_id ,
                // ip: String,
                // mac: String,
                email: verify.email,
                datetime: Date.now(),
                table: "Setting",
                data_id: db._id + "",
                data_name: `${verify.email} mencoba mengubah setting maximum tegangan dari "${db.teganganAtas ?? 0}" menjadi "${body.teganganAtas}" `,
                value: body.teganganAtas,
                prev_value: db.teganganAtas,
                activity: "update"
              });
        
              nl.save();
        }


        
        
      }

      const s =await Setting.findOne({}).exec();

      if(s){
        controller.update(res, Setting, req.body, s._id +"", inputList, struct ,  log, user_id,verify);

      }else{

        let log2 = function (db, body, user_id, verify){

        const Log = require("../models/log.model.js");

        let nl = new Log({
            user_id: user_id ,
            // ip: String,
            // mac: String,
            email: verify.email,
            datetime: Date.now(),
            table: "Setting",
            data_id: db._id + "",
            data_name: `${verify.email} inisiasi setting `,
            value: req.body,
            // prev_value: db.phAtas,
            activity: "create"
          });
    
          nl.save();
        }

         controller.create(res, Setting, req.body, null, inputList, struct , "Setting",log2, user_id,verify );

     
      }
      
    } catch (error) {
        console.log(error);
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

    controller.find(res, Setting, req.query, find, {name: 1});
}

exports.findLast = async(req, res ) => {
  
    
    controller.findOne(res, Setting, req.query, {}, {});
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
          table: "Setting",
          data_id: db._id,
          data_name: `${verify.email} menghapus kontak "${db.name}" `,
          value: body,
          prev_value: db,
          activity: "delete"
        });
  
        nl.save();
      };

   

    // const f = await Setting.findOne({user_id: user_id, mac: mac}).exec();

    controller.delete(res, Setting, req.params.id, log, user_id, verify);
      
    } catch (error) {
      res.status(403).send({error: "access forbidden"});
      return;
    }

    

    

    
}