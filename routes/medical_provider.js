const router = require("express").Router();
const admin = require('firebase-admin');
const {authenticate} = require('./authenticate');

const MEDICAL_PROVIDER = "medical_providers";
const NOTI_DEVICES = "noti_devices";

router.get('/medical_providers/seeding', async (req, res) => {
    //save new patient to patients/<patientId>
    var db = admin.database();
    const ref = db.ref(NOTI_DEVICES);
    
    ref.child("d101").set({
        fcm: "fKJlOCdwQu6yQq6hv7OKyy:APA91bGozfpeHFbTHFv9KQCvXrgnu9kBN8flz-WtMb8R_Tds6MMRp5a1Kchunl5SgoCtKg6PHAqHe2BrJh8yMuSiByBjueCuZpYA_wJDBE1eT08EhvSyA8GVPTRkqjct-o5l4Je8RCok",
        id: "d101",
    });
    ref.child("d202").set({
        fcm: "",
        id: "d202",
    });
    ref.child("d303").set({
        fcm: "",
        id: "303",
    });
    res.json({status: "seeded"});
});

router.post('/medical_providers/login', async (req, res) => {
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
            var ref = db.ref(MEDICAL_PROVIDER);
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


