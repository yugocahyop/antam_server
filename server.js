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
// const { JSONParser } = require('formidable/parsers/index.js');

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

        const cron = require('node-cron');

    cron.schedule("0 0 0 * * *", async ()=>{
      const Monitoring = require("./data/models/monitoring.model.js");
      const Alarm = require("./data/models/alarm.model.js");
      const Diagnostic = require("./data/models/diagnostic.model.js");
      const Statistic = require("./data/models/statistic.model.js");
      const Status = require("./data/models/status.model.js");

      console.log("delete execute");

      const maxDate = 604800000 * 8;
      
      Monitoring.deleteMany({timeStamp_server: {$lt: (Date.now() - maxDate)}}).exec();
      Alarm.deleteMany({timeStamp_server: {$lt: (Date.now() - maxDate)}}).exec();
      Diagnostic.deleteMany({timeStamp_server: {$lt: (Date.now() - maxDate)}}).exec();
      Statistic.deleteMany({timeStamp_server: {$lt: (Date.now() - maxDate)}}).exec();
      Status.deleteMany({timeStamp_server: {$lt: (Date.now() - maxDate)}}).exec();

      
    });



       let alarmTeganganList= [];
       let alarmArusList = [];
       let alarmSuhuList= [];
       let alarmPhList = [];
     
       let notificationList = [];

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

        [
          {
            "sel": 1,
            "suhu": 0.0,
            "pH": 0.0,
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

      let diagData = [
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
      
      ];

     
      
      

      

        

        const mqtt = require("mqtt");
        const client = mqtt.connect(`mqtt://${process.env.MQTT_IP}:${process.env.MQTT_PORT}`, {password: "xirka@30", username: "xirka"});

        let diag = require("./data/models/diagnostic.model.js");

        client.on("connect", async () => {
         

          const {listAlarmTegangan, listAlarmArus, listAlarmSuhu, listAlarmPh} = await diag.findOne({}).sort({timeStamp_server: -1}).exec();

          alarmArusList = listAlarmArus ?? [];
          alarmTeganganList = listAlarmTegangan ?? [];
          alarmSuhuList = listAlarmSuhu ?? [];
          alarmPhList = listAlarmPh ?? [];
          // alarmEnergiList = listAlarmEnergi ?? [];

          const rDiag2 = await diag.findOne({ }).sort({timeStamp_server:-1}).exec();

          if (rDiag2){
            // arr.splice(0, diagData.length);
            for (let index = 0; index < rDiag2.diagnosticData.length; index++) {
              const element = rDiag2.diagnosticData[index];

              for (let index2 = 0; index2 < element.length; index2++) {
                const e = element[index2];

                diagData[index][index2]["sel"] = e["sel"];
                diagData[index][index2]["status"] = e["status"];
                diagData[index][index2]["lastUpdated"] = e["lastUpdated"];
                
              }
              
            }
          }

          let monitData =  (await monit.find({}).sort({timeStamp_server: -1}).limit(1).exec())[0];

          if(monitData){
            // tangkiData = monitData.tangkiData;
    
            for (let index = 0; index < monitData.tangkiData.length; index++) {
              const e = monitData.tangkiData[index];
    
              for (let index2 = 0; index2 < e.length; index2++) {
                const ee = e[index2];
                if(index < 6){
                  
    
                  tangkiData[index][index2]["suhu"] = ee["suhu"];
                  tangkiData[index][index2]["tegangan"] = ee["tegangan"];
                  tangkiData[index][index2]["arus"] = ee["arus"];
                  tangkiData[index][index2]["daya"] = ee["daya"];
                  tangkiData[index][index2]["energi"] = ee["energi"];
                }else if( index ==6 && index2 == 0){
                  tangkiData[index][index2]["pH"] = ee["pH"] ?? 0;
                  tangkiData[index][index2]["suhu"] = ee["suhu"] ?? 0;
                }else if (index==6 && index2 > 0) {
                  break;
                }
                
                
              }
              
            }
          }

          client.subscribe("antam/device",  {qos: 1}, (err) => {
            if(err){
              console.log(err);
            }
          });

          client.subscribe("antam/device/node", {qos: 1}, (err) => {
            if(err){
              console.log(err);
            }
          });

          client.subscribe("antam/status",  {qos: 1}, (err) => {
            if(err){
              console.log(err);
            }
          });

          client.subscribe("antam/statistic", {qos: 1}, (err) => {
            if(err){
              console.log(err);
            }
          });

          client.subscribe("antam/statusNode", {qos: 1}, (err) => {
            if(err){
              console.log(err);
            }
          });

          client.subscribe("antam/statusnode",  {qos: 1}, (err) => {
            if(err){
              console.log(err);
            }
          });

          console.log("connected mqtt");
        });

        let isTimeShift = false;

         const monit = require("./data/models/monitoring.model.js");
         const Alarm = require("./data/models/alarm.model.js");
         const monitNode = require("./data/models/monitoringNode.model.js");
         const Status = require("./data/models/status.model.js");
         let statistic = require("./data/models/statistic.model.js");
         const {messaging} = require("./utils/fcm.js");
         const moment = require("moment")

         function sendPushNotification  ( body, title, topic,data ){
          const payload = {
            notification: {
                title: title,
                body: body,
                
            },
            topic: topic || "antam",
            data: data ?? {}
            // token: "eQiRNSTCJpu0p7LxCJPJzc:APA91bH_zWYUi61i1cdozoO9vWbIIOuwOo10FgQZwwMO6B2opg1hF-2j7eayMjDHKeQNoOCSvYFWq8_0BirFHh5RLGVLJsr_dNqAYtjV3OMUp_Jl8MYopYz6TqY_A4H_M7TnWFzq2phf",
            };
        
            
        
        
        messaging.send(payload)
        .then(() => {
            // console.log( "topic: " +(topic || "pln-rtd"))
        }).catch(err =>{
          console.log(err);
        })
      }

        client.on("message", async (topic, message) => {
          // message is Buffer

          // const jsonData = JSON.parse(message.toString());

          // if(jsonData.timeStamp){
          //   console.log(jsonData.timeStamp + "");
          //   // const dateNow = Date.now();
          //   // const diff = ((dateNow /1000) - (jsonData.timeStamp )) ;
          //   // if(( diff < 0 ? diff *-1: diff) > 5){
          //   //   console.log(`timeSync execute ${diff}`);
          //   //   client.publish("antam/timeSync", JSON.stringify({oldTimeStamp: jsonData.timeStamp, timeShift: Math.floor(diff)}) )
          //   // }
          // }
          

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
            let { timeStamp, tangki, node, status} = JSON.parse(message.toString());
            // let diag = require("./data/models/diagnostic.model.js");

            // const jsonData = JSON.parse(message.toString());

            if(tangki > 7 || node > 5 || tangki <= 0 || node <= 0){
              return;
            }

          if(timeStamp){
           
            // console.log(timeStamp + "");
            const dateNow = Date.now();
            const diff = ((dateNow /1000) - timeStamp ) ;
            // console.log(`diff ${diff}`)
            // console.log(`dateNow ${dateNow/ 1000}`)
            if(( diff > 5 || diff < -5 ) && !isTimeShift){
              isTimeShift = true;
              console.log(`timeSync execute ${diff}`);
              client.publish("antam/timeSync", JSON.stringify({oldTimeStamp: timeStamp, timeShift: Math.floor(diff)}), {qos: 2} );

              setTimeout(()=>{
                isTimeShift = false;
              }, 10000)
            }
          }

            

            // console.log(JSON.parse(message.toString()));


         

            if(typeof timeStamp === 'undefined'){
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

            const statusString = status + "";
            const dateNow = Date.now();

            if(statusString.search("alarmArusTinggi") != -1 || statusString.search("alarmArusRendah") != -1 || statusString.search("alarmTegangan") != -1 ||statusString.search("alarmSuhuTinggi") != -1||
            statusString.search("alarmSuhuRendah") != -1 || statusString.search("alarmPhTinggi") != -1 || statusString.search("alarmPhRendah") != -1 || statusString === "alarm"){
              

              if(statusString.search("Arus") != -1 ||  statusString === "alarm") {
                let aAl = alarmArusList.filter((e)=> e[0] == tangki && e[1] == node);

                if(aAl.length == 0){
                  alarmArusList.push([tangki, node]);
                }
              } 
                if(statusString.search("Tegangan") != -1 ||  statusString === "alarm") {
                let aAl = alarmTeganganList.filter((e)=> e[0] == tangki && e[1] == node);

                if(aAl.length == 0){
                  alarmTeganganList.push([tangki, node]);
                }
              }

              if(statusString.search("Suhu") != -1 ||  statusString === "alarm") {
                let aAl = alarmSuhuList.filter((e)=> e[0] == tangki && e[1] == node);

                if(aAl.length == 0){
                  alarmSuhuList.push([tangki, node]);
                }
              }
              if(statusString.search("Ph") != -1 ||  statusString === "alarm") {
                let aAl = alarmPhList.filter((e)=> e[0] == tangki && e[1] == node);

                if(aAl.length == 0){
                  alarmPhList.push([tangki, node]);
                }
              }
              

              const na = new Alarm({
                tangki: tangki,
                node: node,
                timeStamp: timeStamp,
                timeStamp_server: dateNow ,
                status: status,
                
              });

              na.save();

              const now = moment().format('DD/MM/yyy HH:mm:ss') ;

              let msgA = "";

              if (statusString === "alarm") {
                  
                msgA = 
                    `Terjadi masalah pada sel ${tangki} - ${node}`;
              } else {
                // showMsg(data["tangki"], data["node"],
                //     "");
                    msgA =
                      `${statusString.search("Rendah") != -1? "Minimum" : "Maksimum"} ${statusString.replace("alarm", "").replace("Tinggi", "").replace("Rendah", "")} telah di lewati pada sel ${tangki} - ${node}`;
                  }

              if((notificationList.filter((e)=> e === msgA)) == 0){
                // const el = [tangki, node];

                notificationList.push(msgA);

                setTimeout(()=>{
                  
                  notificationList.splice(notificationList.indexOf((notificationList.filter((e)=> e === msgA))[0]),1)
                }, 60000 * 2);

                if (statusString === "alarm") {
                  
                  sendPushNotification(
                    `Antam Monitoring ${now}`, msgA, "antam-monitoring", {});
                } else {
                  // showMsg(data["tangki"], data["node"],
                  //     "");
                      sendPushNotification(
                        `Antam Monitoring ${now}`, msgA, "antam-monitoring", {});
                    }
              }

              
             
            }else {
              let aAl = alarmArusList.filter((e)=> e[0] == tangki && e[1] == node);
              let aTl = alarmTeganganList.filter((e)=> e[0] == tangki && e[1] == node);
              let aSl = alarmSuhuList.filter((e)=> e[0] == tangki && e[1] == node);
              let aDl = alarmPhList.filter((e)=> e[0] == tangki && e[1] == node);
             

              if(aAl.length > 0){
                alarmArusList.splice (alarmArusList.indexOf(aAl[0]), 1);
              }

              if(aTl.length > 0 ){
                alarmTeganganList.splice (alarmTeganganList.indexOf(aTl[0]), 1);
              }

              if(aSl.length > 0 ){
                alarmSuhuList.splice (alarmSuhuList.indexOf(aSl[0]), 1);
              }

              if(aDl.length > 0 ){
                alarmPhList.splice (alarmPhList.indexOf(aDl[0]), 1);
              }

              // if(aEl.length > 0 ){
              //   alarmEnergiList.splice (alarmEnergiList.indexOf(aEl[0]), 1);
              // }
            }
            
            diagData[tangki -1][node -1]["status"] = status;
            diagData[tangki -1][node -1]["lastUpdated"] = timeStamp * 1000;

            // console.log(`suhu : ${alarmSuhuList}`);

            client.publish("antam/status", JSON.stringify({ 
              timeStamp: Date.now(),
            status: true,
            alarmTegangan: alarmTeganganList.length > 0,
            alarmSuhu: alarmSuhuList.length > 0,
            alarmPh: alarmPhList.length > 0,
            alarmArus: alarmArusList.length > 0}), {qos: 1} )

            let nMonit = new diag({
              timeStamp: timeStamp,
              timeStamp_server: dateNow,
              diagnosticData: diagData,
              listAlarmArus: alarmArusList,
              listAlarmTegangan: alarmTeganganList,
              listAlarmSuhu: alarmSuhuList,
              listAlarmPh: alarmPhList
            });

            nMonit.save().catch((err)=>{
              console.log(err);  });

            // if(typeof rDiag === "undefined"){
           
  
             
            // }else{
             

            //   rDiag.save();
            // }

            
             
        
          }else if(topic == "antam/device/node"){
            // console.log(message);
            let { timeStamp, selData, tangki, sel, } = JSON.parse(message.toString());

            // console.log(tangkiData[0]);

            // console.log(JSON.parse(message.toString()));

            if( timeStamp   ){
           
              // console.log(timeStamp + "");
              let dateNow = Date.now();
              let diff = (dateNow /1000) - timeStamp  ;
              // console.log(`diff ${diff}`)
              // console.log(`dateNow ${dateNow/ 1000}`)
              if(( diff > 5 || diff < -5 && !isTimeShift ) ){
                isTimeShift = true;
                console.log(`timeSync execute ${diff}`);
                client.publish("antam/timeSync", JSON.stringify({oldTimeStamp: timeStamp, timeShift: Math.floor(diff)}), {qos: 2} );
  
                setTimeout(()=>{
                  isTimeShift = false;
                }, 10000)
              }
            }


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
            
           
            


            

            let node =  await monitNode.findOne({tangki: tangki, sel: sel}).exec();

            // console.log(monitData);

            
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
              // tangkiData[tangki -1][sel-1]  = selData;

              if(tangki == 7 && sel ==1){
                tangkiData[tangki -1][sel-1]["suhu"] = selData["suhu"];
                 tangkiData[tangki -1][sel-1]["pH"] = selData["pH"];
            
              }else{
                tangkiData[tangki -1][sel-1]["suhu"] = selData["suhu"];
                tangkiData[tangki -1][sel-1]["tegangan"] = selData["tegangan"];
                tangkiData[tangki -1][sel-1]["arus"] = selData["arus"];
                tangkiData[tangki -1][sel-1]["daya"] = selData["daya"];
                tangkiData[tangki -1][sel-1]["energi"] = selData["energi"];
              }
              
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

            // const payload = {
            //   "timeStamp": timeStamp,
            //   "tangkiData": tangkiData
            // }

            let nMonit = new monit({
              timeStamp: timeStamp,
              timeStamp_server: Date.now(),
              tangkiData: tangkiData
            })

            nMonit.save().catch((err)=>{
              console.log(err);});

            // client.publish("antam/device", JSON.stringify(payload), {qos: 2});
            
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
            
            

            let nMonit = new Status({
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

            
            

            // // let stat = await monit.findOne({timeStamp: {$gt: 0 }}).sort({timeStamp_server : -1}).exec();

            // // if(!stat){
              let nMonit = new statistic({
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
        require('./data/routes/user.route.js')(app);
        require('./data/routes/call.route.js')(app);
        require('./data/routes/log.route.js')(app);
        require('./data/routes/alarm.route.js')(app);
        require('./data/routes/setting.route.js')(app);
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

    
    
    
    
     

