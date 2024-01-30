
const Statistic = require("../models/statistic.model.js");

const controller = require("./controller.js");

const inputList =  [ 
    "timeStamp",
 "totalWaktu",
 "teganganTotal",
 "arusTotal",
 "power",
 "energi",
];

const struct =  {
    timeStamp: "Number",
 totalWaktu: "Number",
 teganganTotal: "Number",
 arusTotal: "Number",
 power: "Number",
 energi: "Number",
};

exports.structStatistic = struct;
exports.inputListStatistic = inputList;


exports.update =  async(req, res) => {
   
    

  
    // console.log(f);

   
    controller.update(res, Statistic, req.body, req.params.id, inputList, struct , "Statistic" );
    
}

exports.find = async(req, res ) => {
    let {from, to} = req.body;

    if(!from){
        res.status(400).send({error: "from is required"});
        return;
    }

    let find = to ? {$and: [{timeStamp: {$lte: from}}, {timeStamp: {$gte: to}} ]} : {timeStamp: {$lte: from}};

    controller.find(res, Statistic, req.query, find, {timeStamp_server:-1});
}

exports.findLast = async(req, res ) => {
  
    
    controller.findOne(res, Statistic, req.query, {}, {timeStamp_server:-1});
}

exports.delete = async(req, res) =>{

   

    // const f = await Statistic.findOne({user_id: user_id, mac: mac}).exec();

    controller.delete(res, Statistic, req.params.id);

    

    
}