const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', function (req, res) {
    res.send('Hello World!');

    /*var mysql = require('mysql');

    var con = mysql.createConnection({
    host: "localhost",
    user: "admin",
    password: "Xtend321"
});*/
  })
  .get('/index', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
