const Support_file = require("../models/support_file.model.js");
const formidable = require('formidable');
const fs = require('fs');
// const { count } = require("console");
const ObjectId = require("mongoose/lib/types/objectid.js");
// const { object, toObject } = require("mongoose/lib/utils.js");

const Log = require("../models/log.model.js");

const roleChecker = require("../../utils/roleChecker.js");

const jwt = require("jsonwebtoken");

exports.download = async (req, res) =>{
  try{
    const {nama} = req.body;

    if(!nama){
      res.status(400).send({error: "nama is required"})
    }

    res.download("support/"+ nama);
  }catch(err){
    console.log(err);
    return res.status(500).send({error: "internal server error"});
  }
  
}

// Create and Save a new Message
exports.create = async (req, res) => {
  try {

    const access = await roleChecker(req.headers, "se");

    if(!( access )) {
      return res.status(403).send({error: "restricted access"});
    }
  
    const token = 
        req.headers["authorization"];
  
      // const { category} = req.body;
      
  
      // if(title){
      //     return res.status(400).send({error: "title is required"});
      // }
  
      
  
      const form = new formidable.IncomingForm();
      
      form.parse(req, async function  (err, fields, files) {
  
        // console.log(fields);
  
        //  console.log(files);
  
        const {category, deskripsi, jenis, versi, nama, url} = fields;
  
        const isLink = jenis?( ((jenis +"").toLocaleLowerCase()) === "link") : false;
  
        if(!category){
          return res.status(400).send({error: "category is required"});
      }
  
        // let fileExtension = "";
  
        if(!files && !isLink ){
          return res.status(400).send({error: "file is required"});
        }
  
        if(!files.file  && !isLink){
          return res.status(400).send({error: "file is required"});
        }
  
        if(isLink && !nama){
         
            return res.status(400).send({error: "nama is required"});
          
        
        }else if (isLink && nama){
          const n = await Support_file.findOne({name: nama}).exec();
          
          if(n){
            return res.status(400).send({error: "link is already taken"});
          }
          const sf = new Support_file({
            name: nama || "",
            category: category,
            deskripsi: deskripsi||"",
            versi: versi || "",
            jenis: jenis || "link",
            url: url || "",
            datetime: Date.now()
          });
        
          sf
            .save()
            .then((data) => {
              res.send({message: "ok"});
  
              const decoded = jwt.decode(token.replace("Bearer ", ""));
  
            const user_id = decoded.user_id;
      
            const log = new Log({
              user_id: user_id,
              ip:   (req.ip + "").replace("::ffff:", ""),
              username: decoded.username,
              table: "support",
              datetime: Date.now(),
              data_id : data._id.toString(),
              data_name: sf.name,
              value: fields,
              activity: "create",
            });
      
            log.save();
            })
            .catch((err) => {
                console.log(err);
              res.status(500).send({
                message:
                  err.message || "Some error occurred while creating the Support_file.",
              });
            });
  
            return;
    
    
       
        }
  
       
  
       
        const oldpath = files.file.filepath + "";
  
        // console.log(`oldpath ${oldpath}`);
  
        const dir = './support';
  
        console.log(files.file.originalFilename)
  
        const fileName =files.file.originalFilename;
  
        const split = (files.file.originalFilename + "").split('.');
        const fileExtension = split[split.length -1];
        const newpath = dir + "/"+( nama ? (nama +"." +fileExtension) :fileName) ;
  
        const n = await Support_file.findOne({name: nama? (nama +"." +fileExtension) : fileName }).exec();
          
        if(n){
          return res.status(400).send({error: "name is already taken"});
        }
  
        await fs.rename(oldpath, newpath, function (err) {
          if (err) return res.status(400).send({error: err.message || "error"})
  
          const sf = new Support_file({
            name:nama? (nama +"." +fileExtension) : fileName ,
            category: category,
            deskripsi: deskripsi||"",
            versi: versi || "",
            jenis: jenis || fileExtension,
            datetime: Date.now()
          });
        
          sf
            .save()
            .then((data) => {
              res.send({message: "ok"});
    
              const decoded = jwt.decode(token.replace("Bearer ", ""));
    
              const user_id = decoded.user_id;
        
              const log = new Log({
                ip:   (req.ip + "").replace("::ffff:", ""),
                user_id: user_id,
                username: decoded.username,
                table: "support",
                datetime: Date.now(),
                data_id : data._id.toString(),
                data_name: sf.name,
                value: fields,
                activity: "create",
              });
        
              log.save();
            })
            .catch((err) => {
                console.log(err);
              return res.status(500).send({
                message:
                  err.message || "Some error occurred while creating the Support_file.",
              });
            });
        });
  
        
  
  
      });
    
  } catch (err) {
    console.log(err);
    return res.status(500).send({error: "internal server error"});
  }



  
};

