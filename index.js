const express = require('express')
const router = require("./routes");
const app = express();
const PORT = 3003;

var admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const firebaseEnv = require('./firebase_env.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: firebaseEnv.databaseUrl,
})

//const connection = require('./server');  

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use( express.urlencoded({extended: true}) )
app.use( express.json() )

app.use(router);
app.set("port", process.env.PORT || PORT);

app.listen(3003, () => {
    console.log("server listening at 3003");
    
});
