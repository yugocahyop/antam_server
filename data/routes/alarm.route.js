const auth = require("../../middleware/auth.js");
module.exports = (app) => {
    const App = require("../controllers/alarm.controller.js");
  
    // app.post("/alarm",auth, App.create);
   
    app.post("/alarm/find",auth, App.find);

    app.post("/alarm/find/last",auth, App.findLast);
  

  
    // app.put("/alarm/:id",auth, App.update);
  
    // app.delete("/alarm/:id",auth, App.delete);
  };