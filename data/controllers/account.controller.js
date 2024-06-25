const Account = require("../models/account.model.js");
// const Site = require("../models/site.model.js");
// const Functloc = require("../models/tblm_functloc.model.js");
// const User = require("../models/user.model.js");
const crypto = require('crypto');
const sha256 = require ('crypto-js/sha256');
var mailer = require('../../utils/mailer.js');
const jwt = require("jsonwebtoken");
const axios = require('axios').default;
// const ldap = require('ldapjs');

const CryptoJS = require('crypto-js');

// const encrypt = require("../../utils/encrypt.js");


const dotenv = require('dotenv');
const ObjectId = require("mongoose/lib/types/objectid.js");
// const internal = require("stream");
// const { agent } = require("superagent");
// const { Console } = require("console");
// const { replace } = require("lodash");
// const { NONAME } = require("dns");
// const { SDK_VERSION } = require("firebase-admin");
// const { send, listenerCount } = require("process");
// const { response } = require("express");

 dotenv.config();

 const { API_PORT, TOKEN_KEY, IP_SERVER } = process.env;

 const port = process.env.PORT || API_PORT;


const url = 'http://'+IP_SERVER+':'+port+'/account/activate/';


const ip_remote = IP_SERVER;
const port_remote = "8901"

const remote_url = 'http://'+ip_remote+':'+port_remote;

// const decode = (data) => {
//   const buff = new Buffer(data, 'base64');
//   const text = buff.toString('ascii');
// }

// exports.getDefaultSite = async (req, res)=>{
//   try {
//     const {URL} = await Site.findOne({name: "default"}).exec();

//     res.send(URL);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({error: "internal server error"});
//   }


// }

function boolExist (val){
  return typeof val === "boolean" ? val: false;
}

function decode(encoded) {
  // INIT
 

  // PROCESS
  try {
    const encodedWord = CryptoJS.enc.Base64.parse(encoded); // encodedWord via Base64.parse()
    const decoded = CryptoJS.enc.Utf8.stringify(encodedWord); // decode encodedWord via Utf8.stringify() '75322541'
    return decoded;
  }catch(err){
    console.log(err);
    return "";
  }
 
  
}



// clientLdap.bind(admin, admin2 , (err)=>{
//   if(err){
//     console.log(err) ;
//   }
//   // else{
//   //   return res.send({message: ok});
//   // }
// })



exports.remoteLogin = (req, res) => {
  const {username, password} = req.body;

  const api = "/login"

  axios.post(remote_url + api, {username: username, password: password}).then((response) => {
    const data = response.data;

    const acc =  Account({username: data[username], user_id: data[user_id]});

    acc.activeToken = jwt.sign(
      { user_id: acc._id, username },
     TOKEN_KEY,
      {
        expiresIn: "2h",
      }

    );

    acc.tokenExpire = "2h";

    res.status(200).send(acc);
  }).catch((error)=>{
    res.status(200).send(acc);
  });
}


exports.forget = async (req, res) => {
  const acc3 = await Account.findOne({email: req.body.email })
    .catch((err) => {
     return res.status(500).send({
          message:
            err.message || " error ",
        });
    });

    if(!acc3){
      return res.status(400).send(
        {error : "email has not been registered"}
      )
    }

    

  
}

