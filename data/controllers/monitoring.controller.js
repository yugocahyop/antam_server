
const Monitoring = require("../models/monitoring.model.js");

const controller = require("./controller.js");

const inputList =  [ 
    "timeStamp",
    "tangkiData" 
];

const struct =  {
    timeStamp: "Number",
    tangkiData : "Array",
};

exports.structMonitoring = struct;
exports.inputListMontioring = inputList;


exports.create =  async(req, res) => {

    
    controller.create(res, Monitoring, req.body, { }, inputList, struct , "Monitoring" );
}

exports.update =  async(req, res) => {
   
    

  
    // console.log(f);

   
    controller.update(res, Monitoring, req.body, req.params.id, inputList, struct , "Monitoring" );
    
}

exports.find = async(req, res ) => {
    let {from, to} = req.body;

    if(typeof from === 'undefined'){
        res.status(400).send({error: "from is required"});
        return;
    }

    let find = to ? {$and: [{timeStamp: {$gte: from}}, {timeStamp: {$lte: to}} ]} : {timeStamp: {$gte: from}};

    controller.find(res, Monitoring, req.query, find, {timeStamp:-1});
}

exports.findLast = async(req, res ) => {
  
    
    controller.findOne(res, Monitoring, req.query, {}, {timeStamp_server:-1});
}

exports.delete = async(req, res) =>{

   

    // const f = await Monitoring.findOne({user_id: user_id, mac: mac}).exec();

    controller.delete(res, Monitoring, req.params.id);

    

    
}