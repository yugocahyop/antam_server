const axios = require("axios").default;

axios.defaults.port = 5000;

exports.get = async (ip, endpoint, body, headers)=>{
    console.log(body);

    let data = "";
    await axios({
        
        headers: headers ?? {"Content-Type": "application/json"},
        method: 'get',
        url: `${ip}${endpoint}`,
        data: body ,
        
      })
        .then(function (response) {
            console.log(response.data);
            // if(response.status === 200){
            data = response.data;
            // }
        }).catch((err)=>{
            console.log(err || "axios post error");
            data=  null;
        } ) ;


        return data;

}

exports.post = async (ip, endpoint, body, headers)=>{
    console.log(body);

    let data = "";
    await axios({
        
        headers: headers ?? {"Content-Type": "application/json"},
        method: 'post',
        url: `${ip}${endpoint}`,
        data: body ,
        
      })
        .then(function (response) {
            console.log(response.data);
            // if(response.status === 200){
            data = response.data;
            // }
        }).catch((err)=>{
            console.log(err || "axios post error");
            data=  null;
        } ) ;


        return data;

}