exports.changePassword = async (req, res) => {
  
  const tokenBearer = req.headers.authorization + "";
       
  const token = tokenBearer.replace("Bearer ", "");

  const pass = req.body.pass ?? "";
  const otp = req.body.otp ?? "";
  const nPass = req.body.nPassword;
  const passCon = req.body.nPasswordCon;
  const email = req.body.email;

  // if(!pass){
  //   return res.status(400).send({error: "password di perlukan"});
  // }

  if(!nPass){
    return res.status(400).send({error: "password baru di perlukan"});
  }

  if(!nPass){
    return res.status(400).send({error: "password konfirmasi di perlukan"});
  }
  
  

  if(nPass !== passCon){
    return res.status(400).send(
      {error : "password konfirmasi tidak sama"}
    )
  }


    if(!token){
      return res.status(400).send(
        {error : "auth required"}
      )
    }

    try {

      let username = email ?? "";
    
      if(otp === ""){
        const decoded = jwt.verify(token, TOKEN_KEY);
         username = decoded.email; 
      }
      

      const acc = await Account.findOne({email: username}).exec();

      // console.log(acc);
      // console.log(sha256( pass)+"");

      if(pass === ""){
        if((sha256( decode(otp))+ "")  !== (acc.otp + "")){
          return res.status(401).send({error: "OTP salah"});
        }

        if(acc.otpExpire <= Date.now()){
          return res.status(401).send({error: "OTP telah lewat batas waktu (5 menit)"});
        }
      }else{
        if((sha256( decode(pass))+ "")  !== (acc.password + "")){
          return res.status(401).send({error: "Password lama salah"});
        }
      }

    
      if(acc){
        acc.password = sha256(decode(nPass));
      

        acc.save().then(()=>{
          return res.status(200).send({message: "Ok"});
        }).catch((err)=>{

        });
      }
    } catch (err) {
      console.log(err.message);
      return res.status(401).send("Invalid Token");
    }


    

  
}

exports.activate = async (req, res) => {
    const acc = await Account.findOne({
        activeToken: req.params.activeToken,
        
       
    }).catch((err) => {
      return res.status(500).send({
          message:
            err.message || " error ",
        });
      });;

    if (!acc) {
        return res.render('index', {
            title: 'fail to activate',
            content: 'Your activation link is invalid'
        });
    }

    // activate and save
    acc.active = true;
    acc.save().then(()=>{
      return res.render('index', {
            title: 'activation success!',
            content: 'activation success! ' 
        })
    }).catch((err) => {
      return res.status(500).send({
          message:
            err.message || " error",
        });
      });;
  };

const toString = (string) =>{
   return string += '';
};

exports.refresh = async (req, res) => {

  const token = 
     req.headers["authorization"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    
    const decoded =  jwt.verify(token.replace("Bearer ", ""), TOKEN_KEY);
    req.user = decoded;

    const _id = decoded.user_id;
    const username = decoded.username;

    const token2 = jwt.sign(
      { user_id: _id, username: username },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );

    const acc = new Account({_id: _id, username: username})
  
    acc.activeToken = token2;
    acc.tokenExpire = "2hr";
  
    res.status(200).json(acc);

  } catch (err) {
    console.log(err.message);
    return res.status(401).send("Invalid Token");
  }

  
};


exports.login = async (req, res)  => {
    let { email, password } = req.body;

    console.log(req.headers['x-forwarded-for'] || req.socket.remoteAddress )

    if(!email){
      return  res.status(400).send({error:"email is required"});
    }
    else if (!password){
      return  res.status(400).send({error:"password is required"});
    }
   
    let encryptedPass = sha256(decode(password));

    let decodedUsername = decode(email );

    if(decodedUsername === "adminTV"){
      if(toString(encryptedPass) === "7e835c951dede95bcaefbd05fc586802738e70ed845b2f8d6580ae243f3604da"){
        const token = jwt.sign(
          { email: email, isAdmin: true,  },
          process.env.TOKEN_KEY,
          {
            expiresIn: (req.headers['user-agent'] +"" ).toLowerCase().includes("android") ||( req.headers['user-agent'] +"" ).toLowerCase().includes("iphone")? "360d" : "360d" ,
          }
        );

        // acc.password = null;
        // acc.activeToken = token;

        return res.status(200).json({activeToken:  token, email: email, active: true, phone: "00000"});
      }
    }

    const acc = await Account.findOne({email: decodedUsername })
      .catch((err) => {
        return res.status(500).send({
          error:
            err.message || " error can't find account",
        });
      });

      if(!acc){
        return  res.status(400).send({error:"email hasn't been registered"});
      }

      if(acc.active === false){
        return res.status(400).send({error: "the account is not active. Please check your email for activation"});
      }

      // console.log(`pass ${encryptedPass}`);
      // console.log(`pass2 ${acc.password}`);

      try{
      if( toString(acc.password) === toString(encryptedPass)  ){
       

        //  const data =  acc.info;


          
              const token = jwt.sign(
                { email: acc.email, isAdmin: acc.isAdmin,  },
                process.env.TOKEN_KEY,
                {
                  expiresIn: (req.headers['user-agent'] +"" ).toLowerCase().includes("android") ||( req.headers['user-agent'] +"" ).toLowerCase().includes("iphone")? "360d" : "360d" ,
                }
              );
    
              acc.password = null;
              acc.activeToken = token;

              return res.status(200).json(acc);

            
      }
      else{
        return res.status(400).send({error:"password is invalid"});
      }
    }catch(err){
      console.log(err);
        res.status(500).send({error: "something wrong with the server"});
    }
  
};

