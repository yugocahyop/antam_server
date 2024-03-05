
const Alarm = require("../models/alarm.model.js");

const controller = require("./controller.js");

const inputList =  [ 
    "timeStamp",
    "tangkiData" 
];

const struct =  {
    timeStamp: "Number",
    tangkiData : "Array",
};

exports.structAlarm = struct;
exports.inputListMontioring = inputList;


exports.create =  async(req, res) => {

    
    controller.create(res, Alarm, req.body, null, inputList, struct , "Alarm" );
}

exports.update =  async(req, res) => {
   
    

  
    // console.log(f);

   
    controller.update(res, Alarm, req.body, req.params.id, inputList, struct , "Alarm" );
    
}

exports.find = async(req, res ) => {
    let {from, to} = req.body;

    if(typeof from === 'undefined'){
        res.status(400).send({error: "from is required"});
        return;
    }

    let find = to ? {$and: [{timeStamp_server: {$gte: from}}, {timeStamp_server: {$lte: to}} ]} : {timeStamp_server: {$gte: from}};

    controller.find(res, Alarm, req.query, find, {timeStamp_server:-1});
}

exports.findLast = async(req, res ) => {
  
    
    controller.findOne(res, Alarm, req.query, {}, {timeStamp_server:-1});
}

exports.delete = async(req, res) =>{

   

    // const f = await Alarm.findOne({user_id: user_id, mac: mac}).exec();

    controller.delete(res, Alarm, req.params.id);

    

    
}