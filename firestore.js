const admin = require('firebase-admin')

const firestoreKey = require('./firestoreKey.json'); 

admin.initializeApp({
    credential: admin.credential.cert(firestoreKey),
    databaseURL: "gs://ecommerce-c0230.appspot.com"
})

console.log('base de datos conectada')