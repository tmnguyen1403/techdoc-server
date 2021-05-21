const router = require("express").Router();
const admin = require('firebase-admin');

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
    res.send(response);
});

module.exports = router;