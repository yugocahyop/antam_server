
const jwt = require("jsonwebtoken");

const Role = require("../data/models/role.model.js");
const encrypt = require("./encrypt.js");

const config = process.env;

const verifyAccess = async (headers,access ) => {
  const token =
     headers["authorization"];

  if (!token) {
  //   return res.status(403).send("A token is required for authentication");
  // throw "A token is required for authentication" 
  return false;
  }
  try {
    
    const decoded = jwt.verify(token.replace("Bearer ", ""), config.TOKEN_KEY);

    const encodedRole = encrypt.encode(decoded.role);

    const a = await Role.findOne({a: encodedRole },{a:1,c:1}).exec();
    // console.log(a);

    if(!a){
      return false;
    }

    

    const decodedAccess = encrypt.decode(a.c + "");

    const objAcc = JSON.parse(decodedAccess);
    // req.user = decoded;

    // console.log(objAcc[access]);
    if(!objAcc[access]){
      
        return false;
    }

    return objAcc[access];

  } catch (err) {
    // res.status(401).send("Invalid Token");
    return false;
    
  }
//   return false;
};

// const verifyRole = (req,role) => {
//   const token =
//      req.headers["authorization"];

//   if (!token) {
//     // return res.status(403).send("A token is required for authentication");
//     // throw "A token is required for authentication"
//     return false;
//   }
//   try {
    
//     const decoded = jwt.verify(token.replace("Bearer ", ""), config.TOKEN_KEY);
//     // req.user = decoded;

//     if(!(decoded.role +"").toLowerCase().includes(role)){
//         return false
//     }

//     return true;

//   } catch (err) {
//     // res.status(401).send("Invalid Token");
//     // throw "Invalid Token";
//     return false;
    
//   }
// //   return false;
// };

module.exports = verifyAccess;