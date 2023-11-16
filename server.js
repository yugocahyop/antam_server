const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cluster =  require('node:cluster');



// const {Server} =  require('socket.io');
// const Device = ("./models/device.model.js");

// const fs = require('fs');
const os= require ('node:os');

// const auth = require("./middleware/auth.js");

const http = require('http');
// const privateKey  = fs.readFileSync('/home/xirkabdg/ssl/private.key', 'utf8');
// const certificate = fs.readFileSync('/home/xirkabdg/ssl/certificate.crt', 'utf8');
// const credentials = {key: privateKey, cert: certificate};


mongoose.Promise = global.Promise;


const numCPUs = os.cpus().length -1;
const dotenv = require('dotenv');

 dotenv.config();

 const { API_PORT, MONGO_URI, } = process.env;

//  console.log(process.env);

        
        mongoose.connect(MONGO_URI, {
            useNewUrlParser: true
        }).then(() => {
            console.log("Successfully connected to the database");    
        }).catch(err => {
            console.log('Could not connect to the database. Error...', err);
            process.exit();
        });

 
    if (cluster.isMaster) {
        console.log(`Primary ${process.pid} is running`);

        const mqtt = require("mqtt");
        const client = mqtt.connect("mqtt://192.168.2.10:7005", {password: "xirka@30", username: "antam"});


        client.on("connect", () => {
          client.subscribe("antam/device", (err) => {
            if(err){
              console.log(err);
            }
          });

          console.log("connected mqtt");
        });

        client.on("message", (topic, message) => {
          // message is Buffer
          

          if(topic == "antam/device"){
            // console.log(message);
            let { timeStamp, tangkiData} = JSON.parse(message.toString());

            // console.log(tangkiData[0]);


            if(typeof timeStamp === 'undefined'){
              console.log("no timeStamp ");
              return;
            }else if(isNaN(timeStamp)){
              console.log("wrong timeStamp format");
              return;
            }

            if(typeof tangkiData === 'undefined'){
              console.log("no tangkiData ");
              return;
            }else if(typeof tangkiData[0] === 'undefined' || typeof tangkiData[0][0] !== 'object' ){
              console.log("wrong tangki data format");
              return;
            }
            
            let monit = require("./data/models/monitoring.model.js");

            let nMonit = new monit({
              timeStamp: timeStamp,
              tangkiData: tangkiData
            })

            nMonit.save().catch((err)=>{
              console.log(err);
             
          });
          }
          // client.end();
        });
        
        
        
        console.log(numCPUs);
        for (let i = 0; i < numCPUs; i++) {
          cluster.fork();
        }
      
        cluster.on('exit', (worker) => {
          console.log(`worker ${worker.process.pid} died`);
        });

        // const app = express();

        
        // require('./data/routes/notification.route.js')(app);
    // async function syncDb(){
        
    //   }
  
    


      } else {

        
        const app = express();

        const bodyParser = require('body-parser');

        app.set('trust proxy', ip => {
            return true;
        });

        app.use(cors());

        app.use(bodyParser.urlencoded({ extended: true }))

        app.use(bodyParser.json())

        app.set('view engine', 'pug')


        app.get('/', (req, res) => {
            res.json({"message": "Server is running :D"});
        });


        const port = process.env.PORT || API_PORT;


        require('./data/routes/account.route.js')(app);
        // require('./data/routes/kolam.route.js')(app);
        // require('./data/routes/feeder.route.js')(app);
        // require('./data/routes/jadwal.route.js')(app);
     

        // const httpsServer = https.createServer(credentials, app);

        const httpsServer = http.createServer( app);
            

        httpsServer.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        });
      
        console.log(`Worker ${process.pid} started`);
      }
    
    
   

    // const server = app.listen(port, () => {
    //     console.log(`Server is listening on port ${port}`);
    // });
    
    // const io = new Server(httpsServer, {
    //     cors: {
    //         origin: "http://localhost:3000",
    //         methods: ["GET", "POST"]
    //       }
    // });
    
    // io.on("connection", (socket)=> {
    //     const address = socket.handshake.address;
    //     console.log('New connection from ' + address.address + ':' + address.port);
       
    //     socket.on("connect", () =>{
    //         console.log( " client connected");

    //     });
    //     socket.on("disconnect", () =>{
    //         console.log( " client disconnected");

    //     });

    //     socket.on("countNotRead",() =>{
    //         const Bay_testing = require("./data/controllers/event.controller.js");

    //         io.sockets.()
    //     } );
    // });

    
    
    
    
     

