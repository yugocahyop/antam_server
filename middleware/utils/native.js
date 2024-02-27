// const { spawn } = require('node:child_process');
// const fs = require('fs');
// // const { sendFile } = require('express/lib/response');
// const { createClient } = require('redis');
// // const { chain } = require('lodash');

// const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
// const terminate = require('terminate');
const { spawn } = require('node:child_process');
const { createClient } = require('redis');



exports.ping = async (ip) =>{
  // const { spawn } = require('node:child_process');
// const fs = require('fs');
// const { sendFile } = require('express/lib/response');
// const { createClient } = require('redis');
// const { chain } = require('lodash');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

  let bat = spawn('ping', ['-c', '20' , ip ], {detached: true});

  let dat= "";

  let isAvailable = false;
  let isFinish =false;

  
  
   bat.stdout.on('data', (data) => {
    console.log(data.toString());


    try{

      dat += data.toString();

      // const result = JSON.parse(dat);
      if(dat.includes("0 received,") || data.includes("Name or service not known") || data.includes("Temporary failure in name resolution")){
        // bat.kill("SIGINT");
        isAvailable = false;
        isFinish =true;
        
      }else if(dat.includes("bytes from")){
        // bat.kill("SIGINT");
        isAvailable = true;
        isFinish =true;
      }
      //  res.send({ data: result });

      // bat.stdin.off();
    

      // return;
    }
    catch(err){
     
    }
  });

  bat.on('close', (code ) => {
    console.log(`child process exited with code ${code}`);

    
  });
  
  // let pid = bat.pid;

  const to = setTimeout(() => {
    try{

    //   bat.removeAllListeners("close");
    // bat.stdout.removeAllListeners("data");
    //   bat.kill("SIGINT");;

      if(!isFinish){
        isAvailable = false;
        isFinish = true;}
      // pid =null;
      // if(isFinish)return;
    // res.status(408).send({error: "server timeout"});
    // bat.stdin.off();
    // bat.kill("SIGINT");

    // // bat = null; // Does not terminate the Node.js process in the shell.
    // isFinish =true;
    }catch(err){
      
    }

    // return;
  }, 62500 * 2);

  while(!isFinish){
   await delay(300);
  }

  try{
    clearTimeout(to);
    // pid = null;
    bat.removeAllListeners("close");
    bat.stdout.removeAllListeners("data");
    //bat.disconnect();
    bat.kill("SIGINT");
   
    
  }catch(err){
    
  }

 

  dat = null;
  bat = null;

  return isAvailable;
}

exports.post = async(ip, endpoint, body) => {

  // const { spawn } = require('node:child_process');
// const fs = require('fs');
// const { sendFile } = require('express/lib/response');
// const { createClient } = require('redis');
// const { chain } = require('lodash');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))


  let bat = spawn('curl', ['--location', '--request', 'POST', `${ip}${endpoint}`, "--header", "Content-Type: application/json", "--data-raw", JSON.stringify(body),  ], {detached: true});

  // bat.on('exit', (code) => {
  //   // console.log(`Child exited with code ${code}`);
  // });

  let dat= "";


  let result;
  
   bat.stdout.on('data', (data) => {
    // console.log(data.toString());
    try{

      dat += data.toString();

      const result2 = JSON.parse(dat);
//       if(res){
//        res.send({ data: result });
// }

      result = result2;
      // bat.stdin.off();
      // bat.kill("SIGINT");

      // return;
    }
    catch(err){
      
    }
  });

  bat.on('close', (code) => {
    console.log(`child process exited with code ${code}`);

    
    
  });
  

  // let pid = bat.pid;

  const to = setTimeout(() => {
    try{

    //   bat.removeAllListeners("close");
    // bat.stdout.removeAllListeners("data");
      
    //   bat.kill("SIGINT");
      // pid = null;
    // if(result) return;
    // res.status(408).send({error: "server timeout"});

    // throw "timeout";
    // bat.stdin.off();
    // bat.kill("SIGINT"); 
    // bat = null;// Does not terminate the Node.js process in the shell.

    if(!result) result = "server timeout";
    }catch(err){

    }

    // return;
  }, 60000 * 4);


  while(!result){
    await delay(500);
  }

  // let pid = bat.pid;

  try{
    clearTimeout(to);
    // pid = null;
    bat.removeAllListeners("close");
    bat.stdout.removeAllListeners("data");
    //bat.disconnect();
    bat.kill("SIGINT");
   
    
  }catch(err){
    
  }

  if (result === "server timeout"){
    // try{
    // // result =null;
    // // dat = null;
    // }catch(err){
    //   console.log(err);
    // }
    dat = "";
    bat = null;
    // output = null;

    throw "server timeout";
  }
  
    // output = null;
    dat = "";
    bat = null;
  


  // console.log(result);

  // dat = null;

  return result;

}

