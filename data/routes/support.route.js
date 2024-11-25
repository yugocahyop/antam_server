const auth = require("../../middleware/auth.js");
module.exports = (app) => {
    const App = require("../controllers/support.controller.js");
  
    app.post("/support/find",auth, App.find);
  
    app.get("/support/download",auth, App.download);
  };