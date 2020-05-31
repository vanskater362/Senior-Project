const express = require('express')
const path = require('path')
const mysql = require('mysql');
const PORT = process.env.PORT || 5000
var con = mysql.createConnection({
    host: "localhost:3306",
    user: "admin",
    password: "Xtend321",
  databaes: "devaxissoftware_Organizer"});

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', function (req, res) {
    res.send('Hello World! Test string');
  })
  .get('/db', function (req, res) {
    con.connect(function(err){
      console.log("Connected!");
      con.query("SELECT * FROM `USERS`", function(err, result) {
        if(err) throw err;
        console.log("Result: " + result);
        res.send("Result: " + result);
      });
    });
    
  })
  .get('/index', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
