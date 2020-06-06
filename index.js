const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const cors = require('cors');
const PORT = process.env.PORT || 5000

var con = mysql.createPool({
  host: "localhost",
  user: "devaxissoftware_admin",
  password: "Xtend321",
  database: "devaxissoftware_Organizer"
});

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(cors())
  .use(express.urlencoded({ extended: true }))
  .use(express.json())
  .all("/*", function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
  })
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', function (req, res) {
    res.send('Hello World! Test string');
  })
  .get('/db', function (req, res) {
    console.log("Connected");
    con.query("SELECT * FROM USERS", (err, rows) => {
      if (err) {
        return console.error("Error: " + err.message);
      }
      console.log(rows.PASSWORD);
      res.send(rows);
    })
  })
  .post('/auth/registerUser', async (req, res) => {
    console.log("/auth/registerUser " + req);

    var username = req.body.email;
    var password = req.body.password;
    var fName = req.body.firstName;
    var lName = req.body.lastName;

    //console.log("username: "+username +" password: " + password + " First name: " +fName +" Last name:"+ lName);

    //var insertP = `INSERT INTO USERS (EMAIL, PASSWORD, FirstName, LastName) VALUES(${username},${hash},${fName},${lName})`;

    console.log("Connected");
    bcrypt.hash(password, 10, function (err, hash) {
      if (err) {
        return console.error("Error: " + err.message);
      }
      console.log("password hashed");
      //console.log(`INSERT INTO USERS (EMAIL, PASSWORD, FirstName, LastName) VALUES("${username}","${hash}","${fName}","${lName}")`);
      con.query(`INSERT INTO USERS (EMAIL, PASSWORD, FirstName, LastName) VALUES("${username}","${hash}","${fName}","${lName}")`, function (err, result) {
        if (err) {
          return console.error("Error: " + err.message);
        }
        if (!result) {
          console.log("bad result");
          result = { success: false, email: username };
        } else {
          console.log("good result");
          result = { success: true, username: username };
        }
        res.json(result);
      });
    });
  })
  .post('/auth/login', async (req, response) => {
    console.log("/auth/login");
    var username = req.body.email;
    var password = req.body.password;
    var hashedpass = null;

    con.query(`SELECT PASSWORD FROM USERS WHERE EMAIL = "${username}"`, function (err, res) {
      if (err) {
        return console.error("Error: " + err.message);
      }

      result = JSON.stringify(res[0])
      result = result.replace(/(^\[)/, '');
      result = result.replace(/(\]$)/, '');
      try {
        var resultObj = JSON.parse(result);
      } catch (e) {
        console.log("Error, not a valid JSON string");
      }
      var my_value = resultObj["PASSWORD"];
      console.log("parsed res: " + my_value);

      if (res.length === 0) {
        res = { success: false, message: "Login Error: User not found!" };
        response.json(res);
        console.log("Fail User doesn't match");
      }
      else {
        hashedpass = my_value;
        bcrypt.compare(password, hashedpass, function (err, ress) {
          if (err) {
            return console.error("Hash Error: " + err.message);
          }
          if (!ress) {
            ress = { success: false, message: "Login Error: Password doesn't match!" };
            console.log("Fail: Password doesn't match");
          }
          else {
            ress = { success: true, message: "Successful Login!" };
            console.log("Success!");
          }
          response.json(ress);
        });
      }
    });
  })
  .get('/index', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${PORT}`))
