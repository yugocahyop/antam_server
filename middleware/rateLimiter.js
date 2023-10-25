

// const os =  require ("node:os");
const { RateLimiterMemory } = require("rate-limiter-flexible");

const dotenv = require('dotenv');

const os= require ('node:os');


 dotenv.config();

 const { LIMITER_POINT, LIMITER_DURATION } = process.env;

 const numCPUs = os.cpus().length -1;

const opts = {
  points: Math.ceil( LIMITER_POINT / numCPUs) , // 6 points
  duration: LIMITER_DURATION, // Per second
};

const rateLimiter = new RateLimiterMemory(opts);

const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = async (req, res, next) => {
    // const token =
    // req.headers["authorization"];

  rateLimiter.consume('', 1). then(()=>{
    const token =
     req.headers["authorization"];

    if (!token) {
        return res.status(403).send("A token is required for authentication");
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
 }) // consume 2 points
.catch(() => {
  // Not enough points to consume
  return res.status(403).send({message: "limiter blocked"});
});
  
};





module.exports = verifyToken;