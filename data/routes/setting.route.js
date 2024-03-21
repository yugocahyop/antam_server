const auth = require("../../middleware/auth.js");
module.exports = (app) => {
    const App = require("../controllers/setting.controller.js");
  
    // app.post("/call",auth, App.create);
   
    // app.post("/call/find",auth, App.find);

    app.post("/setting/find/last",auth, App.findLast);
  

  
    app.put("/setting/update",auth, App.update);
  
    // app.delete("/call/:id",auth, App.delete);
  };