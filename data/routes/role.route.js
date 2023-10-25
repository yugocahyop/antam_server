const auth = require("../../middleware/auth.js");
module.exports = (app) => {
    const App = require("../controllers/role.controller.js");
  
    app.post("/role",auth, App.create);
  
    app.post("/role/find",auth, App.findAll);

    app.put("/role/:id",auth, App.update);
  
    app.delete("/role/:id",auth, App.delete);
  };