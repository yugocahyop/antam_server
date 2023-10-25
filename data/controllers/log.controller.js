const Log = require("../models/log.model.js");
const Device = require("../models/device.model.js");
const Relay = require("../models/tblu_relay.model.js");
const User = require("../models/user.model.js");

const roleChecker = require("../../utils/roleChecker.js");
const ObjectId = require("mongoose/lib/types/objectid.js");

function escapeRegex(string) {
  return string.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
}

// Retrieve all messages from the database.
exports.findAll = async (req, res) => {

  // const access = await roleChecker(req.headers, "ev");
  //   if(!access) {
  //       return res.status(403).send({error: "restricted access"});
  //     }
    let {user_id, table, data_id, bay, startDate, endDate, activity} = req.body;
    let skip = req.query.offset;
    let limit = req.query.limit;
    let keyword = req.query.keyword;
  
    // let dateStart;
    // let dateEnd;
  
   
    if(startDate){
      if(endDate){
        let splitStart = startDate.split("-");
        let splitEnd = endDate.split("-");  
  
        dateStart = Date.parse(splitStart[2]+"-"+splitStart[0]+"-"+splitStart[1]+"T00:00:00");
        dateEnd = Date.parse(splitEnd[2]+"-"+splitEnd[0]+"-"+splitEnd[1]+"T00:00:00");
  
        // console.log(dateStart);
      }
      
    }
  
    
    
    // Event.find({year: year|| {$gt :0}, month: ( year? month : null) || {$gt :0}, device_id : device_id || {$nin : [null, ""]}, dateTime: {$gte: dateStart || 0, $lte: dateEnd|| Infinity}}).sort({"dateTime" : -1}).skip(skip || 0).limit(limit || 0)
    //   .then((data) => {
    //     data.skip()
    //     res.send({data : data, count: Event.count});
    //   })
    //   .catch((err) => {
    //     res.status(500).send({
    //       message:
    //         err.message || "Some error occurred while retrieving messages.",
    //     });
    //   });

    let matchFilter = {};

    if(user_id){
      matchFilter = Object.assign({},matchFilter, {user_id: user_id}); 
    }

    if(data_id){
     matchFilter =  Object.assign({},matchFilter, {data_id: data_id}); 
    }

    if(table){
      matchFilter = Object.assign({},matchFilter, {table: table}); 
    }

    if(activity){
      matchFilter = Object.assign({},matchFilter, {activity: activity}); 
    }

    if(keyword){
      let or = [];
      const key = escapeRegex(keyword);
      
      or.push({"username": {$regex: key, $options: 'i'}});
      or.push({"role": {$regex: key, $options: 'i'}});
     
      matchFilter = Object.assign({},matchFilter,{$or: or} );
    }

    // user_id: user_id || {$nin : [null, ""]}, data_id: data_id || {$nin : [null, ""]}, activity: activity || {$nin : [null, ""]}, table: table || {$nin : [null, ""]}, datetime: {$gte: dateStart || 0, $lte: dateEnd|| Infinity}
  
    const data = await Log.aggregate([

     !keyword? {"$match": {}} : {  $lookup: { 
        from:  "users" ,
        'let': {"search":  "$user_id"}, 
              "pipeline":[
               { $project: {
                  _id: {
                    $toString: "$_id"
                  },
                  role:1
                }},
                {"$match": {"$expr":  {"$and" :[{$eq: ["$_id", "$$search"]}]} }},
                { $project:  { role :1, } },
              // {$project:  {monitoringEvent: {$reverseArray:"$monitoringEvent"}}} 
              ],
        
        as: "users"
    },

    
    
    }, 

    !keyword? {"$match": {}} :{$addFields: { role: "$users.role", }},

      { '$match'    : matchFilter },
      { '$sort'     : { 'datetime' : -1 } },
     
      {$facet:{
  
        "stage1" : [ {"$group": {_id:null, count:{$sum:1}}} ],
  
        "stage2" : [ { "$skip": (  skip && !bay ? parseInt(skip) :0) }, limit && !bay ? {"$limit": parseInt(limit) }: {$match: {}}, 
        // {'$lookup' : {
        //   from: "users",
        //   'let': {"search": {$toObjectId: "$user_id"}}, 
        //   "pipeline":[
        //     {"$match": {"$expr":{$eq: ["$_id", "$$search"]}}},
        //     { $project: { dataList: 0, monitoringEvent: 0 } }
        //   ],
        //   as: "detail"
        // }},

        // {$unwind: "$detail"},
      
        // {$addFields: {user_role: "$detail.role"}},
        // {$project : {detail: 0}}
      ]
  
      }},
    //  {$unwind: "$stage1"},
      //output projection
     {$project:{
        count: "$stage1.count",
        data: "$stage2"
     }}
  
    ]).exec();

        try{
          if(data.length == 0){
            return res.send(data);
        }

        let arr = [];

        for(let i=0; i < data[0].data.length; i++){
          let val= data[0].data[i];

          console.log(val);

          const user = await User.findOne({_id: ObjectId( val.user_id)}, ).exec();

          val = Object.assign({}, val, {user_role: user?  user.role : ""} );
          
          val = Object.assign({}, val, {NIP: user?  user.NIP : ""} );
        
        

          if(bay && (table + "") === "device"){
            const device = await Device.findOne({_id: ObjectId( val.data_id)}).exec();
            if(device){
              const r = await Relay.findOne({TECHIDENTNO: device.TECHIDENTNO}).exec();
              if(r){
                if(r.ID_FUNCTLOC === (bay+"") ){
                  arr.push(val);
                }
              }
            }
            // return res.send({count: arr.length, })
          }else{
            arr.push(val);
          }
        }

       
          res.send({count: bay? arr.length: data[0].count , data: arr });
        }
        catch(err) {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving messages.",
          });
        };


};

exports.find =async (req, res) => {
  // const access = await roleChecker(req.headers, "ev")
  //   if(!access) {
  //       return res.status(403).send({error: "restricted access"});
  //     }
  let limit = req.query.limit;

  if(limit){
    Log.find({message: { $regex: '.*' + req.body.message + '.*' } }).limit(limit)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving messages.",
      });
    });
  }
  
  Log.find({message: { $regex: '.*' + req.body.message + '.*' } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving messages.",
      });
    });
};

// Find a single message with a messageId
exports.findOne = async (req, res) => {
  const access = await roleChecker(req.headers, "ev")
    if(!access) {
        return res.status(403).send({error: "restricted access"});
      }
  Log.findById(req.params.messageId)
    .then((data) => {
      if (!data) {
        return res.status(404).send({
          message: "Message not found with id " + req.params.messageId,
        });
      }
      res.send(data);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Message not found with id " + req.params.messageId,
        });
      }
      return res.status(500).send({
        message: "Error retrieving message with id " + req.params.messageId,
      });
    });
};


// Delete a message with the specified messageId in the request
// exports.delete = (req, res) => {
//   Log.findByIdAndRemove(req.params.messageId)
//     .then((data) => {
//       if (!data) {
//         return res.status(404).send({
//           message: "Message not found with id " + req.params.messageId,
//         });
//       }
//       res.send({ message: "Message deleted successfully!" });
//     })
//     .catch((err) => {
//       if (err.kind === "ObjectId" || err.name === "NotFound") {
//         return res.status(404).send({
//           message: "Message not found with id " + req.params.messageId,
//         });
//       }
//       return res.status(500).send({
//         message: "Could not delete message with id " + req.params.messageId,
//       });
//     });
// };