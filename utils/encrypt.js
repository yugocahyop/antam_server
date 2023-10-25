const CryptoJS = require("crypto-js");

exports. decode = (encoded)=> {
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

  exports. encode = (value) =>{
    // INIT
   
  
    // PROCESS
    try {
        const encodedWord = CryptoJS.enc.Utf8.parse(value); // encodedWord Array object
      const encoded = CryptoJS.enc.Base64.stringify(encodedWord); // encodedWord via Base64.parse()
    //   const decoded = CryptoJS.enc.Utf8.stringify(encodedWord); // decode encodedWord via Utf8.stringify() '75322541'
      return encoded;
    }catch(err){
      console.log(err);
      return "";
    }
   
    
  }