const router = require("express").Router();
const admin = require('firebase-admin');
const {authenticate} = require('./authenticate');
const PATIENTS = "patients";
const QUESTIONS = "questions";
const NOTI_DEVICES = "noti_devices";

router.get('/patient/:id/doctors', async (req, res) => {
    console.log(req.params);
    const {id} = req.params;
   //firestore connect
    const registrationTokens = [
        "fKJlOCdwQu6yQq6hv7OKyy:APA91bGozfpeHFbTHFv9KQCvXrgnu9kBN8flz-WtMb8R_Tds6MMRp5a1Kchunl5SgoCtKg6PHAqHe2BrJh8yMuSiByBjueCuZpYA_wJDBE1eT08EhvSyA8GVPTRkqjct-o5l4Je8RCok",
   "dqYblUw2R6GlAEKDJbwztv:APA91bFQ0Vp1z4Itj_uj2zODlAT3ihSJtc30crxC75M_W1aInmnDtHnfjTanUY2E8EcH8mTEf5kIsGEJ8btE82IGu7XRb9h"];
   //TODO - Firebase
    // 1. Save question to databse
    // 2. Request medical team ids using user id -- can be cached
    // 3. Request medicam team fcm -- can be cached
    // 4. Send notification to doctors

    // Doctor site
    // 1. Connect to question database to get update - order by time
    // 2. Able to mark answered question - tell who answer it



   //END TODO
    const message = {
        tokens: registrationTokens,
        notification: {
        body: 'This is an FCM notification that displays an image!',
        title: 'FCM Notification',
        },
    };
  
    const response = await admin
        .messaging()
        .sendMulticast(message);
    
    console.log("Response ", response);
    res.send(response);

});

router.get('/patient/:id/questions', async (req, res) => {
    const {id} = req.params;
    console.log("user id: ", id);
  
    //save to database
    var db = admin.database();
    var questionRef = db.ref(QUESTIONS);
    questionRef.orderByChild("askerId").equalTo(id.toString()).on("value", (snapshot) => {
        let questions = [];
        let result = snapshot.val();
        console.log("Questions ", result);

        for (questionId in result) {
            questions.push(result[questionId]);
        }
        res.json(questions);
    })
    /* Test Command
    curl -d "question=whoareyou" -X POST http://localhost:3003/patient/1/question
    #Existing patients
    curl -d "question=whoareyou" -X POST http://localhost:3003/patient/878000/question
    */
    //retrieve medical_provider ids
});

router.post('/patient/:id/question', async (req, res) => {
    const {id} = req.params;
    const {question} = req.body;
    console.log("user id: ", id);
    console.log("question: ", question);
   // const {id} = req.params;
   //firestore connect
    const registrationTokens = [
        "fKJlOCdwQu6yQq6hv7OKyy:APA91bGozfpeHFbTHFv9KQCvXrgnu9kBN8flz-WtMb8R_Tds6MMRp5a1Kchunl5SgoCtKg6PHAqHe2BrJh8yMuSiByBjueCuZpYA_wJDBE1eT08EhvSyA8GVPTRkqjct-o5l4Je8RCok",
   "dqYblUw2R6GlAEKDJbwztv:APA91bFQ0Vp1z4Itj_uj2zODlAT3ihSJtc30crxC75M_W1aInmnDtHnfjTanUY2E8EcH8mTEf5kIsGEJ8btE82IGu7XRb9h"];
    
    //save to database
    var db = admin.database();
    var questionRef = db.ref(QUESTIONS);
    var questionId = "q_" + Date.now().toString() + "_id";
    console.log("questionId ", questionId);
    var questionObject = {
        id: questionId,
        content: question,
        askerId: id, 
    };
    questionRef.child(questionId).set(questionObject);
    /* Test Command
    curl -d "question=whoareyou" -X POST http://localhost:3003/patient/1/question
    #Existing patients
    curl -d "question=whoareyou" -X POST http://localhost:3003/patient/997788/question
    */
    //retrieve medical_provider ids
    var patientRef = db.ref(PATIENTS);
    const errorHandler = (errorObject) => {
        res.json({error: "Error getting patient info " + errorObject.code});
    }
    const getMedicalTeamIds = async (patientRef, patientId, callback, errorHandler) => {
        
        patientRef.orderByKey().equalTo(patientId).on("value", (snapshot) => {
            const patient = snapshot.val();
            if (patient === null || patient === undefined) {
                res.json({error: "No record of patient " + id, isAuthenticated: true});
                return;
            }
            var patientId;
            for (var tId in patient) {
                patientId = tId;
            }
            const medicalTeamIds = patient[patientId].medicalTeam;
            console.log("retrieve medical team: ", medicalTeamIds);
            callback(medicalTeamIds, null, errorHandler);
        }, (errorObject) => {
            errorHandler(errorObject);
        });
    };
    const getFCMs = async (ids, callback, errorHandler) => {
        console.log(ids);
        var deviceRef = db.ref(NOTI_DEVICES);
        deviceRef.orderByKey().on("value", async (snapshot) => {
            const devices = snapshot.val();
            if (devices === null || devices === undefined) {
                res.json({error: "No record of devices "});
                return;
            }
            let registrationTokens = [];
            for (var tId in devices) {
                if (ids.includes(tId)) {
                    if (devices[tId].fcm !== '')
                        registrationTokens.push(devices[tId].fcm);
                }
            }
            console.log(registrationTokens);
            //send noti
            const TITLE = "Question from patient " + id;
            const message = {
                tokens: registrationTokens,
                notification: {
                    body: question,
                    title: TITLE,
                },
            };
          
            const response = await admin
                .messaging()
                .sendMulticast(message);
            
            console.log("Response ", response);
            res.json(questionObject);

        }, (errorObject) => {
            errorHandler(errorObject);
        });
    }
    getMedicalTeamIds(patientRef, id, getFCMs, errorHandler)
});

// router.get('/patient/login', async (req, res) => {
//     const {id} = req.params;
//     const {email, password} = req.body;
//     console.log("patient email: ", email);
//     console.log("patient password: ", password);


// });

router.post('/patient/login', async (req, res) => {
    /* Test Command
    curl -d "email=tom@gmail.com&password=tom123" -X POST http://localhost:3003/patient/login
    #Existing users but no data in patients
    curl -d "email=mario@gmail.com&password=mario123" -X POST http://localhost:3003/patient/login
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
            var patientRef = db.ref(PATIENTS);
            patientRef.orderByKey().equalTo(userId).on("value", (snapshot) => {
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


