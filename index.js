const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const admin = require("firebase-admin");

const cors = require('cors');
const port = 5000

app.use(bodyParser.json());
app.use(cors());



var serviceAccount = require("./burj-al-arab-5c59d-firebase-adminsdk-fqr8t-5adffd6224.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://burj-al-arab-5c59d.firebaseio.com"
});




const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://arab:arab555555@cluster0.tx9ov.mongodb.net/burj-al-arab?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("burj-al-arab").collection("burj-al-arab-booking");

  app.post('/addBooking', (req, res) => {
    const newBooking = req.body;
    collection.insertOne(newBooking)
      .then(result => {
        res.send(result.insertedCount > 0);
      })

    console.log(newBooking);
  });

  app.get('/getBooking', (req, res) => {
    const bearer = req.headers.authorization;
    if (bearer && bearer.startsWith('Bearer ')) {
      const idToken = bearer.split(' ')[1];
      console.log({ idToken });

      admin.auth().verifyIdToken(idToken)
        .then(function (decodedToken) {
          let uid = decodedToken.uid;
          console.log(uid);
          const tokenEmail = decodedToken.email;
          console.log(tokenEmail);
          const queryEmail = req.query.email;
          console.log(queryEmail)
          if(tokenEmail == queryEmail){
            collection.find({ email: queryEmail })
            .toArray((err, documents) => {
            res.send(documents);
      });
          }
          // ...
        }).catch(function (error) {
          // Handle error
        });
    }






    

  })

});




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})