exports.postDownload = async(ip, endpoint, file, size, body) => {

  // const { spawn } = require('node:child_process');
  // const fs = require('fs');
  // const { sendFile } = require('express/lib/response');
  // const { createClient } = require('redis');
  // const { chain } = require('lodash');
  
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

  // try{

  //   res.download(path, function (error) {
  //     console.log("Error : ", error);
  //   }); // Set disposition and send

    

  //   return;

  // }catch(err){
    
  // }

  let bat = spawn('curl', ['--location', '--request', 'POST', `${ip}${endpoint}`, "--header", "Content-Type: application/json", "--data-raw", JSON.stringify(body),
  //  "--output", "/var/www/pln-rtd/server/" +split[split.length -1]
    ], {detached: true});

  // bat.on('exit', (code) => {
  //   // console.log(`Child exited with code ${code}`);
  // });

  let dat= "";

  let output;

  let sendflag = false;
  
   bat.stdout.on('data', async (data) => {
    // console.log(data.toString());
    // console.log(data.toString());
    try{

      if(dat.includes("500 Internal Server Error")){
        
        //  res.status(500).send({error: "internal server error"})
        // throw "internal server error";
        output ="internal server error";
        return;
      }
      
      dat += data.toString();

      const result = JSON.parse(dat);

      output = result;
      

      
      // const result = JSON.parse(data.()
     
     
    }
    catch(err){
      // return res.status(500).send({error: "internal server error"})
    }
  });

  bat.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
   
  });
  

  // let pid = bat.pid;
  
  const to = setTimeout(() => {
    try{
      // bat.removeAllListeners("close");
      // bat.stdout.removeAllListeners("data");
      // bat.kill("SIGINT");
      // pid = null;
      // bat.stdin.off();
      // bat.kill("SIGINT");

      // bat = null;
    // res.status(408).send({error: "server timeout"});

    // throw "server timeout"

      if(!output)  output = "server timeout";

   
   
    // Does not terminate the Node.js process in the shell.
    }catch(err){
      
    }

    // return;
  }, 62500 *2);

  while(!output){
    await delay(500);
  }

  try{
    clearTimeout(to);
    // pid = null;
    bat.removeAllListeners("close");
    bat.stdout.removeAllListeners("data");
    //bat.disconnect();
    bat.kill("SIGINT");
    
    
  }catch(err){
    
  }

  if (output === "server timeout" || output === "internal server error"){
    // try{
    // // output = "";
    // // dat = "";
    // }catch(err){

    // }

    dat = "";
    bat = null;
    // output = null;

    throw "server timeout";
  }
  // else{
    // output = null;
    dat = "";
    bat = null;
  // }


  // dat = "";

  return output;

}