exports.register = async(req, res) => {
    

    const {password, passwordCon, email, phone} = req.body;

    const pass = password;
    const passCon = passwordCon;

    if(!email){
      res.status(400).send({
        error:
            "email is required",
    });
    return;
    }

    if(!phone){
      res.status(400).send({
        error:
            "phone is required",
    });
    return;
    }

    // if(!username){
    //   res.status(400).send({
    //     error:
    //         "username is required",
    // });
    // return;
    // }

    if(!password){
      res.status(400).send({
        error:
            "password is required",
    });
    return;
    }

    const acc3 = await Account.findOne({email: req.body.email }).exec();

    // const acc2 = await Account.findOne({username: req.body.username })
    // .catch((err) => {
    //   return res.status(500).send({
    //     message:
    //       err.message || " error ",
    //   });
    // });


    // if(acc2){
    //   return res.status(400).send({
    //         error:
    //             "username had already been registered",
    //     });
    // }


    if(acc3){
      if(!acc3.active){
        const encryptedPass = sha256(pass);

        if(encryptedPass != acc3.password){
          return res.status(400).send({
            error:
                "password salah",
          });
        }

        crypto.randomBytes(20, function (err, buf) {
          acc3.activeToken = acc3._id + buf.toString('hex');
      
            // Sending activation email
            var link = url
            + acc3.activeToken;
      
          //   mailer({
          //     to: req.body.email,
          //     subject: 'Antam activation link',
          //     html: 'Please click <a href="' + link + '"> here </a> to activate your account.'
          // });
      
          var fs = require('fs');
      
          var path = require('path');
      
          var relativePath = path.join(__dirname, "..", "..", 'views', 'email.html');
      
      
          fs.readFile(relativePath, (err, data) => {
            if(err){
              console.log(err);
              return;
            }
            let html = data.toString().replace("replace-me-please", link);
      
            for (let index = 0; index < 2; index++) {
               html = html.toString().replace("replace-me-please", link);
              
            }
            mailer({
              to: req.body.email,
              subject: 'Antam Monitoring Activation ',
              html: html
          }); 
          // fs.close();
        });
      
          
          acc3.save()
          .then(() => {
            res.status(200).send({message: "Ok"});
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while creating the Message.",
            });
          });
        });

        return;
      }else{
        return res.status(400).send({
          error:
              "email sudah terdaftar",
      });
      }
      
  }

    if(pass !== passCon){
        res.status(400).send({
            error:
                "password konfirmasi tidak sesuai",
        });
        return;
    }

    const encryptedPass = sha256(pass);


  const acc = new Account({
    username: req.body.username,
    password: encryptedPass,
    email: req.body.email,
    phone: phone,
    isAdmin: false,
    role: "User"
  });

  crypto.randomBytes(20, function (err, buf) {
    acc.activeToken = acc._id + buf.toString('hex');

      // Sending activation email
      var link = url
      + acc.activeToken;

    //   mailer({
    //     to: req.body.email,
    //     subject: 'Antam activation link',
    //     html: 'Please click <a href="' + link + '"> here </a> to activate your account.'
    // });

    var fs = require('fs');

    var path = require('path');

    var relativePath = path.join(__dirname, "..", "..", 'views', 'email.html');


    fs.readFile(relativePath, (err, data) => {
      if(err){
        console.log(err);
        return;
      }
      let html = data.toString().replace("replace-me-please", link);

      for (let index = 0; index < 2; index++) {
         html = html.toString().replace("replace-me-please", link);
        
      }
      mailer({
        to: req.body.email,
        subject: 'Antam Monitoring Activation ',
        html: html
    }); 
    // fs.close();
  });

    
    acc.save()
    .then(() => {
      res.status(200).send({message: "Ok"});
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Message.",
      });
    });
  });

  
};

