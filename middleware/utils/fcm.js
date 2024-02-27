const admin = require("firebase-admin");

// const serviceAccount = require("../");


admin.initializeApp({
    credential:  admin.credential.applicationDefault(),
});

exports.messaging = admin.messaging()

