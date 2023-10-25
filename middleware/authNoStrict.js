const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  const token =
     req.headers["authorization"];

  if (!token) {
    return next();
  }

  if(!(token+ "").includes("Bearer")){
    return res.status(401).send("Invalid Token");
  }
  
  try {
    
    const decoded = jwt.verify(token.replace("Bearer ", ""), config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("invalid token");
  }
  return next();
};

module.exports = verifyToken;