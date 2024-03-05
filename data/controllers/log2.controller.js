const Log = require("../models/log.model.js");

const controller = require("./controller.js");

function escapeRegex(string) {
    return string.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
  }

exports.find = async(req, res ) => {

    const idString = (req.query.id ?? "") + "";

    const qString = (req.query.q ?? "") + "";

    const key = escapeRegex(qString);

    if(idString !== ""){
       const tokenBearer = req.headers.authorization + "";
       
       const token = tokenBearer.replace("Bearer ", "");

       const jwt = require("jsonwebtoken");

       const verify = jwt.verify(token, process.env.TOKEN_KEY);

       if(!verify){

        res.status(403).send({error: "access forbidden"});
        return;
       }else{
         const usr = await User.findOne({email: verify.email,}, {email:1, isAdmin:1}).exec();

        res.status(200).send(usr);
        return;
       }
    }
   
    let find = qString === ""? {active: true} : {$or: [{email: {$regex: key, $options: "i"}}, {data_name: {$regex: key, $options: "i"}} ]} ;

    controller.find(res, Log, req.query, find, {datetime:-1}, {datetime: 1, data_name: 1 });
}