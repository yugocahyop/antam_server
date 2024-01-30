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

 const { API_PORT, IP_ADDR} = process.env;

//  console.log(process.env);

 const MONGO_URI = `mongodb://adminAntam:BhchSUbyJLPf1xkQfxmR2Q491wzQDg6nqdfhVofHmpzOBMjY2jvFyZOG2myrzEc3EEQszUAKGF5AGIdaUOm6rGfYiLsmiIB7Mrc9@${IP_ADDR}:27017/antam_monitoring?authSource=admin&retryWrites=true&w=majority`
        
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
        const client = mqtt.connect("mqtt://202.148.1.57:7007", {password: "xirka@30", username: "xirka"});


        client.on("connect", () => {
          client.subscribe("antam/device", (err) => {
            if(err){
              console.log(err);
            }
          });

          client.subscribe("antam/device/node", (err) => {
            if(err){
              console.log(err);
            }
          });

          client.subscribe("antam/status", (err) => {
            if(err){
              console.log(err);
            }
          });

          client.subscribe("antam/statistic", (err) => {
            if(err){
              console.log(err);
            }
          });

          client.subscribe("antam/statusNode", (err) => {
            if(err){
              console.log(err);
            }
          });

          client.subscribe("antam/statusnode", (err) => {
            if(err){
              console.log(err);
            }
          });

          console.log("connected mqtt");
        });

        client.on("message", async (topic, message) => {
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
              timeStamp_server: Date.now(),
              tangkiData: tangkiData
            })

            nMonit.save().catch((err)=>{
              console.log(err);
             
          });
          }else
          
          if(topic == "antam/statusNode" || topic == "antam/statusnode"){
            // console.log(message);
            let { timetamp, tangki, node, status} = JSON.parse(message.toString());

            // console.log(tangkiData[0]);


            if(typeof timestamp === 'undefined'){
              console.log("no timeStamp ");
              return;
            }else if(isNaN(timeStamp)){
              console.log("wrong timeStamp format");
              return;
            }

            if(typeof tangki === 'undefined'){
              console.log("no tangki ");
              return;
            }

            if(typeof node === 'undefined'){
              console.log("no node ");
              return;
            }

            if(typeof status === 'undefined'){
              console.log("no status ");
              return;
            }
            
            let diag = require("./data/models/diagnostic.model.js");

            const rDiag = await diag.findOne({timeStamp: {$gt: 0}}).sort({timeStamp_server:-1}).exec();

            if(!rDiag){
              let nMonit = new diag({
                timeStamp: timeStamp,
                timeStamp_server: Date.now(),
                diagnosticData: [
                  [
                    {"sel": 1, "status": "inactive", "lastUpdated": 1706561733680},
                    {"sel": 2, "status": "inactive", "lastUpdated": 1706561733680},
                    {"sel": 3, "status": "inactive", "lastUpdated": 1706561733680},
                    {"sel": 4, "status": "inactive", "lastUpdated": 1706561733680},
                    {"sel": 5, "status": "inactive", "lastUpdated": 1706561733680},
                  ],
                  [
                    {"sel": 1, "status": "inactive", "lastUpdated": 1706561733680},
                    {"sel": 2, "status": "inactive", "lastUpdated": 1706561733680},
                    {"sel": 3, "status": "inactive", "lastUpdated": 1706561733680},
                    {"sel": 4, "status": "inactive", "lastUpdated": 1706561733680},
                    {"sel": 5, "status": "inactive", "lastUpdated": 1706561733680},
                  ],
                  [
                    {"sel": 1, "status": "inactive", "lastUpdated": 1706561733680},
                    {"sel": 2, "status": "inactive", "lastUpdated": 1706561733680},
                    {"sel": 3, "status": "inactive", "lastUpdated": 1706561733680},
                    {"sel": 4, "status": "inactive", "lastUpdated": 1706561733680},
                    {"sel": 5, "status": "inactive", "lastUpdated": 1706561733680},
                  ],
                  [
                    {"sel": 1, "status": "inactive", "lastUpdated": 1706561733680},
                    {"sel": 2, "status": "inactive", "lastUpdated": 1706561733680},
                    {"sel": 3, "status": "inactive", "lastUpdated": 1706561733680},
                    {"sel": 4, "status": "inactive", "lastUpdated": 1706561733680},
                    {"sel": 5, "status": "inactive", "lastUpdated": 1706561733680},
                  ],
                  [
                    {"sel": 1, "status": "inactive", "lastUpdated": 1706561733680},
                    {"sel": 2, "status": "inactive", "lastUpdated": 1706561733680},
                    {"sel": 3, "status": "inactive", "lastUpdated": 1706561733680},
                    {"sel": 4, "status": "inactive", "lastUpdated": 1706561733680},
                    {"sel": 5, "status": "inactive", "lastUpdated": 1706561733680},
                  ],
                  [
                    {"sel": 1, "status": "inactive", "lastUpdated": 1706561733680},
                    {"sel": 2, "status": "inactive", "lastUpdated": 1706561733680},
                    {"sel": 3, "status": "inactive", "lastUpdated": 1706561733680},
                    {"sel": 4, "status": "inactive", "lastUpdated": 1706561733680},
                    {"sel": 5, "status": "inactive", "lastUpdated": 1706561733680},
                  ],
                  [
                    {"sel": 1, "status": "inactive", "lastUpdated": 1706561733680},
                  ],
                
                ]
              })
  
              nMonit.save().catch((err)=>{
                console.log(err);  });
            }else{
              rDiag.diagnosticData[tangki -1][node -1][status] = status;
              rDiag.diagnosticData[tangki -1][node -1][lastUpdated] = Date.now() - timeStamp;

              rDiag.save();
            }

            
             
        
          }else if(topic == "antam/device/node"){
            // console.log(message);
            let { timeStamp, selData, tangki, sel, } = JSON.parse(message.toString());

            // console.log(tangkiData[0]);

            console.log(JSON.parse(message.toString()));


            if(typeof timeStamp === 'undefined'){
              console.log("no timeStamp ");
              return;
            }else if(isNaN(timeStamp)){
              console.log("wrong timeStamp format");
              return;
            }

            if(typeof selData === 'undefined'){
              console.log("no seldata ");
              return;
            }

            if(typeof tangki === 'undefined'){
              console.log("no tangki ");
              return;
            }

            if(typeof sel === 'undefined'){
              console.log("no sel ");
              return;
            }
            
            let monit = require("./data/models/monitoring.model.js");
            let monitNode = require("./data/models/monitoringNode.model.js");


            let monitData =  await monit.findOne({}).sort({timeStamp_server: -1}).exec();
            let node =  await monitNode.findOne({tangki: tangki, sel: sel}).exec();

            // console.log(monitData);

            let tangkiData = [
              
    
              [
                {
                  "sel": 1,
                  "suhu": 0.0,
                  "tegangan": 0.0,
                  "arus": 0.0,
                  "daya": 0.0,
                  "energi": 0.0
                },
                {
                  "sel": 2,
                  "suhu": 0.0,
                  "tegangan": 0.0,
                  "arus": 0.0,
                  "daya": 0.0,
                  "energi": 0.0
                },
                {
                  "sel": 3,
                  "suhu": 0.0,
                  "tegangan": 0.0,
                  "arus": 0.0,
                  "daya": 0.0,
                  "energi": 0.0
                },
                {
                  "sel": 4,
                  "suhu": 0.0,
                  "tegangan": 0.0,
                  "arus": 0.0,
                  "daya": 0.0,
                  "energi": 0.0
                },
                {
                  "sel": 5,
                  "suhu": 0.0,
                  "tegangan": 0.0,
                  "arus": 0.0,
                  "daya": 0.0,
                  "energi": 0.0
                },
              ],
              [
                {
                  "sel": 1,
                  "suhu": 0.0,
                  "tegangan": 0.0,
                  "arus": 0.0,
                  "daya": 0.0,
                  "energi": 0.0
                },
                {
                  "sel": 2,
                  "suhu": 0.0,
                  "tegangan": 0.0,
                  "arus": 0.0,
                  "daya": 0.0,
                  "energi": 0.0
                },
                {
                  "sel": 3,
                  "suhu": 0.0,
                  "tegangan": 0.0,
                  "arus": 0.0,
                  "daya": 0.0,
                  "energi": 0.0
                },
                {
                  "sel": 4,
                  "suhu": 0.0,
                  "tegangan": 0.0,
                  "arus": 0.0,
                  "daya": 0.0,
                  "energi": 0.0
                },
                {
                  "sel": 5,
                  "suhu": 0.0,
                  "tegangan": 0.0,
                  "arus": 0.0,
                  "daya": 0.0,
                  "energi": 0.0
                },
              ],
              [
                {
                  "sel": 1,
                  "suhu": 0.0,
                  "tegangan": 0.0,
                  "arus": 0.0,
                  "daya": 0.0,
                  "energi": 0.0
                },
                {
                  "sel": 2,
                  "suhu": 0.0,
                  "tegangan": 0.0,
                  "arus": 0.0,
                  "daya": 0.0,
                  "energi": 0.0
                },
                {
                  "sel": 3,
                  "suhu": 0.0,
                  "tegangan": 0.0,
                  "arus": 0.0,
                  "daya": 0.0,
                  "energi": 0.0
                },
                {
                  "sel": 4,
                  "suhu": 0.0,
                  "tegangan": 0.0,
                  "arus": 0.0,
                  "daya": 0.0,
                  "energi": 0.0
                },
                {
                  "sel": 5,
                  "suhu": 0.0,
                  "tegangan": 0.0,
                  "arus": 0.0,
                  "daya": 0.0,
                  "energi": 0.0
                },
              ],
              [
                {
                  "sel": 1,
                  "suhu": 0.0,
                  "tegangan": 0.0,
                  "arus": 0.0,
                  "daya": 0.0,
                  "energi": 0.0
                },
                {
                  "sel": 2,
                  "suhu": 0.0,
                  "tegangan": 0.0,
                  "arus": 0.0,
                  "daya": 0.0,
                  "energi": 0.0
                },
                {
                  "sel": 3,
                  "suhu": 0.0,
                  "tegangan": 0.0,
                  "arus": 0.0,
                  "daya": 0.0,
                  "energi": 0.0
                },
                {
                  "sel": 4,
                  "suhu": 0.0,
                  "tegangan": 0.0,
                  "arus": 0.0,
                  "daya": 0.0,
                  "energi": 0.0
                },
                {
                  "sel": 5,
                  "suhu": 0.0,
                  "tegangan": 0.0,
                  "arus": 0.0,
                  "daya": 0.0,
                  "energi": 0.0
                },
              ],
              [
                {
                  "sel": 1,
                  "suhu": 0.0,
                  "tegangan": 0.0,
                  "arus": 0.0,
                  "daya": 0.0,
                  "energi": 0.0
                },
                {
                  "sel": 2,
                  "suhu": 0.0,
                  "tegangan": 0.0,
                  "arus": 0.0,
                  "daya": 0.0,
                  "energi": 0.0
                },
                {
                  "sel": 3,
                  "suhu": 0.0,
                  "tegangan": 0.0,
                  "arus": 0.0,
                  "daya": 0.0,
                  "energi": 0.0
                },
                {
                  "sel": 4,
                  "suhu": 0.0,
                  "tegangan": 0.0,
                  "arus": 0.0,
                  "daya": 0.0,
                  "energi": 0.0
                },
                {
                  "sel": 5,
                  "suhu": 0.0,
                  "tegangan": 0.0,
                  "arus": 0.0,
                  "daya": 0.0,
                  "energi": 0.0
                },
              ],
              [
                {
                  "sel": 1,
                  "suhu": 0.0,
                  "tegangan": 0.0,
                  "arus": 0.0,
                  "daya": 0.0,
                  "energi": 0.0
                },
                {
                  "sel": 2,
                  "suhu": 0.0,
                  "tegangan": 0.0,
                  "arus": 0.0,
                  "daya": 0.0,
                  "energi": 0.0
                },
                {
                  "sel": 3,
                  "suhu": 0.0,
                  "tegangan": 0.0,
                  "arus": 0.0,
                  "daya": 0.0,
                  "energi": 0.0
                },
                {
                  "sel": 4,
                  "suhu": 0.0,
                  "tegangan": 0.0,
                  "arus": 0.0,
                  "daya": 0.0,
                  "energi": 0.0
                },
                {
                  "sel": 5,
                  "suhu": 0.0,
                  "tegangan": 0.0,
                  "arus": 0.0,
                  "daya": 0.0,
                  "energi": 0.0
                },
              ],
             
            ];

            if(monitData){
              tangkiData = monitData.tangkiData;
            }
            // else{
            //   let nMonit = new monit({
            //         timeStamp: timeStamp,
            //         timeStamp_server: Date.now(),
            //         tangkiData: tangkiData
            //       })
      
            //       nMonit.save().catch((err)=>{
            //         console.log(err);
                   
            //     });
            // }

           

            selData.sel = sel;

            try{
              tangkiData[tangki -1][sel-1]  = selData;
            }catch(err){

            }

            

            

            // console.log(tangkiData);

           

            if(!node ){
              let nMonitNode = new monitNode({
                timeStamp: timeStamp,
                tangki: tangki,
                sel: sel,
                selData: selData
              });

              nMonitNode.save().catch((err)=>{
                console.log(err);
               
              });
            }else{
              node.selData = selData;
              node.timeStamp = timeStamp;

              node.save().catch((err) =>{
                console.log(err);
              })
            }

            const payload = {
              "timeStamp": timeStamp,
              "tangkiData": tangkiData
            }

            client.publish("antam/device", JSON.stringify(payload));
            
             // let nMonit = new monit({
            //   timeStamp: timeStamp,
            //   tangkiData: tangkiData
            // })

            // nMonit.save().catch((err)=>{
            //   console.log(err);
             
            // });
          }
          else if(topic == "antam/status"){
            // console.log(message);
            let { timeStamp, status, alarmArus, alarmTegangan} = JSON.parse(message.toString());

            // console.log(tangkiData[0]);


            if(typeof timeStamp === 'undefined'){
              console.log("no timeStamp ");
              return;
            }else if(isNaN(timeStamp)){
              console.log("wrong timeStamp format");
              return;
            }

            if(typeof status !== 'boolean'){
              console.log("wrong stat format ");
              return;
            } 
            
            if(typeof alarmArus !== 'boolean'){
              console.log("wrong alarm arus format ");
              return;
            }

            if(typeof alarmArus !== 'boolean'){
              console.log("wrong alarm tegangan format ");
              return;
            }
            
            let monit = require("./data/models/status.model.js");

            let nMonit = new monit({
              timeStamp: timeStamp,
              status: status,
              alarmArus: alarmArus,
              alarmTegangan: alarmTegangan
            })

            nMonit.save().catch((err)=>{
              console.log(err);
             
          });
          }

          else if(topic == "antam/statistic"){
            // console.log(message);
            let { timeStamp, totalWaktu,
              teganganTotal,
              arusTotal,
              power,
              energi,} = JSON.parse(message.toString());

            // console.log(tangkiData[0]);


            if(typeof timeStamp === 'undefined'){
              console.log("no timeStamp ");
              return;
            }else if(isNaN(timeStamp)){
              console.log("wrong timeStamp format");
              return;
            }

            if(isNaN(totalWaktu)){
              console.log("wrong total waktu format ");
              return;
            } 
            
            if(isNaN(teganganTotal)){
              console.log("wrong teganganTotal format ");
              return;
            }

            if(isNaN(arusTotal)){
              console.log("wrong arusTotal format ");
              return;
            }

            if(isNaN(power)){
              console.log("wrong power format ");
              return;
            }
            if(isNaN(energi)){
              console.log("wrong teganganTotal format ");
              return;
            }

            
            let monit = require("./data/models/statistic.model.js");

            // // let stat = await monit.findOne({timeStamp: {$gt: 0 }}).sort({timeStamp_server : -1}).exec();

            // // if(!stat){
              let nMonit = new monit({
                timeStamp_server: Date.now(),
                timeStamp: timeStamp,
                totalWaktu: totalWaktu,
                teganganTotal: teganganTotal,
                arusTotal: arusTotal,
                power: power,
                energi: energi
              })
  
              nMonit.save().catch((err)=>{
                console.log(err);
              });
            // // }else{
            //   stat.timeStamp_server = Date.now();
            //   stat.timeStamp = timeStamp;
            //   stat.totalWaktu = totalWaktu;
            //   stat.teganganTotal = teganganTotal;
            //   stat.arusTotal = arusTotal;
            //   stat.power = power;
            //   stat.energi = energi;

            //   stat.save();
            // }

           
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
        require('./data/routes/monitoring.route.js')(app);
        require('./data/routes/diagnostic.route.js')(app);
        require('./data/routes/statistic.route.js')(app);
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

    
    
    
    
     

