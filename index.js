const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const cors = require('cors');
const querystring = require('querystring');
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
  /*.get('/db', function (req, res) {
    console.log("Connected");
    con.query(`SELECT * FROM MILAGE WHERE UserID="5" AND Date="2020-06-18"`, (err, rows) => {
      if (err) {
        return console.error("Error: " + err.message);
      }
      //console.log(rows.PASSWORD);
      console.log(JSON.stringify(rows));
      res.send(rows);
    })
  })*/
  .get('/miles/get', (req, res) => {
    const userID = req.query.userId;
    const date = req.query.date;
    
    console.log(`SELECT * FROM milage WHERE UserID="${userID}" AND ${date} ORDER BY Date ASC`);
    con.query(`SELECT * FROM milage WHERE UserID="${userID}" AND ${date} ORDER BY Date ASC`, (err, result) => {
      if (err) {
        return console.error("Error: " + err.message);
      }
      console.log(JSON.stringify(result));
      res.json(result);
    })
  })
  .post('/miles/submit', async (req, res) => {
    var from = req.body.Beginning;
    var to = req.body.Ending;
    var date = req.body.Date;
    var total = req.body.total;
    var userID = req.body.UserID;

    con.query(`INSERT INTO milage (Beginning, Ending, Date, total, UserID) VALUES("${from}","${to}","${date}","${total}","${userID}")`, function (err, result) {
      if (err) {
        return console.error("Error: " + err.message);
      }
      if (!result) {
        console.log("miles not inputed");
        res.status(400).send({ message: "Miles Not Inputed." });
      } else {
        console.log("miles inputed");
        res.status(200).send({message: "Miles Inputed."})
      }
    });
  })
  .post('/client/updateStatus', async (req, res) => {
    var clientId = req.body.ClientID;
    var process = req.body.process;
    
    con.query(`UPDATE clients SET process = ${process} WHERE clientID = ${clientId}`, function(err, result) {
      if (err) {
        return console.error("Error: " + err.message);
      }
      if (!result) {
        console.log("client not updated");
        res.status(400).send({ message: "Client Not Updated." });
      } else {
        console.log("client updated");
        res.status(200).send({message: "Client Updated."})
      }
    });
  })
  .post('/client/submit', async (req, res) => {
    var firstName = req.body.FirstName;
    var lastName = req.body.LastName;
    var address1 = req.body.address1;
    var address2 = req.body.address2;
    var city = req.body.city;
    var state = req.body.state;
    var zip = req.body.zip;
    var email = req.body.EMAIL;
    var phone = req.body.PHONE;
    var process = req.body.process;
    var userID = req.body.UserID;

    con.query(`INSERT INTO clients (FirstName, LastName, address1, address2, city, state, zip, phone, email, process, UserID) 
               VALUES("${firstName}","${lastName}","${address1}","${address2}","${city}","${state}","${zip}", "${phone}","${email}","${process}","${userID}")`,
               function (err, result) {
      if (err) {
        return console.error("Error: " + err.message);
      }
      if (!result) {
        console.log("client not inputed");
        res.status(400).send({ message: "Client Not Inputed." });
      } else {
        console.log("client inputed");
        res.status(200).send({message: "Client Inputed."})
      }
    });
  })
  .get('/client/get', (req, res) => {
    const userID = req.query.userId;
    
    con.query(`SELECT * FROM clients WHERE UserID="${userID}"`, (err, result) => {
      if (err) {
        return console.error("Error: " + err.message);
      }
      res.json(result);
    })
  })
  .post('/auth/registerUser', async (req, res) => {
    var username = req.body.email;
    var password = req.body.password;
    var fName = req.body.firstName;
    var lName = req.body.lastName;

    bcrypt.hash(password, 10, function (err, hash) {
      if (err) {
        return console.error("Error: " + err.message);
      }
      console.log("password hashed");
      
      con.query(`INSERT INTO users (EMAIL, PASSWORD, FirstName, LastName) VALUES("${username}","${hash}","${fName}","${lName}")`, function (err, result) {
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

    con.query(`SELECT * FROM users WHERE EMAIL = "${username}"`, function (err, res) {
      if (err) {
        return console.error("Error: " + err.message);
      }

      if (res.length === 0) {
        response.status(400).send({ message: "Login Error: User not found!" });
        //res = { success: false, message: "Login Error: User not found!" };
        //response.json(res);
        console.log("Fail User doesn't match");
      }
      else {
        result = JSON.stringify(res[0]);
        result = result.replace(/(^\[)/, '');
        result = result.replace(/(\]$)/, '');
        try {
          var resultObj = JSON.parse(result);
        } catch (e) {
          console.log("Error, not a valid JSON string");
        }

        var my_value = resultObj["PASSWORD"];
        console.log("parsed res: " + my_value);

        hashedpass = my_value;
        bcrypt.compare(password, hashedpass, function (err, ress) {
          if (err) {
            return console.error("Hash Error: " + err.message);
          }
          if (!ress) {
            response.status(400).send({ message: "Login Error: Password doesn't match!" })
            console.log("Fail: Password doesn't match");
          }
          else {
            ress = resultObj;
            console.log("Success!");
            response.json(res);
          }
        });
      }
    });
  })
  .get('/index', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${PORT}`))