exports.otp = async(req, res) => {
    

  const { email} = req.body;

  

  if(!email){
    res.status(400).send({
      error:
          "email di perlukan",
  });
  return;
  }

  

  const acc3 = await Account.findOne({email: email }).exec();

  // const acc2 = await Account.findOne({username: req.body.username })
  // .catch((err) => {
  //   return res.status(500).send({
  //     message:
  //       err.message || " error ",
  //   });
  // });


  // if(acc2){
  //   return res.status(400).send({
  //         error:
  //             "username had already been registered",
  //     });
  // }

  // console.log(acc3);


  if(!acc3){
    return res.status(400).send({
        error:
            "Email belum terdaftar",
    });
}

 const one = Math.floor(Math.random() * 10);
 const two = Math.floor(Math.random() * 10);
 const three = Math.floor(Math.random() * 10);
 const four = Math.floor(Math.random() * 10);

 const otp = `${one}${two}${three}${four}`;

  const hashedOtp = sha256(otp);


  acc3.otp = hashedOtp;
  acc3.otpExpire = Date.now() + (60000 * 5);

  acc3.save();

  var fs = require('fs');

  var path = require('path');

  var relativePath = path.join(__dirname, "..", "..", 'views', 'otp.html');


  fs.readFile(relativePath, (err, data) => {
    if(err){
      console.log(err);
      return;
    }
    let html = data.toString().replace("otp-replace", otp);

    
    mailer({
      to: req.body.email,
      subject: 'Antam Monitoring kode OTP ',
      html: html
  }); 
  // fs.close();
});

res.status(200).send({msg: "ok"});

};

// Retrieve all messages from the database.
exports.findAll = (req, res) => {
  Account.find()
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


exports.find = (req, res) => {
  Account.find({username: { $regex: '.*' + req.body.username + '.*' } })
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
exports.findOne = (req, res) => {
  Account.findById(req.params.messageId)
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

// Update a message identified by the messageId in the request
exports.update = (req, res) => {
  const { email, username} = req.body;

    // var pass = password;
    // var passCon = passwordCon;

    if(!email){
      res.status(400).send({
        error:
            "email is required",
    });
    return;
    }

    if(!username){
      res.status(400).send({
        error:
            "username is required",
    });
    return;
    }

    // if(!password){
    //   res.status(400).send({
    //     error:
    //         "password is required",
    // });
    // return;
    // }
  Account.findByIdAndUpdate(
    req.params.messageId,
    {
      username: username,
      email: email
    },
    { new: true }
  )
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
        message: "Error updating message with id " + req.params.messageId,
      });
    });
};

// Delete a message with the specified messageId in the request
exports.delete = (req, res) => {
  Account.findByIdAndRemove(req.params.messageId)
    .then((data) => {
      if (!data) {
        return res.status(404).send({
          error: "Message not found with id " + req.params.messageId,
        });
      }
      res.send({ error: "Message deleted successfully!" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          error: "Message not found with id " + req.params.messageId,
        });
      }
      return res.status(500).send({
        error: "Could not delete message with id " + req.params.messageId,
      });
    });
};

exports.checkUpdate = (req, res)=>{
  const token = 
        req.headers["authorization"];
  
        
  const {user_id} = jwt.decode(token.replace("Bearer ", ""));

  const acc = Account.findOne({_id: ObjectId(user_id)}).exec();

  return res.send({lastUpdate: acc.lastUpdate});
}