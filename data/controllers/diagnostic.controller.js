
const Diagnostic = require("../models/diagnostic.model.js");

const controller = require("./controller.js");

const inputList =  [ 
    "timeStamp",
    "tangkiData" 
];

const struct =  {
    timeStamp: "Number",
    tangkiData : "Array",
};

exports.structDiagnostic = struct;
exports.inputListMontioring = inputList;


exports.create =  async(req, res) => {

    
    controller.create(res, Diagnostic, req.body, null, inputList, struct , "Diagnostic" );
}

exports.update =  async(req, res) => {
   
    

  
    // console.log(f);

   
    controller.update(res, Diagnostic, req.body, req.params.id, inputList, struct , "Diagnostic" );
    
}

exports.resetEnergi = async(req, res)=> {
    // let{tangki, node, isActive} = req.body;

    const tokenBearer = req.headers.authorization + "";
       
    const token = tokenBearer.replace("Bearer ", "");

    const jwt = require("jsonwebtoken");

    const verify = jwt.verify(token, process.env.TOKEN_KEY);

    // let emailCheck = "";

    let user_id = "";

    if(!verify){

        res.status(403).send({error: "access forbidden"});
        return;
       }else{
        const User = require("../models/account.model.js");
         const usr = await User.findOne({email: verify.email,}, {email:1, isAdmin:1}).exec();

        //  emailCheck = verify.email;
         user_id = usr._id + "";

        // res.status(200).send(usr);
        //  if (!usr.isAdmin){
        //     res.status(403).send({error: "access forbidden"});
        //     return;
        //  }
       }

    const Log = require("../models/log.model.js");
      let nl = new Log({
        user_id: user_id,
        // ip: String,
        // mac: String,
        email: verify.email,
        datetime: Date.now(),
        table: "Diagnostic",
        data_id: null,
        data_name: `${verify.email} mencoba mereset energi `,
        // value: !isActive,
        // prev_value: isActive,
        activity: "update"
      });

      nl.save();
}

exports.toogleNode = async(req, res)=> {
    let{tangki, node, isActive} = req.body;

    const tokenBearer = req.headers.authorization + "";
       
    const token = tokenBearer.replace("Bearer ", "");

    const jwt = require("jsonwebtoken");

    const verify = jwt.verify(token, process.env.TOKEN_KEY);

    // let emailCheck = "";

    let user_id = "";

    if(!verify){

        res.status(403).send({error: "access forbidden"});
        return;
       }else{
        const User = require("../models/account.model.js");
         const usr = await User.findOne({email: verify.email,}, {email:1, isAdmin:1}).exec();

        //  emailCheck = verify.email;
         user_id = usr._id + "";

        // res.status(200).send(usr);
        //  if (!usr.isAdmin){
        //     res.status(403).send({error: "access forbidden"});
        //     return;
        //  }
       }

    const Log = require("../models/log.model.js");
      let nl = new Log({
        user_id: user_id,
        // ip: String,
        // mac: String,
        email: verify.email,
        datetime: Date.now(),
        table: "Diagnostic",
        data_id: null,
        data_name: `${verify.email} mencoba mengubah sel "${tangki} - ${node}"  menjadi "${!isActive ? "Aktif": "Tidak Aktif"}" `,
        value: !isActive,
        prev_value: isActive,
        activity: "update"
      });

      nl.save();
}

exports.find = async(req, res ) => {
    let {from, to} = req.body;

    if(!from){
        res.status(400).send({error: "from is required"});
        return;
    }

    let find = to ? {$and: [{timeStamp: {$lte: from}}, {timeStamp: {$gte: to}} ]} : {timeStamp: {$lte: from}};

    controller.find(res, Diagnostic, req.query, find, {timeStamp:-1});
}

exports.findLast = async(req, res ) => {
  
    
    controller.findOne(res, Diagnostic, req.query, {}, {timeStamp_server:-1});
}

exports.delete = async(req, res) =>{

   

    // const f = await Diagnostic.findOne({user_id: user_id, mac: mac}).exec();

    controller.delete(res, Diagnostic, req.params.id);

    

    
}