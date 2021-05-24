const router = require("express").Router();
const admin = require('firebase-admin');
const {authenticate} = require('./authenticate');

const MEDICAL_PROVIDER = "medical_providers";
const CARE_PLANS = "care_plans";

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

router.get('/medical_provider/:id/care_plans', async (req, res) => {
    const {id} = req.params;
    console.log("user id: ", id);
    if (id === undefined) {
        res.json({});
        return;
    }
    var db = admin.database();
    var careRef = db.ref(CARE_PLANS);
    
    careRef.orderByChild("ownerId").equalTo(id).once("value", (snapshot) => {
        console.log("care plans", snapshot.val())
        const result = snapshot.val();
        var plans = []
        for (var i in result) {
            plans.push(result[i]);
        }
        res.json(plans);
        return;
    }, (errorObject) => {
        res.json({error: errorObject});
    })

    /* Test Command
    curl -X GET http://localhost:3003/medical_provider/d101/care_plans
    */
    //retrieve medical_provider ids
});

router.post('/medical_provider/:id/care_plan', async (req, res) => {
    const {id} = req.params;
    const {care_plan} = req.body;
    console.log("user id: ", id);
    console.log("care_plan: ", care_plan);
    if (care_plan === undefined) {
        res.json({});
        return;
    }
   // const {id} = req.params;
    //save to database
    var db = admin.database();
    var careRef = db.ref(CARE_PLANS);
    var careId = "cp_" + Date.now().toString() + "_id";
    console.log("careId ", careId);
    var careObject = {
        id: careId,
        content: care_plan,
        ownerId: id,
    };
    await careRef.child(careId).set(careObject);
    //const responseJson = await response.json();
    console.log("add care plan ", careObject);
    res.json(careObject);
    /* Test Command
    curl -d "care_plan=takecareofmypatient" -X POST http://localhost:3003/medical_provider/d101/care_plan
    #Existing patients
    curl -d "question=whoareyou" -X POST http://localhost:3003/patient/997788/question
    */
    //retrieve medical_provider ids
});

router.post('/medical_provider/login', async (req, res) => {
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


