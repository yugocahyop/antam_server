const Role = require("../models/role.model.js");
const User = require("../models/user.model.js");

const encrypt = require("../../utils/encrypt.js");
const Log = require("../models/log.model.js");

const roleChecker = require("../../utils/roleChecker.js");
const jwt = require("jsonwebtoken");

function boolExist (val){
    return typeof val === "boolean" ? val: false;
}

exports.create= async (req,res) => {
    const access = await roleChecker(req.headers, "rr");
    if(!access) {
        return res.status(403).send({error: "restricted access"});
      }
    let {role, wilayahKerja, supportEdit, dataMaster, userManagement, syncPeralatan, dataSetting, notificationGeneral, notificationTesting, dataView, faultLocator, mlAnalyzed, mlRecomendation, bayTesting, klarifikasiEvent, referensiEvent, support, dataPenghantar  } = req.body;

    if(!role){
       return res.status(400).send({error: "role is required"});
    }

    if(!wilayahKerja){
        return res.status(400).send({error: "wilayahKerja is required"});
     }

    const encodedRole = encrypt.encode(role+"");

    // console.log(encodedRole);

    const dataRole = await Role.findOne({$or : [{ b: encodedRole}, {a: encodedRole}]}).exec();

    if(dataRole){
       return res.status(400).send({error: "role is already registered"});
    }

    const oA = {se: boolExist(supportEdit) ,dm: boolExist(dataMaster), um: boolExist( userManagement) , sd: boolExist( syncPeralatan), is: boolExist( dataSetting),
         no: boolExist(notificationGeneral), tn: boolExist( notificationTesting), ev: boolExist ( dataView), 
         fl: boolExist ( faultLocator), am: boolExist( mlAnalyzed), ra: boolExist( mlRecomendation),  tb: boolExist( bayTesting), 
         ke: boolExist( klarifikasiEvent), re: boolExist( referensiEvent), su: boolExist( support), dp: boolExist( dataPenghantar), rr: false };

    const nRole = new Role({
        a: encodedRole,
        b: encodedRole,
        c: encrypt.encode(JSON.stringify(oA)),
        d: encrypt.encode(wilayahKerja)
    });

    await nRole.save().then((data)=>{

        const token = 
        req.headers["authorization"];
    
      const decoded = jwt.decode(token.replace("Bearer ", ""));

      const datetime = Date.now();


        const log = new Log({
            ip:   (req.ip + "").replace("::ffff:", ""),
            user_id: decoded.user_id,
            username: decoded.username,
            table: "role",
            datetime: datetime,
            data_id : data._id.toString() || "",
            data_name: encrypt.decode(data.a),
            value: { role : encrypt.decode(data.a)},
            activity: "create",
          });

        log.save();
    }).catch((err)=> {
        console.log(err);
        
        res.send({error: error || "internal server error"});
    });

    try{
        res.send({message: "ok"});
    }catch(err){

    }
}

function escapeRegex(string) {
    return string.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
  }

exports.findAll = async (req,res) => {
    
    const access = await roleChecker(req.headers, "um");
    if(!access) {
        return res.status(403).send({error: "restricted access"});
      }
    // let {role, userManagement, syncPeralatan, dataSetting, notificationGeneral, notificationTesting, dataView, faultLocator, mlAnalyzed, mlRecomendation } = req.body;

    let {limit, offset, keyword} =req.query;


    let  l, o;

    const count = await Role.count({}).exec();

  

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

    let matchFilter = {};

    if(keyword){
        matchFilter = Object.assign({}, matchFilter, {b: {$regex: encrypt.encode(escapeRegex(keyword))}});
      }
       

    const dataRole = await Role.find(matchFilter).skip(o|| 0).limit(l || count).exec();

    let array = [];

    for (let index = 0; index < dataRole.length; index++) {
        const value = dataRole[index];

        const dA = encrypt.decode(value.c);

        const dJ = JSON.parse(dA);

        const oA = {supportEdit: boolExist(dJ.se), dataMaster: boolExist(dJ.dm), userManagement: dJ.um , syncPeralatan: dJ.sd, dataSetting: dJ.is,
             notificationGeneral: dJ.no, notificationTesting: dJ.tn, dataView: dJ.ev,
              faultLocator: dJ.fl, mlAnalyzed: dJ.am, mlRecomendation: dJ.ra, bayTesting: boolExist(dJ.tb), 
              klarifikasiEvent: boolExist(dJ.ke), referensiEvent: boolExist(dJ.re), support: boolExist(dJ.su), dataPenghantar: boolExist(dJ.dp)};

        const role ={ _id: value._id.toString() ,  role : encrypt.decode(value.b), access: oA, wilayahKerja: value.d ? encrypt.decode(value.d): ""};

        array.push(role);
    }

    res.send({count: count, data: array});
}

