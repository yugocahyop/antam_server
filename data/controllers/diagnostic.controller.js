
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

    
    controller.create(res, Diagnostic, req.body, { }, inputList, struct , "Diagnostic" );
}

exports.update =  async(req, res) => {
   
    

  
    // console.log(f);

   
    controller.update(res, Diagnostic, req.body, req.params.id, inputList, struct , "Diagnostic" );
    
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