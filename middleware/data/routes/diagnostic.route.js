const auth = require("../../middleware/auth.js");
module.exports = (app) => {
    const App = require("../controllers/diagnostic.controller.js");
  
    // app.post("/diagnostic",auth, App.create);
   
    app.post("/diagnostic/find",auth, App.find);

    app.post("/diagnostic/find/last",auth, App.findLast);
  

  
    // app.put("/diagnostic/:id",auth, App.update);
  
    // app.delete("/diagnostic/:id",auth, App.delete);
  };