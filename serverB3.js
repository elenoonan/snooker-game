console.log('Server-side code running');

const express = require('express');
const bodyparser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();

// serve files from the public directory
app.use(express.static('public'));
// needed to parse JSON data in the body of POST requests
app.use(bodyparser.json());

// connect to the db and start the express server
let db;

// ***Replace the URL below with the URL for your database***
//const url =  'mongodb://user:password@mongo_address:mongo_port/databaseName';
// E.g. for option 2) above this will be:
const url =  'mongodb://localhost:27017/score';

MongoClient.connect(url, (err, database) => {
  if(err) {
    return console.log(err);
  }
  db = database;
  // start the express web server listening on 8080
  app.listen(8080, () => {
    console.log('listening on 8080');
  });
});

// serve the homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


//recording button clicks in DB
// app.post('/clicked', (req, res) => {
//   const scores = {score: 10};
//   //console.log(score);
//   console.log(db);
//
//   db.collection('score').save(scores, (err, result) => {
//     if (err){
//       return console.log(err);
//     }
//     console.log('click added to db');
//     res.sendStatus(201);
//   });
// });


//sending a json object in request body and then getting the score value ... score is a property of the json object
app.post('/scored', (req, res) => {
  let scoreData = req.body['data'];
  console.log(scoreData);
  //const scores = {score: scoreData};
  //console.log(score);
  console.log(db);

  db.collection('score').update({},scoreData,{
    upsert: true
  }, (err, result) => {
    if (err){
      return console.log(err);
    }
    console.log('click added to db');
    res.sendStatus(201);
  });
});


//getting data from the DB
//adds a GET endpoint at http://localhost:8080/score which will return an array containing all the documents in the DB i.e. one item in the array being the updated score
app.get('/scored', (req, res) =>{
  db.collection('score').find().toArray((err, result) =>{
    if (err) return console.log(err);
    res.send(result);
  });
});
