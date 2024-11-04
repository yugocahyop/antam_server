const auth = require("../../middleware/auth.js");
module.exports = (app) => {
    const App = require("../controllers/monitoring.controller.js");
  
    // app.post("/monitoring",auth, App.create);
   
    app.post("/monitoring/find",auth, App.find2);
    app.post("/monitoring/find/start",auth, App.findStart);

    app.post("/monitoring/find/last",auth, App.findLast);

    app.post("/monitoring/find/start/last",auth, App.findStartlast);

    app.post("/monitoring/prepare",auth, App.excelPrepare2);

    app.get("/monitoring/download", App.excelDownload);
  

  
    // app.put("/monitoring/:id",auth, App.update);
  
    // app.delete("/monitoring/:id",auth, App.delete);
  };