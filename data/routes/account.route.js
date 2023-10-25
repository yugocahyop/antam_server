// const { auth } = require("firebase-admin");
const auth = require ("../../middleware/auth.js");
// const rateLimiter = require("../../middleware/rateLimiter.js");
module.exports = (app) => {
    const App = require("../controllers/account.controller.js");
  
    app.post("/register", App.register);

    // app.get("/site/default", App.getDefaultSite);
  
    app.post("/auth", App.login);
    app.post("/check", auth, App.checkUpdate);

    // app.get("/access", rateLimiter, App.getAccess);

    // app.post("/auth/sso", App.loginLdap);

    app.get("/auth/refresh", App.refresh );

    app.get("/account/activate/:activeToken", App.activate);
    app.post("/account/changepassword/:token", App.changePassword);
  
   
  };