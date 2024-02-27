const auth = require("../../middleware/auth.js");
module.exports = (app) => {
    const App = require("../controllers/monitoring.controller.js");
  
    // app.post("/monitoring",auth, App.create);
   
    app.post("/monitoring/find",auth, App.find);

    app.post("/monitoring/find/last",auth, App.findLast);
  

  
    // app.put("/monitoring/:id",auth, App.update);
  
    // app.delete("/monitoring/:id",auth, App.delete);
  };