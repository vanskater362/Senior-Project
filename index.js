const express = require('express')
const path = require('path')
const mysql = require('mysql');
const PORT = process.env.PORT || 5000

var con = mysql.createConnection({
    host: "localhost",
    user: "devaxissoftware_admin",
    password: "Xtend321",
    database: "devaxissoftware_Organizer"});

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', function (req, res) {
    res.send('Hello World! Test string');
  })
  .get('/db', function (req, res) {
    con.connect(function(err){
      if(err){
        console.log("Error getting connection");
        return console.error("Error: " + err.message);
      }
      console.log("Connected");
      con.query("SELECT * FROM USERS", (err, rows) => {
        if(err){
          return console.error("Error: " + err.message);
        }
        console.log(rows);
        res.send(rows);
      })
    });
  })
  .get('/index', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
