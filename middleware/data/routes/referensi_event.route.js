const auth = require("../../middleware/auth.js");
module.exports = (app) => {
    const App = require("../controllers/referensi_event.controller.js");
  
    app.post("/referensi/event",auth, App.create);
  
    app.post("/referensi/event/find",auth, App.find);
  
  
    app.put("/referensi/event/:id",auth, App.update);
  
    app.delete("/referensi/event/:id",auth, App.delete);
  };