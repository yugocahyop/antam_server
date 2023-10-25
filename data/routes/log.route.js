const auth = require("../../middleware/auth.js");
module.exports = (app) => {
    const App = require("../controllers/log.controller.js");
  
   
    app.get("/logs",auth, App.findAll);
    app.post("/logs/find",auth, App.findAll);
  
   
  };