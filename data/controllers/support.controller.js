const fs = require('fs');

exports.find = async(req, res ) => {
  fs.readdir("./support",  (err, files) => {
    if (err)
      console.log(err);
    else {
      return res.send({files:files});
    }
  });
}

exports.download = async(req, res) =>{

   

  // const f = await Monitoring.findOne({user_id: user_id, mac: mac}).exec();

  // controller.delete(res, Monitoring, req.params.id);

  let {file} = req.query;

  // console.log(`filename: ${file}`)

  res.download(`./support/${file}`);  

  
}