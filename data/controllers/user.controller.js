const User = require("../models/account.model.js");

const controller = require("./controller.js");

exports.update =  async(req, res) => {
   
    

  
    // console.log(f);

    const tokenBearer = req.headers.authorization + "";
       
    const token = tokenBearer.replace("Bearer ", "");

    const jwt = require("jsonwebtoken");

    const verify = jwt.verify(token, process.env.TOKEN_KEY);

    if(!verify){

        res.status(403).send({error: "access forbidden"});
        return;
       }else{
         const usr = await User.findOne({email: verify.email,}, {email:1, isAdmin:1}).exec();

        // res.status(200).send(usr);
         if (!usr.isAdmin){
            res.status(403).send({error: "access forbidden"});
            return;
         }
       }

   
    controller.update(res, User, req.body, req.params.id, ["role", "isAdmin"], {role: "String", isAdmin: "Boolean" } , "Monitoring" );
    
}

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
   
    let find = qString === ""? {active: true} : {$or: [{email: {$regex: key, $options: "i"}}, {role: {$regex: key, $options: "i"}} ],  active: true} ;

    controller.find(res, User, req.query, find, {timeStamp:-1}, {email: 1, isAdmin: 1, _id: 1});
}