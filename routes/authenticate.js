const admin = require('firebase-admin');
const USERS = "users";

const  authenticate = async (email, password, fn) => {
    var db = admin.database();
    const userRef = db.ref(USERS);
    userRef.orderByChild("email").equalTo(email).limitToFirst(1).on("value", function(snapshot) {
        const user = snapshot.val();
        var userId;
    
        for (var id in user) {
            userId = id;
        }
        if (user[userId].password === password) {
            console.log("user is authenticated");
            fn(true, userId);
            return true;
        } else {
            console.log("user is not authenticated");
            fn(false, null);
            return false;
        }
    }, function (errorObject) {
        console.log("error while authenticating");
        console.log("The read failed: " + errorObject.code);
        return false;
    });
}

module.exports = {
    authenticate,
};
