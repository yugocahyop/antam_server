// const { forEach, stubArray } = require("lodash");
// const Referensi_event = require("../models/jadwal.model.js");

const ObjectId = require("mongoose/lib/types/objectid");

function validate(body, inputList, struct, res ){
  
  for (let index = 0; index < inputList.length; index++) {
    const val = inputList[index];
    
    if(typeof body[val] === 'undefined'){
      res.status(400).send({error: val + " di perlukan"});
      return false;
    }else if( struct[val] === 'Number' && isNaN( body[val]) ){
      
      res.status(400).send({error: val + " harus nomer"});
      return false;
    }
  }


  return true;
}

exports.create = async (res, db, body, check, inputsList, struct, name)=>{
    

    // let {event_name, jenis_relay, nama_alat} = body;

    if(check){
      const re2 = await db.findOne(check).exec();
    

    if(re2){
      return res.status(400).send({error: name+ " sudah ada " });
    }
    }
    

    if( !validate(body, inputsList,struct, res)){
      return;
    }
    const re = new db(body);

    re.save().then((data)=>{
      // console.log(data);
      res.send({message: "ok" , id: data._id +""});
    }).catch((err)=>{
        console.log(err);
        res.status(500).send({error: "something wrong with the server"});
    })
}

// function escapeRegex(string) {
//   return string.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
// }

exports.find = async (res, db, query, find, sort)=>{

  try {

    

    let{limit, offset,} = query;

    let  l, o;

  if(isNaN(limit)  ){
    l = null;
  }else{
    l = limit;
  }

  if(isNaN(offset)){
    o = null;
  }
  else{
    o = offset;
  }

  

  const count = await db.count(find).exec();
  const history = await db.find(find).sort(sort).skip(o|| 0).limit(l|| count).exec();

  

  if(history){
      return res.send({count:count, data: history});

  }else{
      return res.send({error: "no data " })
  }
    
  } catch (error) {
    console.log(error);
    res.status(500).send({error:"internal server error"})
  }

  
}

exports.findOne = async (res, db, query, find, sort)=>{

  try {

    

    let{limit, offset,} = query;

    let  l, o;

  if(isNaN(limit)  ){
    l = null;
  }else{
    l = limit;
  }

  if(isNaN(offset)){
    o = null;
  }
  else{
    o = offset;
  }

  

  // const count = await db.count(find).exec();
  const history = await db.find(find).sort(sort).skip(o|| 0).limit(1).exec();

  

  if(history){
      return res.send({count:1, data: history});

  }else{
      return res.send({error: "no data " })
  }
    
  } catch (error) {
    console.log(error);
    res.status(500).send({error:"internal server error"})
  }

  
}

exports.update = async (res, db, body, id, inputsList, struct,) =>{
  
    
   
    const db2 = await db.findOne({_id: ObjectId(id)}).exec();

    if(!db2){
      return res.status(400).send({error: "id tidak di temukan"})
    }

    if(!validate(body, inputsList, struct, res)){
        return ;
    }

   for (let index = 0; index < inputsList.length; index++) {
    const val = inputsList[index];
    db2[val] = body[val];

   }

   
    db2.save().then((data)=>{
        res.send({message: "ok",  id: data._id +""});

       
    }).catch((err)=>{
        console.log(err);
        return res.status(500).send({error: "something wrong with the server"});
    })
}

exports.updateNoRes = async ( db, body, id, inputsList,) =>{
  
    
   
  const db2 = await db.findOne({_id: ObjectId(id)}).exec();

  if(!db2){
    return ;
  }

  // if(!validate(body, inputsList, struct, null)){
  //     return ;
  // }

 for (let index = 0; index < inputsList.length; index++) {
  const val = inputsList[index];
  db2[val] = body[val];

 }

 
  db2.save().catch((err)=>{
      console.log(err);
     
  })
}

exports.delete = async ( res, db, id) =>{
 
   
   
  await  db.findByIdAndRemove( ObjectId( id)).exec().then(()=>{

    res.send({message: "ok"});
    

        

    }).catch((err)=>{
      console.log(err)
      return res.status(500).send({error: "something wrong with the server"});
    });

 
   
}