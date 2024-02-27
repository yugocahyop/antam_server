const auth = require("../../middleware/auth.js");
module.exports = (app) => {
    const App = require("../controllers/call.controller.js");
  
    app.post("/call",auth, App.create);
   
    app.post("/call/find",auth, App.find);

    app.post("/call/find/last",auth, App.findLast);
  

  
    app.put("/call/:id",auth, App.update);
  
    app.delete("/call/:id",auth, App.delete);
  };