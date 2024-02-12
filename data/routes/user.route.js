const auth = require("../../middleware/auth.js");
module.exports = (app) => {
    const App = require("../controllers/user.controller.js");
  
    // app.post("/monitoring",auth, App.create);
   
    app.post("/user/find",auth, App.find);

    // app.post("/monitoring/find/last",auth, App.findLast);
  

  
    app.put("/user/:id",auth, App.update);
  
    // app.delete("/monitoring/:id",auth, App.delete);
  };