exports.update= async (req,res) => {
    const access = await roleChecker(req.headers, "rr");
    if(!access) {
        return res.status(403).send({error: "restricted access"});
      }
      let {role, supportEdit, dataMaster, wilayahKerja, userManagement, syncPeralatan, dataSetting, notificationGeneral, notificationTesting, dataView, faultLocator, mlAnalyzed, mlRecomendation, bayTesting, klarifikasiEvent, referensiEvent, support, dataPenghantar  } = req.body;

    if(!role){
       return res.status(400).send({error: "role is required"});
    }


    const encodedRole = encrypt.encode(role+"");

    // console.log(encodedRole)

    const dataRoleID = await Role.findOne({$or : [{ b: encodedRole}, {a: encodedRole}]}).exec();

    if(dataRoleID && (dataRoleID._id.toString() !== req.params.id )){
       return res.status(400).send({error: "role is already registered"});
    }

    const dataRole = await Role.findById(req.params.id).exec();

    if(!dataRole){
        return res.status(400).send({error: "role not found"});
    }

    const oA = {se: boolExist(supportEdit) ,dm: boolExist( dataMaster),um: boolExist( userManagement) , sd: boolExist( syncPeralatan), is: boolExist( dataSetting),
        no: boolExist(notificationGeneral), tn: boolExist( notificationTesting), ev: boolExist ( dataView), 
        fl: boolExist ( faultLocator), am: boolExist( mlAnalyzed), ra: boolExist( mlRecomendation),  tb: boolExist( bayTesting), 
        ke: boolExist( klarifikasiEvent), re: boolExist( referensiEvent), su: boolExist( support), dp: boolExist( dataPenghantar), rr: ((role +"") === "admin") };

    dataRole.b = encodedRole;
    dataRole.c = encrypt.encode(JSON.stringify(oA));
    dataRole.d = wilayahKerja ? encrypt.encode(wilayahKerja) : dataRole.wilayahKerja ?? "";
   
    await dataRole.save().then((data)=>{

        const token = 
        req.headers["authorization"];
  
        
      const decoded = jwt.decode(token.replace("Bearer ", ""));

      const datetime = Date.now();

      const oA = {userManagement: boolExist( userManagement) , syncPeralatan: boolExist( syncPeralatan), dataSetting: boolExist( dataSetting), notificationGeneral: boolExist(notificationGeneral), notificationTesting: boolExist( notificationTesting), dataView: boolExist ( dataView), faultLocator: boolExist ( faultLocator), mlAnalyzed: boolExist( mlAnalyzed), mlRecomendation: boolExist( mlRecomendation)}

        const log = new Log({
            ip:   (req.ip + "").replace("::ffff:", ""),
            user_id: decoded.user_id,
            username: decoded.username,
            table: "role",
            datetime: datetime,
            data_id : data._id.toString() || "",
            data_name: encrypt.decode(data.a),
            value: {role: encrypt.decode(data.b), access: oA },
            activity: "update",
          });

        log.save();
    }).catch((err)=> {
        console.log(err);
        
        res.send({error: error || "internal server error"});
    });

    try{
        res.send({message: "ok"});
    }catch(err){

    }
   
}

exports.delete= async (req,res) => {

    const access = await roleChecker(req.headers, "rr");
    if(!access) {
        return res.status(403).send({error: "restricted access"});
      }

    const dataRole = await Role.findById(req.params.id).exec();


    if(!dataRole){
       return res.status(400).send({error: "role not found"});
    }

    if(( (dataRole.a + "") === encrypt.encode("admin"))||( (dataRole.a + "") === encrypt.encode("adminUPT"))||( (dataRole.a + "") === encrypt.encode("adminUIT"))||( (dataRole.a + "") === encrypt.encode("user"))){
      return res.status(400).send({error: "can't delete " + encrypt.decode( dataRole.a)});
    }

    const user = await User.findOne({role: encrypt.decode(  dataRole.a)}).exec();

    if(user){
        return res.status(400).send({error: "masih ada user dengan role " + encrypt.decode( dataRole.a)});
    }

   
    await dataRole.delete().then((data)=>{

        User

        const token = 
        req.headers["authorization"];
  

      const decoded = jwt.decode(token.replace("Bearer ", ""));

      const datetime = Date.now();

        const log = new Log({
            ip:   (req.ip + "").replace("::ffff:", ""),
            user_id: decoded.user_id,
            username: decoded.username,
            table: "role",
            datetime: datetime,
            data_id : data._id.toString() || "",
            data_name: encrypt.decode(data.a),
            value: {role: encrypt.decode(data.b) },
            activity: "delete",
          });

        log.save();
    }).catch((err)=> {

        if(err){
        console.log(err);
        
        res.send({error: error || "internal server error"});}
    });

    try{
        res.send({message: "ok"});
    }catch(err){

    }
}


