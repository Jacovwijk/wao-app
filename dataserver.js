var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');

var multer = require('multer');
var upload = multer({dest : './public/uploads/'});

var app = express();
app.use(bodyParser.json());



function getConnection() {
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dataluik'
  });
  return connection;
}

app.listen(3000, function () {
  console.log('dataluik app on port 3000');
});

app.use(express.static('public'));

app.post('/files', upload.any(), function (req, res) {
  console.log(req.body);
  var connection = getConnection();
  connection.connect();
  var newFiles = {id: 0, title: req.body.title, category: req.body.category, filetype: req.body.filetype, image: req.files[0].filename};
  var query = connection.query('INSERT INTO dataluik SET ?', newFiles, function (err, result) {
    res.send(JSON.stringify(result.insertId));
    res.status(200).end();
  });
  connection.end();
});

app.get('/files', function(req, res) {
  var connection = getConnection();
  connection.connect();
  connection.query('SELECT * FROM dataluik ORDER BY id DESC', function(err, rows, fields) {
    if (!err) {
      res.send(JSON.stringify(rows));
      res.status(200).end();
    }
    else {
      console.log('Error while performing Query.');
    }
  });
  connection.end();
});

app.get('/file/:id', function(req, res){
  var id = req.params.id;
  var connection = getConnection();
  connection.connect();
  connection.query('SELECT * FROM dataluik WHERE id = ?', id, function(err, rows, fields) {
    if (!err) {
      res.send(JSON.stringify(rows));
      res.status(200).end();
    }
    else {
      console.log('Error while performing Query.');
    }
  });
  connection.end();
});

app.put('/file/:id', function (req, res) {
  var idf = req.params.id;
  var connection = getConnection();
  connection.connect();
  var editFile = {id: idf, title: req.body.title, category: req.body.category};
  var query = connection.query('UPDATE dataluik SET title = ?, category =? WHERE id = ?', [editFile.title, editFile.category, editFile.id] , function (err, result) {
    res.status(200).end();
  });
  connection.end();
});

app.put('/like/:id', function(req, res){
  var id = req.params.id;
  var connection = getConnection();
  connection.connect();
  connection.query('UPDATE dataluik SET votes = (votes + 1) WHERE id = ?', id, function(err, rows, fields) {
    if (!err) {
      console.log('No error found');
       res.status(200).end();
    }
    else {
      console.log('Error while performing Query.');
    }
  });
  connection.end();
});

app.delete('/file/:id', function(req, res) {
  var id = req.params.id;
  var connection = getConnection();
  connection.connect();
  connection.query('DELETE FROM dataluik WHERE id = ?', id,  function(err, rows, fields) {
    console.log('deleted ' + id);
    res.status(200).end();
  });
  connection.end();
});
