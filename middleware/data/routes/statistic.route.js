const auth = require("../../middleware/auth.js");
module.exports = (app) => {
    const App = require("../controllers/statistic.controller.js");
  
    // app.post("/statistic",auth, App.create);
   
    app.post("/statistic/find",auth, App.find);

    app.post("/statistic/find/last",auth, App.findLast);
  

  
    // app.put("/statistic/:id",auth, App.update);
  
    // app.delete("/statistic/:id",auth, App.delete);
  };