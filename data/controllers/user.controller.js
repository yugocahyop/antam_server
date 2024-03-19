const User = require("../models/account.model.js");


const controller = require("./controller.js");

exports.update =  async(req, res) => {
   
    

  
    // console.log(f);

    const tokenBearer = req.headers.authorization + "";
       
    const token = tokenBearer.replace("Bearer ", "");

    const jwt = require("jsonwebtoken");

    let user_id = "";

    try {

      const verify = jwt.verify(token, process.env.TOKEN_KEY);

    // let emailCheck = "";

    

    if(!verify){

        res.status(403).send({error: "access forbidden"});
        return;
       }else{
         const usr = await User.findOne({email: verify.email,}, {email:1, isAdmin:1}).exec();

        //  emailCheck = verify.email;
         user_id = usr._id + "";

        // res.status(200).send(usr);
         if (!usr.isAdmin){
            res.status(403).send({error: "access forbidden"});
            return;
         }
       }

       let log = function (db, body, user_id, verify){
        const Log = require("../models/log.model.js");
        let nl = new Log({
          user_id: user_id,
          // ip: String,
          // mac: String,
          email: verify.email,
          datetime: Date.now(),
          table: "Account",
          data_id: db._id,
          data_name: `${verify.email} mengubah role Akun "${db.email}" dari "${db.role}"  menjadi "${body.role}" `,
          value: body.role,
          prev_value: db.role,
          activity: "update"
        });
  
        nl.save();
      };
  
     
      controller.update(res, User, req.body, req.params.id, ["role", "isAdmin"], {role: "String", isAdmin: "Boolean" } ,  log, user_id, verify );
      
    } catch (error) {
      res.status(403).send({error: "access forbidden"});
        return;
    }

    

    
    
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

       try {
        const verify = jwt.verify(token, process.env.TOKEN_KEY);

        if(!verify){

          res.status(403).send({error: "access forbidden"});
          return;
         }else{
           const usr = await User.findOne({email: verify.email,}, {email:1, isAdmin:1}).exec();
  
          res.status(200).send(usr);
          return;
         }
       } catch (error) {
          return res.status(403).send({error: "access forbidden"});
       }

       


    }
   
    let find = qString === ""? {active: true} : {$or: [{email: {$regex: key, $options: "i"}}, {role: {$regex: key, $options: "i"}} ],  active: true} ;

    controller.find(res, User, req.query, find, {timeStamp:-1}, {email: 1, isAdmin: 1, _id: 1});
}