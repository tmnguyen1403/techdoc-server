const router = require("express").Router();
const admin = require('firebase-admin');

router.get('/patient/:id/doctors', async (req, res) => {
    const {id} = req.params;
   //firestore connect
    const registrationTokens = [
        "fKJlOCdwQu6yQq6hv7OKyy:APA91bGozfpeHFbTHFv9KQCvXrgnu9kBN8flz-WtMb8R_Tds6MMRp5a1Kchunl5SgoCtKg6PHAqHe2BrJh8yMuSiByBjueCuZpYA_wJDBE1eT08EhvSyA8GVPTRkqjct-o5l4Je8RCok",
   "dqYblUw2R6GlAEKDJbwztv:APA91bFQ0Vp1z4Itj_uj2zODlAT3ihSJtc30crxC75M_W1aInmnDtHnfjTanUY2E8EcH8mTEf5kIsGEJ8btE82IGu7XRb9h"];
   
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
});


module.exports = router;