function escapeRegex(string) {
  return string.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
}

// Retrieve all messages from the database.
exports.findAll = async (req, res) => {

  try {

    let {category} = req.body;
    let {limit, offset, keyword, orderAscending, orderDescending}= req.query;
    
    let matchfilter = {};
  
  
    if(category){
      matchfilter =  Object.assign({},matchfilter, {category: category});
    }

    if(keyword){
      matchfilter = Object.assign({}, matchfilter, {name: {$regex: escapeRegex(keyword)}});
    }
     
  
    // if(title){
    //   Object.assign(matchfilter, {title: title} );
    // }
  
    let  l, o;
  
    const count = await Support_file.count(matchfilter).exec();
  
    if(isNaN(limit)  ){
      l = null;
    }else{
      l = limit;
    }
  
    if(isNaN(offset)){
      o = null;
    }
    else{
      o = offset;
    }

    let orderFlag = orderAscending || orderDescending ? {}: {datetime: -1};

  if(orderDescending){

    let orderString = orderDescending +"";

    // console.log(orderAscending);

    let splitOrder = orderString.split(",");

    for(let i= 0; i< splitOrder.length; i++){
      let val = splitOrder[i];

      if(val.includes("Nama")){

        // orderFlag["username"] = 1;
        orderFlag = Object.assign({}, orderFlag, {"name": 1});
       
      }
      else if(val.includes("Date")){
        // orderFlag["nama"] = 1;
        orderFlag = Object.assign({}, orderFlag, {"datetime": 1});
  
      }
      else if(val.includes("Versi")){
        // orderFlag["UPT"] = 1;
        orderFlag = Object.assign({}, orderFlag, {"versi": 1});
  
      }
      else if(val.includes("Deskripsi")){
        // orderFlag["role"] = 1;
        orderFlag = Object.assign({}, orderFlag, {"deskripsi": 1});
      }

      else if(val.includes("Jenis")){
        // orderFlag["role"] = 1;
        orderFlag = Object.assign({}, orderFlag, {"jenis": 1});
      }
     
     
    }

  }

  if(orderAscending){
    
    let orderString = orderAscending +"";

    // console.log(orderAscending);

    let splitOrder = orderString.split(",");

    for(let i= 0; i< splitOrder.length; i++){
      let val = splitOrder[i];

      if(val.includes("Nama")){

        // orderFlag["username"] = 1;
        orderFlag = Object.assign({}, orderFlag, {"name": -1});
       
      }
      else if(val.includes("Date")){
        // orderFlag["nama"] = 1;
        orderFlag = Object.assign({}, orderFlag, {"datetime": -1});
  
      }
      else if(val.includes("Versi")){
        // orderFlag["UPT"] = 1;
        orderFlag = Object.assign({}, orderFlag, {"versi": -1});
  
      }
      else if(val.includes("Deskripsi")){
        // orderFlag["role"] = 1;
        orderFlag = Object.assign({}, orderFlag, {"deskripsi": -1});
      }

      else if(val.includes("Jenis")){
        // orderFlag["role"] = 1;
        orderFlag = Object.assign({}, orderFlag, {"jenis": -1});
      }
     
     
    }
  }
  
   const data = await Support_file.find(matchfilter).sort(orderFlag).skip(o|| 0).limit(l || count).exec();
  
      try{
  
        if(data){
          res.send({count: count, data: data});
        }
        
      }
      catch(err) {
        console.log(err);
        res.status(500).send({
         
          error:
            err.message || "Some error occurred while retrieving Support_file.",
        });
      };
    
  } catch (err) {
    console.log(err);
    return res.status(500).send({error: "internal server error"});
  }

  
 


};