exports.get = async(ip, endpoint, body) => {

    // const { spawn } = require('node:child_process');
    // const fs = require('fs');
    // const { sendFile } = require('express/lib/response');
    // const { chain } = require('lodash');
    
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
      
    
      let output;
    
    // if(endpoint.includes("all")){
      
    
    //   try{
    
    //     const clientRedis = createClient({
    //       host : '127.0.0.1',
    //       // port : 6379,
    //       no_ready_check: true,
    //       auth_pass: 'IPvHNkqERlPRnoh//LxthiOP6mISMhJ/TEV6bKIPRFNFvC/iAyJZGn9BDWAHZN+untCB5EFHMLoVhE9U'   
    //     });
      
    //     // clientRedis.on('error', (err) => console.log('Redis Client Error', err));
        
        
    //     // clientRedis.on('error', (err) => console.log('Redis Client Error', err));
      
    //     await clientRedis.connect();
      
    //     await clientRedis.auth({password: "IPvHNkqERlPRnoh//LxthiOP6mISMhJ/TEV6bKIPRFNFvC/iAyJZGn9BDWAHZN+untCB5EFHMLoVhE9U"}, (err)=>{
    //       if(err)console.log(err);
    //     });
    //   // }
      
    //     const cache = await clientRedis.get(body.ipAddress);
    
    //     // console.log(cache);
      
    //     const now = Date.now();
    //   const val = JSON.parse(cache);
    
    //   // console.log(val);
    
    //   if(val){
    
    //     // if(val.ip === ip){
    
    //     // console.log(val.ip);
    //     const dif = now - val.datetime;
        
    //     if(dif <= 60000 *5){
    
    //       const count = val.value.length;
    
          
    //       output =  { count: count, data: val.value };
    
          
    //       return output;
    //     }
    //   // }
    //   }
    
       
    
       
    //   }catch (err){
    //     console.log(err);
    //   }
    // }
    
    
    
      let bat = spawn('curl', ['--location', '--request', 'GET', `${ip}${endpoint}`, "--header", "Content-Type: application/json", "--data-raw", JSON.stringify(body),  ], {detached: true});
    
      // bat.on('exit', (code) => {
      //   // console.log(`Child exited with code ${code}`);
      // });
    
     
    
      let dat= "";
    
    
    
    
      
       bat.stdout.on('data',async (data) => {
        // console.log(data.toString());
    
        try{
          dat += data.toString();
          const result = JSON.parse(dat);
    
          // let skipLimit = [];
    
          const files = result.Comtrade_Files;
    
          if(!files[0]){
            output = files;
    
            return;
          }
    
          const rr = [];
    
          // console.log(result.Comtrade_Files);
    
          for(let i=0; i<files.length; i++){
            const s = (files[i].File_Name + "").split(".")[0];
            // console.log(s);
             const file = rr.find((f)=>{return (f.File_Name+"").includes( s );});
             if(!file){
              rr.push({File_Name:s, time: files[i].time ,  Size: parseInt( files[i].Size)});
             }else{
              file.Size += parseInt( files[i].Size);
    
              file.Size = file.Size +"";
             } 
          }
    
    
          // if(endpoint.includes("all")){
    
          //   try{
          //     const clientRedis = createClient({
          //       host : '127.0.0.1',
          //       // port : 6379,
          //       no_ready_check: true,
          //       auth_pass: 'IPvHNkqERlPRnoh//LxthiOP6mISMhJ/TEV6bKIPRFNFvC/iAyJZGn9BDWAHZN+untCB5EFHMLoVhE9U'   
          //     });
            
          //     // clientRedis.on('error', (err) => console.log('Redis Client Error', err));
              
              
          //     // clientRedis.on('error', (err) => console.log('Redis Client Error', err));
            
          //     await clientRedis.connect();
            
          //     await clientRedis.auth({password: "IPvHNkqERlPRnoh//LxthiOP6mISMhJ/TEV6bKIPRFNFvC/iAyJZGn9BDWAHZN+untCB5EFHMLoVhE9U"}, (err)=>{
          //       if(err)console.log(err);
          //     });
      
          //     await clientRedis.set(body.ipAddress, JSON.stringify({datetime: Date.now(), value:rr},));
      
          //     setTimeout( async()=>{

          //       try {
          //         const clientRedis = createClient({
          //           host : '127.0.0.1',
          //           // port : 6379,
          //           no_ready_check: true,
          //           auth_pass: 'IPvHNkqERlPRnoh//LxthiOP6mISMhJ/TEV6bKIPRFNFvC/iAyJZGn9BDWAHZN+untCB5EFHMLoVhE9U'   
          //         });
                
          //         // clientRedis.on('error', (err) => console.log('Redis Client Error', err));
                  
                  
          //         // clientRedis.on('error', (err) => console.log('Redis Client Error', err));
                
          //         await clientRedis.connect();
                
          //         await clientRedis.auth({password: "IPvHNkqERlPRnoh//LxthiOP6mISMhJ/TEV6bKIPRFNFvC/iAyJZGn9BDWAHZN+untCB5EFHMLoVhE9U"}, (err)=>{
          //           if(err)console.log(err);
          //         });
          
          //         clientRedis.del(body.ipAddress);
          //       } catch (error) {
                  
          //       }
      
               
        
      
          //     }, 60000*5)
          //   }catch(err){
          //     console.log(err);
          //   }
    
          // }
    
         
    
          const count =  result.Comtrade_Files.length;
    
    
          output = { count: count, data: rr };
    
        }catch(err){
          console.log(err);
        }
      
      });
    
    
      bat.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    
       
      });

      // try {
      
     
      // let pid = bat.pid;
      
      // bat.kill
      const to = setTimeout(() => {
        try{
          // bat.removeAllListeners("close");
          // bat.stdout.removeAllListeners("data");
          // bat.kill("SIGINT");
          // pid = null;
    
          if(!output) output = "server timeout";
    
        }catch(err){
          console.log(err);
        }
    
        // return;
      }, 62500 * 2) ;
    
      while(!output){
         await delay(500);
      }
    
      try{
        clearTimeout(to);
        // pid = null;
        bat.removeAllListeners("close");
        bat.stdout.removeAllListeners("data");
        // bat.kill("SIGINT");
        //bat.disconnect();
        bat.kill("SIGINT");
        
        
      }catch(err){
        console.log(err);
      }
    
      if (output === "server timeout"){
        // try{
        // // output ="";
        // // dat ="";
        // }catch(err){
    
        // }
    
        // dat = "";
        // bat = null;
        // output = null;
    
        throw "server timeout";
      }
      // else{
        // output = null;
      //   dat = "";
      //   bat = null;
      // // }
    
     
      return output;
  // } catch (error) {
  //   console.log(error)
  //   throw error;
  // }

 

    
}