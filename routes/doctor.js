const router = require("express").Router();
const admin = require('firebase-admin');
const {authenticate} = require('./authenticate');

const DOCTORS = "doctors";

router.get('/doctor/seeding', async (req, res) => {
    //save new patient to patients/<patientId>
    var db = admin.database();
    const ref = db.ref("users");
    //res.json({status: "seeded"});
    // ref.child("d101").set({
    //     email: "pamela@gmail.com",
    //     password: "pamela123",
    // });
    // ref.child("d202").set({
    //     email: "javier@gmail.com",
    //     password: "javier123",
    // });
    // ref.child("d303").set({
    //     email: "parag@gmail.com",
    //     password: "parag123",
    // });
});

router.post('/doctor/login', async (req, res) => {
    /* Test Command
    curl -d "email=pamela@gmail.com&password=pamela123" -X POST http://localhost:3003/doctor/login
    */
    const {id} = req.params;
    const {email, password} = req.body;
    console.log("patient email: ", email);
    console.log("patient password: ", password);

    //
    const fn = (isAuthenticated, userId) => {
        if (isAuthenticated) {
            //res.json({id: userId, authenticated: true});
            var db = admin.database();
            var ref = db.ref(DOCTORS);
            ref.orderByKey().equalTo(userId).on("value", (snapshot) => {
                const user = snapshot.val();
                if (user === null || user === undefined) {
                    res.json({error: "No record of user " + userId, isAuthenticated: true});
                    return;
                }
                var userId;
                for (var id in user) {
                    userId = id;
                }
                console.log("retrieve user info successfully")
                res.json({data: user[userId], isAuthenticated: true});
            }, (errorObject) => {
                res.json({error: "Error getting user info " + errorObject.code, isAuthenticated: false});
            });

        } else {
            console.log("error authenticating user");
            res.json({error: "Error authenticating user ", isAuthenticated: false});
        }
    }
    const isAuthenticated =  authenticate(email, password, fn);
    
});

module.exports = router;


