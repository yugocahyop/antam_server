const auth = require("../../middleware/auth.js");
module.exports = (app) => {
    const App = require("../controllers/support.controller.js");
  
    app.post("/support",auth, App.create);
    app.post("/support/download",auth, App.download);
  
  
    app.post("/support/find",auth, App.findAll);
  
    app.get("/support/:messageId",auth, App.findOne);
  
    app.put("/support/:messageId",auth, App.update);
  
    app.delete("/support/:messageId",auth, App.delete);
  };