// Find a single message with a messageId
exports.findOne = (req, res) => {
  Support_file.findById(req.params.messageId)
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
          message: "Support_file not found with id " + req.params.messageId,
        });
      }
      return res.status(500).send({
        message: "Error retrieving Support_file with id " + req.params.messageId,
      });
    });
};

// Update a message identified by the messageId in the request
exports.update = async (req, res) => {
  try {

    const access = await roleChecker(req.headers, "se");
    if(!access) {
      return res.status(403).send({error: "restricted access"});
    }
  
    const token = 
        req.headers["authorization"];
  
      // const { category} = req.body;
      
  
      // if(title){
      //     return res.status(400).send({error: "title is required"});
      // }
  
      const _id =req.params.messageId;
  
      const form = new formidable.IncomingForm();
  
      const sf = await Support_file.findOne({_id: ObjectId(_id)}).exec();
  
      if(!sf){
        return res.status(400).send({error: "file id is not found"});
      }
  
      console.log(sf);
      
      form.parse(req, async function  (err, fields, files) {
  
        // console.log(fields);
  
        //  console.log(files);
  
        const {category, deskripsi, jenis, versi, nama, url} = fields;
  
        const isLink = jenis?( ((jenis +"").toLocaleLowerCase()) === "link") : false;
        const isNameChanged = !(!nama ? true : (nama === sf.name));
  
      //   if(!category){
      //     return res.status(400).send({error: "category is required"});
      // }
  
        // let fileExtension = "";
  
        if(!files && !isLink && isNameChanged ){
          return res.status(400).send({error: "file is required"});
        }
  
        if(!files.file  && !isLink && isNameChanged){
          return res.status(400).send({error: "file is required"});
        }
  
        if(isLink && !nama){
         
            return res.status(400).send({error: "nama is required"});
          
        
        }
        // else if (isLink && nama){
         
        //   sf.name = nama ||sf.name;
        //   sf.category = category || sf.category;
        //   sf.deskripsi = deskripsi || sf.deskripsi;
        //   sf.versi = versi || sf.versi;
        //   sf.datetime = Date.now();
        //   sf.jenis =  "link";
        //   sf.url = url || sf.url;
        
        //   sf
        //     .save()
        //     .then((data) => {
        //       res.send({message: "ok"});
  
        //       const decoded = jwt.decode(token.replace("Bearer ", ""));
  
        //       const user_id = decoded.user_id;
        
        //       const log = new Log({
        //         ip:   (req.ip + "").replace("::ffff:", ""),
        //         user_id: user_id,
        //         username: decoded.username,
        //         table: "support",
        //         datetime: Date.now(),
        //         data_id : req.params.messageId,
        //         data_name: sf.name,
        //         value: fields,
        //         activity: "update",
        //       });
        
        //       log.save();
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //       return res.status(500).send({
        //         message:
        //           err.message || "Some error occurred while creating the Support_file.",
        //       });
        //     });
  
        //     return;
    
    
       
        // // }
        // else if(!files.file && !isNameChanged){
         
        //   sf.category = category || sf.category;
        //   sf.deskripsi = deskripsi || sf.deskripsi;
        //   sf.versi = versi || sf.versi;
        //   // sf.datetime = Date.now();
        //   sf.jenis = jenis || sf.jenis ;
        
        //   sf
        //     .save()
        //     .then((data) => {
        //       res.send({message: "ok"});
  
        //       const decoded = jwt.decode(token.replace("Bearer ", ""));
  
        //       const user_id = decoded.user_id;
        
        //       const log = new Log({
        //         ip:   (req.ip + "").replace("::ffff:", ""),
        //         user_id: user_id,
        //         username: decoded.username,
        //         table: "support",
        //         datetime: Date.now(),
        //         data_id : req.params.messageId,
        //         data_name: sf.name,
        //         value: fields,
        //         activity: "update",
        //       });
        
        //       log.save();
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //       return res.status(500).send({
        //         message:
        //           err.message || "Some error occurred while creating the Support_file.",
        //       });
        //     });
  
        //     return;
        // }
  
       
  
       
        const oldpath = files.file.filepath + "";
  
        // console.log(`oldpath ${oldpath}`);
  
        const dir = './support';
  
        console.log(files.file.originalFilename)
  
        const fileName =files.file.originalFilename;
  
        const fileExtension = (files.file.originalFilename + "").split('.')[1];
        const newpath = dir + "/"+( nama ? (nama +"." +fileExtension) :fileName) ;

        if(isNameChanged){
  
          const n = await Support_file.findOne({name: nama? (nama +"." +fileExtension) : fileName }).exec();

          if( n){
            return res.status(400).send({error: "name is already taken"});
          }
        }
  
        await fs.rename(oldpath, newpath, function (err) {
          if (err) return res.status(400).send({error: err.message || "error"})
  
          sf.name = files.file ?  (nama? (nama +"." +fileExtension) : fileName) :( nama || "");
          sf.category = category || sf.category;
          sf.deskripsi = deskripsi || sf.deskripsi;
          sf.versi = versi || sf.versi;
          sf.datetime = Date.now();
          sf.jenis =  jenis || fileExtension;
        
          sf
            .save()
            .then((data) => {
              res.send({message: "ok"});
    
              const decoded = jwt.decode(token.replace("Bearer ", ""));
    
          const user_id = decoded.user_id;
    
          const log = new Log({
            ip:   (req.ip + "").replace("::ffff:", ""),
            user_id: user_id,
            username: decoded.username,
            table: "support",
            datetime: Date.now(),
            data_id : req.params.messageId,
            data_name: sf.name,
            value: fields,
            activity: "update",
          });
    
          log.save();
            })
            .catch((err) => {
                console.log(err);
             return res.status(500).send({
                message:
                  err.message || "Some error occurred while creating the Support_file.",
              });
            });
        });
  
      
  
      
  
  
      });
    
  } catch (err) {
    console.log(err);
    return res.status(500).send({error: "internal server error"});
  }
 
};

// Delete a message with the specified messageId in the request
exports.delete = async (req, res) => {

  try {
    const access = await roleChecker(req.headers, "se");

  if(!access) {
    return res.status(403).send({error: "restricted access"});
  }

  const token = 
      req.headers["authorization"];


  Support_file.findByIdAndRemove(req.params.messageId)
    .then((data) => {
      if (!data) {
        return res.status(404).send({
          message: "Message not found with id " + req.params.messageId,
        });
      }
      res.send({ message: "Support_file deleted successfully!" });

      const decoded = jwt.decode(token.replace("Bearer ", ""));

      const user_id = decoded.user_id;

      const log = new Log({
        ip:   (req.ip + "").replace("::ffff:", ""),
        user_id: user_id,
        username: decoded.username,
        table: "support",
        datetime: Date.now(),
        data_id : req.params.messageId,
        activity: "delete",
      });

      log.save();
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "Support_file not found with id " + req.params.messageId,
        });
      }
      return res.status(500).send({
        message: "Could not delete message with id " + req.params.messageId,
      });
    });
    
  } catch (err) {
    console.log(err);
    return res.status(500).send({error: "internal server error"});
  }

  
};